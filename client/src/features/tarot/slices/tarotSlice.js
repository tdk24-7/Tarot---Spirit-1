// src/features/tarot/slices/tarotSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllCards,
  getCardById,
  getDailyTarot,
  createStandardReading,
  createAIReading,
  getTwelveRandomCards,
  getUserReadings,
  saveReading,
  getSharedReading
} from '../services/tarotAPI';

import { interpretThreeCardReading } from '../services/tarotInterpretation';
import apiClient from '../../../shared/utils/api/apiClient';
import axios from 'axios';
import { API_URL } from '../../../config/constants';

// Async thunks
export const fetchAllCards = createAsyncThunk(
  'tarot/fetchAllCards',
  async (_, { rejectWithValue }) => {
    try {
      // Kiểm tra xem có sử dụng mock API không
      const useMockApi = localStorage.getItem('USE_MOCK_API') === 'true' ||
        process.env.REACT_APP_USE_MOCK_API === 'true';

      if (useMockApi) {
        // Sử dụng getAllCards từ tarotAPI.js
        const mockCards = await getAllCards();
        return normalizeCardData(mockCards);
      }

      // Nếu không sử dụng mock, gọi API thực
      const response = await apiClient.get('/cards');

      // Check if the response has the expected structure and extract cards array
      let cardsData = [];
      if (response.data && response.data.data && Array.isArray(response.data.data.cards)) {
        console.log('Đã nhận được lá bài từ API:', response.data.data.cards.length);
        cardsData = response.data.data.cards;
      } else if (response.data && Array.isArray(response.data)) {
        // Some APIs might return the array directly
        console.log('Đã nhận được lá bài từ API (mảng trực tiếp):', response.data.length);
        cardsData = response.data;
      } else {
        console.error('Không tìm thấy mảng cards trong phản hồi API:', response.data);
        return rejectWithValue({ message: 'Cấu trúc phản hồi API không đúng format' });
      }

      // Normalize card data
      return normalizeCardData(cardsData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu bài Tarot:', error.message || 'Unknown error');
      return rejectWithValue(error.response?.data || { message: 'Không thể tải dữ liệu bài Tarot' });
    }
  }
);

// Helper function to normalize card data
function normalizeCardData(cards) {
  console.log('Normalizing card data from database, input:', cards);

  return cards.map(card => {
    // Đảm bảo mọi thuộc tính đều được xác định
    // Logic chuẩn hóa dữ liệu

    // Trích xuất ý nghĩa bài xuôi
    let upMeaning = card.meaning ||
      card.general_upright_meaning ||
      card.upright_meaning;

    if (!upMeaning || upMeaning === 'Nghĩa chưa được cung cấp') {
      // Thử từ cơ sở dữ liệu
      upMeaning = card.description || `Ý nghĩa của lá bài ${card.name || 'Unknown Card'} đang được cập nhật`;
    }

    // Trích xuất ý nghĩa bài ngược
    let revMeaning = card.reversed_meaning ||
      card.general_reversed_meaning ||
      card.meaning_reversed;

    if (!revMeaning || revMeaning === 'Nghĩa ngược chưa được cung cấp') {
      revMeaning = `Ý nghĩa ngược của lá bài ${card.name || 'Unknown Card'} đang được cập nhật`;
    }

    // Tạo đối tượng chuẩn hóa
    const normalizedCard = {
      id: card.id || Math.random().toString(36).substring(2, 15),
      name: card.name || 'Unknown Card',
      imageUrl: card.imageUrl || card.image_url || '',
      arcana: card.arcana || (card.type === 'Major' ? 'Major' : 'Minor'),
      suit: card.suit || null,
      number: card.number || 0,
      description: card.description || '',
      meaning: upMeaning,
      reversed_meaning: revMeaning,
      isReversed: card.isReversed !== undefined ? card.isReversed === true : Math.random() < 0.4 // 40% chance to be reversed if not defined
    };

    console.log('Normalized card:', normalizedCard.name, { meaning: normalizedCard.meaning, reversed_meaning: normalizedCard.reversed_meaning, isReversed: normalizedCard.isReversed });

    return normalizedCard;
  });
}

export const fetchCardById = createAsyncThunk(
  'tarot/fetchCardById',
  async (cardId, { rejectWithValue }) => {
    try {
      return await getCardById(cardId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch card');
    }
  }
);

export const fetchDailyTarot = createAsyncThunk(
  'tarot/fetchDailyTarot',
  async (_, { rejectWithValue }) => {
    try {
      return await getDailyTarot();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch daily tarot');
    }
  }
);

export const fetchTwelveRandomCards = createAsyncThunk(
  'tarot/fetchTwelveRandomCards',
  async (_, { rejectWithValue }) => {
    try {
      // Kiểm tra xem có sử dụng mock API không
      const useMockApi = localStorage.getItem('USE_MOCK_API') === 'true' ||
        process.env.REACT_APP_USE_MOCK_API === 'true';

      if (useMockApi) {
        // Sử dụng getTwelveRandomCards từ tarotAPI.js
        const mockCards = await getTwelveRandomCards();
        return normalizeCardData(mockCards);
      }

      // Nếu không sử dụng mock, gọi API thực
      const response = await apiClient.get('/cards/random', {
        params: { limit: 12 }
      });

      // Check if the response has the expected structure and extract cards array
      let cardsData = [];
      if (response.data && response.data.data && Array.isArray(response.data.data.cards)) {
        console.log('Đã nhận được lá bài từ API:', response.data.data.cards.length);
        cardsData = response.data.data.cards;
      } else if (response.data && Array.isArray(response.data)) {
        // Some APIs might return the array directly
        console.log('Đã nhận được lá bài từ API (mảng trực tiếp):', response.data.length);
        cardsData = response.data;
      } else {
        console.error('Không tìm thấy mảng cards trong phản hồi API:', response.data);
        return rejectWithValue({ message: 'Cấu trúc phản hồi API không đúng format' });
      }

      // Normalize card data
      return normalizeCardData(cardsData);
    } catch (error) {
      console.error('Lỗi khi tải lá bài ngẫu nhiên:', error.message || 'Unknown error');
      return rejectWithValue(error.response?.data || { message: 'Không thể tải lá bài ngẫu nhiên' });
    }
  }
);

export const performStandardReading = createAsyncThunk(
  'tarot/performStandardReading',
  async (readingData, { rejectWithValue, getState }) => {
    try {
      console.log('performStandardReading được gọi với dữ liệu:', readingData);

      // Kiểm tra xem có sử dụng mock API không
      const useMockApi = localStorage.getItem('USE_MOCK_API') === 'true' ||
        process.env.REACT_APP_USE_MOCK_API === 'true';

      if (useMockApi) {
        // Sử dụng createStandardReading từ tarotAPI.js
        const mockReading = await createStandardReading(
          readingData.selectedIndices || [],
          readingData.displayedCards || [],
          readingData.domain || 'general',
          readingData.question || ''
        );

        return mockReading;
      }

      // Logic gọi API thực tế
      const { auth } = getState();

      // Check if token exists to determine if we need to attach auth headers
      const headers = {};
      if (auth.token) {
        headers['Authorization'] = `Bearer ${auth.token}`;
      }

      // Ghi log để debug
      console.log('Dữ liệu truyền vào:', {
        readingData,
        selectedIndices: readingData?.selectedIndices,
        displayedCards: readingData?.displayedCards
      });

      // Xử lý an toàn với dữ liệu không hợp lệ
      const displayedCards = Array.isArray(readingData?.displayedCards)
        ? readingData.displayedCards
        : [];

      const selectedIndices = Array.isArray(readingData?.selectedIndices)
        ? readingData.selectedIndices
        : [];

      if (!displayedCards.length || !selectedIndices.length) {
        console.warn('Dữ liệu bài tarot không đầy đủ, sử dụng giá trị mặc định');
        return {
          id: `standard-${Date.now()}`,
          type: 'standard',
          domain: readingData?.domain || 'general',
          question: readingData?.question || '',
          selectedCards: [],
          displayedCards: [],
          createdAt: new Date().toISOString(),
          interpretation: 'Không thể tạo diễn giải do thiếu dữ liệu lá bài'
        };
      }

      // Điều chỉnh format dữ liệu phù hợp với API schema
      const requestBody = {
        topic_id: getTarotTopicId(readingData?.domain || 'general'),
        spread_id: 1, // Sử dụng spread ID mặc định cho trải bài 3 lá
        question: readingData?.question || '',
        selected_cards: selectedIndices.map(index => {
          // Kiểm tra chỉ số hợp lệ
          if (index < 0 || index >= displayedCards.length) {
            console.error(`Chỉ số không hợp lệ: ${index}`);
            return null;
          }
          const card = displayedCards[index];
          // Thêm thuộc tính isReversed để API biết trạng thái lá bài
          return {
            id: card?.id,
            isReversed: card?.isReversed
          };
        }).filter(item => item !== null), // Lọc bỏ các giá trị null
        // Thêm các trường cần thiết khác mà server yêu cầu
        type: 'standard',
        // Truyền thêm thông tin đầy đủ về các lá bài được chọn để server có thể xử lý
        selectedCards: selectedIndices.map(index => displayedCards[index]).filter(card => card !== undefined)
      };

      console.log('Request body for standard reading:', requestBody);

      if (!requestBody.selected_cards.length) {
        console.warn('Không có lá bài nào được chọn sau khi lọc');
        return {
          id: `standard-${Date.now()}`,
          type: 'standard',
          domain: readingData?.domain || 'general',
          question: readingData?.question || '',
          selectedCards: [],
          displayedCards,
          createdAt: new Date().toISOString(),
          interpretation: 'Không thể tạo diễn giải do các lá bài không hợp lệ'
        };
      }

      const response = await apiClient.post('/tarot', requestBody, { headers });

      return response.data;
    } catch (error) {
      console.error('Error in performStandardReading:', error);
      return rejectWithValue({
        message: error.message || 'Không thể thực hiện bài đọc. Vui lòng thử lại.',
        data: error.response?.data
      });
    }
  }
);

// Helper function để chuyển đổi domain thành topic_id phù hợp
function getTarotTopicId(domain) {
  switch (domain) {
    case 'love': return 1;
    case 'career': return 2;
    case 'finance': return 3;
    case 'health': return 4;
    case 'spiritual': return 5;
    default: return 6; // general
  }
}

export const performAIReading = createAsyncThunk(
  'tarot/performAIReading',
  async (readingData, { rejectWithValue, getState }) => {
    try {
      console.log('performAIReading được gọi với dữ liệu:', readingData);

      // Kiểm tra xem có sử dụng mock API không
      const useMockApi = localStorage.getItem('USE_MOCK_API') === 'true' ||
        process.env.REACT_APP_USE_MOCK_API === 'true';

      if (useMockApi) {
        // Sử dụng createAIReading từ tarotAPI.js
        const mockReading = await createAIReading(
          readingData.selectedIndices || [],
          readingData.displayedCards || [],
          readingData.domain || 'general',
          readingData.question || ''
        );

        return mockReading;
      }

      // Logic gọi API thực tế  
      const { auth } = getState();

      // Check if token exists to determine if we need to attach auth headers
      const headers = {};
      if (auth.token) {
        headers['Authorization'] = `Bearer ${auth.token}`;
      }

      // Ghi log để debug
      console.log('Dữ liệu truyền vào:', {
        readingData,
        selectedIndices: readingData?.selectedIndices,
        displayedCards: readingData?.displayedCards
      });

      // Xử lý an toàn với dữ liệu không hợp lệ
      const displayedCards = Array.isArray(readingData?.displayedCards)
        ? readingData.displayedCards
        : [];

      const selectedIndices = Array.isArray(readingData?.selectedIndices)
        ? readingData.selectedIndices
        : [];

      if (!displayedCards.length || !selectedIndices.length) {
        console.warn('Dữ liệu bài tarot không đầy đủ, sử dụng giá trị mặc định');
        return {
          id: `ai-${Date.now()}`,
          type: 'ai',
          domain: readingData?.domain || 'general',
          question: readingData?.question || '',
          selectedCards: [],
          displayedCards: [],
          createdAt: new Date().toISOString(),
          interpretation: 'Không thể tạo diễn giải do thiếu dữ liệu lá bài'
        };
      }

      // Điều chỉnh format dữ liệu phù hợp với API schema
      const requestBody = {
        topic_id: getTarotTopicId(readingData?.domain || 'general'),
        spread_id: 1, // Sử dụng spread ID mặc định cho trải bài 3 lá
        question: readingData?.question || 'Xin hãy đọc lá bài Tarot cho tôi',
        domain: readingData?.domain || 'general', // Add domain field for AI interpretation
        selected_cards: selectedIndices.map(index => {
          // Kiểm tra chỉ số hợp lệ
          if (index < 0 || index >= displayedCards.length) {
            console.error(`Chỉ số không hợp lệ: ${index}`);
            return null;
          }
          const card = displayedCards[index];
          // Thêm thuộc tính isReversed để API biết trạng thái lá bài
          return {
            id: card?.id,
            isReversed: card?.isReversed
          };
        }).filter(item => item !== null), // Lọc bỏ các giá trị null
        // Thêm các trường cần thiết khác mà server yêu cầu
        type: 'ai',
        // Truyền thêm thông tin đầy đủ về các lá bài được chọn để server có thể xử lý
        selectedCards: selectedIndices.map(index => displayedCards[index]).filter(card => card !== undefined)
      };

      console.log('Request body for AI reading:', requestBody);

      if (!requestBody.selected_cards.length) {
        console.warn('Không có lá bài nào được chọn sau khi lọc');
        return {
          id: `ai-${Date.now()}`,
          type: 'ai',
          domain: readingData?.domain || 'general',
          question: readingData?.question || '',
          selectedCards: [],
          displayedCards,
          createdAt: new Date().toISOString(),
          interpretation: 'Không thể tạo diễn giải do các lá bài không hợp lệ'
        };
      }

      const response = await apiClient.post('/tarot/ai', requestBody, { headers });

      return response.data;
    } catch (error) {
      console.error('Error in performAIReading:', error);
      return rejectWithValue({
        message: error.message || 'Không thể thực hiện bài đọc AI. Vui lòng thử lại.',
        data: error.response?.data
      });
    }
  }
);

export const fetchSharedReading = createAsyncThunk(
  'tarot/fetchSharedReading',
  async (shareToken, { rejectWithValue }) => {
    try {
      return await getSharedReading(shareToken);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch shared reading');
    }
  }
);

export const fetchUserReadings = createAsyncThunk(
  'tarot/fetchUserReadings',
  async (params, { rejectWithValue }) => {
    try {
      return await getUserReadings(params);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user readings');
    }
  }
);

export const saveReadingToHistory = createAsyncThunk(
  'tarot/saveReadingToHistory',
  async (reading, { rejectWithValue }) => {
    try {
      return await saveReading(reading);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save reading');
    }
  }
);

// Example adding a middleware to normalize card data
export const fetchTarotCards = createAsyncThunk(
  'tarot/fetchCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tarotService.getCards();

      // Normalize card data to ensure consistent structure
      const normalizedCards = normalizeCardData(response.data?.cards || []);

      return normalizedCards;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tarot cards');
    }
  }
);

const initialState = {
  cards: [],
  selectedCards: [],
  twelveCards: [], // 12 lá bài ngẫu nhiên để trải trên bàn
  selectedIndices: [], // Chỉ số của 3 lá bài được chọn (0-11)
  currentCard: null,
  dailyCard: null,
  readings: [],
  currentReading: null,
  interpretation: null,
  loading: false,
  error: null,
  userReadings: {
    readings: [],
    totalCount: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null
  }
};

const tarotSlice = createSlice({
  name: 'tarot',
  initialState,
  reducers: {
    selectCard: (state, action) => {
      // Chỉ cho phép chọn tối đa 3 lá bài
      if (state.selectedCards.length < 3) {
        state.selectedCards.push(action.payload);
      }
    },
    unselectCard: (state, action) => {
      state.selectedIndices = state.selectedIndices.filter(
        index => index !== action.payload
      );
    },
    clearSelectedCards: (state) => {
      state.selectedIndices = [];
      state.selectedCards = [];
      state.currentReading = null;
      state.interpretation = null;
    },
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReading: (state) => {
      state.currentReading = null;
      state.interpretation = null;
    },
    setTwelveCards: (state, action) => {
      state.twelveCards = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAllCards
      .addCase(fetchAllCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCards.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and nested object response structures
        if (action.payload && Array.isArray(action.payload)) {
          state.cards = action.payload;
        } else if (action.payload && action.payload.data && Array.isArray(action.payload.data.cards)) {
          state.cards = action.payload.data.cards;
        } else {
          console.error('Unexpected payload structure in fetchAllCards:', action.payload);
          // Keep the previous state if the payload is invalid
        }
      })
      .addCase(fetchAllCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cards';
      })

      // Handle fetchCardById
      .addCase(fetchCardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCardById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCard = action.payload;
      })
      .addCase(fetchCardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchDailyTarot
      .addCase(fetchDailyTarot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyTarot.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyCard = action.payload;
      })
      .addCase(fetchDailyTarot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchTwelveRandomCards
      .addCase(fetchTwelveRandomCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTwelveRandomCards.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and nested object response structures
        if (action.payload && Array.isArray(action.payload)) {
          state.twelveCards = action.payload;
        } else if (action.payload && action.payload.data && Array.isArray(action.payload.data.cards)) {
          state.twelveCards = action.payload.data.cards;
        } else {
          console.error('Unexpected payload structure in fetchTwelveRandomCards:', action.payload);
          // Keep the previous state if the payload is invalid
        }
        state.selectedIndices = []; // Reset selected cards
      })
      .addCase(fetchTwelveRandomCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch random cards';
      })

      // Handle performStandardReading
      .addCase(performStandardReading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performStandardReading.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReading = action.payload;
        state.interpretation = action.payload.interpretation;
        state.selectedCards = action.payload.selectedCards;
        state.readings.unshift(action.payload);
      })
      .addCase(performStandardReading.rejected, (state, action) => {
        state.loading = false;
        // Kiểm tra nếu là lỗi xác thực và đang sử dụng USE_MOCK_API thì bỏ qua
        const useMockApi = localStorage.getItem('USE_MOCK_API') === 'true';
        if (action.payload && action.payload.message === 'Unauthorized - Invalid token' && useMockApi) {
          // Bỏ qua lỗi xác thực nếu đang sử dụng mock API
          state.error = null;
        } else {
          state.error = action.payload?.message || 'Failed to perform reading';
        }
      })

      // Handle performAIReading
      .addCase(performAIReading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performAIReading.fulfilled, (state, action) => {
        state.loading = false;
        // Xử lý dữ liệu từ API
        let processedData = action.payload;

        // Kiểm tra nếu payload từ API có format {data: {...}}
        if (action.payload && action.payload.data) {
          processedData = action.payload.data;
        }

        // Fix: Kiểm tra nếu data được bọc trong object `reading` (cấu trúc trả về từ controller)
        if (processedData && processedData.reading) {
          console.log('Detected nested reading object, unwrapping...');
          processedData = processedData.reading;
        }

        // Chuẩn hóa format interpretation
        if (!processedData.interpretation) {
          // Tạo cấu trúc interpretation từ dữ liệu API
          const cards = processedData.selectedCards || [];
          const sections = cards.map(card => ({
            title: `${card.position || card.positionName || 'Vị trí'}: ${card.name} ${card.isReversed ? '(Ngược)' : ''}`,
            content: card.interpretation || 'Không có diễn giải'
          }));

          processedData.interpretation = {
            summary: processedData.summary || 'Diễn giải AI',
            combined: processedData.overall || processedData.combined || 'Không có diễn giải tổng hợp',
            sections: sections,
            conclusion: processedData.advice || processedData.conclusion || 'Không có lời khuyên'
          };
        }

        state.currentReading = processedData;
        state.interpretation = processedData.interpretation;
        state.selectedCards = processedData.selectedCards;
        state.readings.unshift(processedData);

        // Log để debug
        console.log('Processed AI Reading:', processedData);
      })
      .addCase(performAIReading.rejected, (state, action) => {
        state.loading = false;
        // Kiểm tra nếu là lỗi xác thực và đang sử dụng USE_MOCK_API thì bỏ qua
        const useMockApi = localStorage.getItem('USE_MOCK_API') === 'true';
        if (action.payload && action.payload.message === 'Unauthorized - Invalid token' && useMockApi) {
          // Bỏ qua lỗi xác thực nếu đang sử dụng mock API
          state.error = null;
        } else {
          state.error = action.payload?.message || 'Failed to perform AI reading';
        }
      })

      // Handle fetchSharedReading
      .addCase(fetchSharedReading.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSharedReading.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReading = action.payload;
        state.interpretation = action.payload.interpretation;
        state.selectedCards = action.payload.selectedCards;
      })
      .addCase(fetchSharedReading.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchUserReadings
      .addCase(fetchUserReadings.pending, (state) => {
        state.userReadings.loading = true;
        state.userReadings.error = null;
      })
      .addCase(fetchUserReadings.fulfilled, (state, action) => {
        state.userReadings.loading = false;
        state.userReadings.readings = action.payload.readings;
        state.userReadings.totalCount = action.payload.totalCount;
        state.userReadings.page = action.payload.page;
        state.userReadings.limit = action.payload.limit;
      })
      .addCase(fetchUserReadings.rejected, (state, action) => {
        state.userReadings.loading = false;
        state.userReadings.error = action.payload;
      })

      // Handle saveReadingToHistory
      .addCase(saveReadingToHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveReadingToHistory.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật thông tin reading hiện tại nếu đang lưu reading hiện tại
        if (state.currentReading && state.currentReading.id === action.payload.id) {
          state.currentReading = action.payload;
        }
      })
      .addCase(saveReadingToHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  selectCard,
  unselectCard,
  clearSelectedCards,
  setCurrentCard,
  clearError,
  clearCurrentReading,
  setTwelveCards
} = tarotSlice.actions;

export default tarotSlice.reducer;