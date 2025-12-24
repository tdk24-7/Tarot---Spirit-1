const db = require('../models');
const fs = require('fs');
const path = require('path');
const TarotCard = db.tarotCards;

// Lấy tất cả lá bài
exports.getAllCards = async (req, res, next) => {
  try {
    console.log('getAllCards: Đang lấy tất cả lá bài...');
    let cards = await TarotCard.findAll();
    console.log(`getAllCards: Đã tìm thấy ${cards ? cards.length : 0} lá bài`);
    
    // Nếu không có dữ liệu, trả về dữ liệu mẫu tĩnh
    if (!cards || cards.length === 0) {
      console.log('getAllCards: Không có dữ liệu trong database, trả về dữ liệu mẫu.');
      const sampleCards = getSampleCards();
      
      return res.status(200).json({
        status: 'success',
        results: sampleCards.length,
        data: { cards: sampleCards }
      });
    }
    
    res.status(200).json({
      status: 'success',
      results: cards.length,
      data: { cards }
    });
  } catch (error) {
    console.error('getAllCards ERROR:', error);
    
    // Khi xảy ra lỗi, trả về dữ liệu mẫu để tránh lỗi ở frontend
    console.log('getAllCards: Xảy ra lỗi, trả về dữ liệu mẫu.');
    const sampleCards = getSampleCards();
    
    return res.status(200).json({
      status: 'success',
      results: sampleCards.length,
      source: 'fallback',
      data: { cards: sampleCards }
    });
  }
};

// Lấy một lá bài theo ID
exports.getCardById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`getCardById: Đang tìm lá bài với ID ${id}`);
    
    const card = await TarotCard.findByPk(id);
    
    if (!card) {
      console.log(`getCardById: Không tìm thấy lá bài có ID ${id}`);
      
      // Tìm thẻ bài từ dữ liệu mẫu
      const sampleCards = getSampleCards();
      const sampleCard = sampleCards.find(c => c.id === Number(id));
      
      if (sampleCard) {
        return res.status(200).json({
          status: 'success',
          source: 'fallback',
          data: { card: sampleCard }
        });
      }
      
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy lá bài'
      });
    }
    
    console.log(`getCardById: Đã tìm thấy lá bài ${card.name}`);
    res.status(200).json({
      status: 'success',
      data: { card }
    });
  } catch (error) {
    console.error('getCardById ERROR:', error);
    next(error);
  }
};

// Lấy các lá bài ngẫu nhiên
exports.getRandomCards = async (req, res, next) => {
  try {
    // Lấy limit từ params hoặc query
    const limit = parseInt(req.params.count || req.query.limit || 12);
    console.log(`getRandomCards: Đang lấy ${limit} lá bài ngẫu nhiên...`);
    
    // Sử dụng phương thức phù hợp với database đang sử dụng
    // MySQL sử dụng RAND(), PostgreSQL sử dụng RANDOM()
    let cards = await TarotCard.findAll({
      order: db.sequelize.literal('RAND()'),
      limit
    });
    
    // Nếu không có dữ liệu trong database, sử dụng dữ liệu mẫu
    if (!cards || cards.length === 0) {
      console.log('getRandomCards: Không có dữ liệu trong database, trả về dữ liệu mẫu.');
      const sampleCards = getSampleCards();
      
      // Trộn mảng và lấy các lá bài ngẫu nhiên
      const shuffled = [...sampleCards].sort(() => 0.5 - Math.random());
      const randomCards = shuffled.slice(0, limit);
      
      return res.status(200).json({
        status: 'success',
        results: randomCards.length,
        source: 'fallback',
        data: { cards: randomCards }
      });
    }
    
    console.log(`getRandomCards: Đã tìm thấy ${cards.length} lá bài ngẫu nhiên`);
    res.status(200).json({
      status: 'success',
      results: cards.length,
      data: { cards }
    });
  } catch (error) {
    console.error('getRandomCards ERROR:', error);
    
    // Khi xảy ra lỗi, trả về dữ liệu mẫu để tránh lỗi ở frontend
    console.log('getRandomCards: Xảy ra lỗi, trả về dữ liệu mẫu.');
    const sampleCards = getSampleCards();
    
    // Trộn mảng và lấy các lá bài ngẫu nhiên
    const limit = parseInt(req.params.count || req.query.limit || 12);
    const shuffled = [...sampleCards].sort(() => 0.5 - Math.random());
    const randomCards = shuffled.slice(0, limit);
    
    return res.status(200).json({
      status: 'success',
      results: randomCards.length,
      source: 'fallback',
      data: { cards: randomCards }
    });
  }
};

// Hàm trả về dữ liệu mẫu
function getSampleCards() {
  try {
    // Thử đọc từ file data
    const dataPath = path.resolve(__dirname, '../data/tarot_cards_data.json');
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath);
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error('Lỗi khi đọc file dữ liệu mẫu:', error);
  }
  
  // Dữ liệu mẫu cố định
  return [
    {
      id: 1,
      name: "Kẻ Ngốc",
      arcana: "Major",
      suit: null,
      number: 0,
      image_url: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522725/TheFool_ewfg71.png",
      description: "Một người lữ hành trẻ tuổi đứng trên bờ vực, tay cầm gậy với túi hành lý nhỏ, một con chó nhảy lên chân anh ta.",
      general_upright_meaning: "Ý nghĩa chung của The Fool là sự tự do, sự khám phá và lòng tin. Nó biểu thị cơ hội mới và khả năng mở ra những chân trời mới.",
      general_reversed_meaning: "Khi ngược, lá bài này biểu thị sự thiếu suy nghĩ, sợ hãi hoặc khởi đầu không ổn định.",
      story: "The Fool đại diện cho sự khởi đầu, hành trình mới và tiềm năng vô tận."
    },
    {
      id: 2,
      name: "Nhà Ảo Thuật",
      arcana: "Major",
      suit: null,
      number: 1,
      image_url: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522721/TheMagician_rsesgw.png",
      description: "Một người đàn ông đứng trước bàn với biểu tượng của bốn chất, một tay chỉ lên trời, một tay chỉ xuống đất.",
      general_upright_meaning: "Ý nghĩa chung của The Magician là sự tập trung, ý chí và sự sáng tạo. Nó biểu thị khả năng sử dụng các kỹ năng và nguồn lực để đạt được mục tiêu.",
      general_reversed_meaning: "Khi ngược, lá bài này biểu thị sự lừa dối, thao túng hoặc khả năng bị phân tâm.",
      story: "The Magician biểu thị khả năng kết nối thế giới tinh thần và vật chất, sử dụng các nguồn lực để biến ý tưởng thành hiện thực."
    },
    {
      id: 3,
      name: "Nữ Giáo Hoàng",
      arcana: "Major",
      suit: null,
      number: 2,
      image_url: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522724/TheHighPriestess_z4dpgj.png",
      description: "Một người phụ nữ ngồi giữa hai cột đen và trắng, đội vương miện với mặt trăng dưới chân.",
      general_upright_meaning: "Ý nghĩa chung của The High Priestess là trực giác, tiềm thức và sự khôn ngoan nội tâm. Nó biểu thị sự hiểu biết sâu sắc và khả năng nhìn thấu bên trong.",
      general_reversed_meaning: "Khi ngược, lá bài này biểu thị sự bỏ qua trực giác, bí mật hoặc sự cân bằng nội tâm bị rối loạn.",
      story: "The High Priestess đại diện cho sự khôn ngoan bí ẩn, kiến thức ẩn giấu và khả năng tiếp cận tiềm thức."
    },
    {
      id: 22,
      name: "Át Kiếm",
      arcana: "Minor",
      suit: "Kiếm",
      number: 1,
      image_url: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522998/AceOfSwords_tcmv0j.png",
      description: "Một bàn tay vươn ra từ đám mây, cầm một thanh kiếm được trang trí bằng vương miện và cành cọ.",
      general_upright_meaning: "Ý nghĩa chung của Ace of Swords là sự rõ ràng, sức mạnh tinh thần và sự bắt đầu mới trong suy nghĩ.",
      general_reversed_meaning: "Khi ngược, lá bài này biểu thị sự nhầm lẫn, thiếu rõ ràng hoặc ý tưởng bị bóp méo.",
      story: "Ace of Swords biểu thị nguồn gốc của sức mạnh trí tuệ và khả năng nhìn thấy sự thật."
    },
    {
      id: 36,
      name: "Át Cốc",
      arcana: "Minor",
      suit: "Cốc",
      number: 1,
      image_url: "https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745523005/AceOfCups_ykh9bo.png",
      description: "Một bàn tay vươn ra từ đám mây, cầm một chiếc cốc có nước tràn ra và chim bồ câu bay vào.",
      general_upright_meaning: "Ý nghĩa chung của Ace of Cups là tình yêu mới, cảm xúc dồi dào và sự kết nối tâm linh sâu sắc.",
      general_reversed_meaning: "Khi ngược, lá bài này biểu thị cảm xúc bị kiềm nén, tình yêu không được đáp lại hoặc sự mất cân bằng tình cảm.",
      story: "Ace of Cups biểu thị nguồn gốc của tình yêu, lòng trắc ẩn và sự kết nối cảm xúc sâu sắc."
    }
  ];
} 