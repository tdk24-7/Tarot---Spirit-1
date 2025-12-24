/**
 * tarotInterpretation.js
 * Xử lý logic diễn giải các lá bài Tarot dựa trên template có sẵn
 */

/**
 * Tạo diễn giải cơ bản cho lá bài dựa trên vị trí và trạng thái (ngược/xuôi)
 * 
 * @param {Object} card - Thông tin về lá bài
 * @param {string} domain - Lĩnh vực được chọn (love, career, finance, health, spiritual)
 * @returns {string} - Nội dung diễn giải cơ bản
 */
export const getBasicCardInterpretation = (card, domain = 'general') => {
  const { name, isReversed, position } = card;
  
  // Sử dụng ý nghĩa xuôi hoặc ngược tùy thuộc vào trạng thái lá bài
  const meaningKey = isReversed ? 'general_reversed_meaning' : 'general_upright_meaning';
  const fallbackKey = isReversed ? 'reversed_meaning' : 'meaning';
  const cardMeaning = card[meaningKey] || card[fallbackKey] || card.description || `Lá bài ${name} đại diện cho...`;
  
  // Thêm phần mở đầu tùy thuộc vào vị trí
  let positionIntro = '';
  switch (position) {
    case 'Bản thân':
      positionIntro = 'Ở vị trí bản thân, lá bài này thể hiện tình trạng hiện tại của bạn. ';
      break;
    case 'Hoàn cảnh':
      positionIntro = 'Ở vị trí hoàn cảnh, lá bài này thể hiện những yếu tố bên ngoài đang ảnh hưởng đến bạn. ';
      break;
    case 'Thử thách':
      positionIntro = 'Ở vị trí thử thách, lá bài này thể hiện những khó khăn bạn cần vượt qua. ';
      break;
    default:
      positionIntro = '';
  }
  
  // Thêm thông tin về trạng thái ngược/xuôi
  const stateInfo = isReversed 
    ? 'Lá bài này xuất hiện ở trạng thái ngược, điều này có thể ám chỉ những thách thức hoặc khía cạnh tiêu cực cần lưu ý. ' 
    : 'Lá bài này xuất hiện ở trạng thái xuôi, thể hiện những khía cạnh tích cực và thuận lợi. ';
  
  return `${positionIntro}${stateInfo}${cardMeaning}`;
};

/**
 * Tạo diễn giải theo lĩnh vực cụ thể cho lá bài
 * 
 * @param {Object} card - Thông tin về lá bài
 * @param {string} domain - Lĩnh vực được chọn (love, career, finance, health, spiritual)
 * @returns {string} - Nội dung diễn giải theo lĩnh vực
 */
export const getDomainSpecificInterpretation = (card, domain = 'general') => {
  const { name, isReversed, position } = card;
  
  // Các template diễn giải theo lĩnh vực và vị trí
  const interpretationTemplates = {
    love: {
      'Bản thân': {
        upright: 'Trong tình yêu, bạn đang thể hiện những đặc điểm tích cực như sự chân thành, tin tưởng và cởi mở. Đây là thời điểm tốt để bạn bày tỏ cảm xúc và tăng cường kết nối với đối phương.',
        reversed: 'Bạn có thể đang gặp khó khăn trong việc thể hiện cảm xúc thật của mình hoặc có những nỗi sợ về sự tổn thương. Hãy xem xét lại cách bạn tiếp cận mối quan hệ và loại bỏ những rào cản tâm lý.'
      },
      'Hoàn cảnh': {
        upright: 'Môi trường xung quanh đang tạo điều kiện thuận lợi cho mối quan hệ của bạn phát triển. Đây có thể là thời điểm lý tưởng để củng cố mối quan hệ hoặc đón nhận tình yêu mới.',
        reversed: 'Có những yếu tố bên ngoài đang gây áp lực hoặc cản trở mối quan hệ của bạn. Bạn cần thêm thời gian và không gian để xử lý những ảnh hưởng này.'
      },
      'Thử thách': {
        upright: 'Thử thách trong tình yêu của bạn lúc này là giữ vững sự cân bằng giữa tình cảm và lý trí, giữa cho và nhận. Hãy cởi mở trò chuyện và giải quyết mọi vấn đề một cách thẳng thắn.',
        reversed: 'Bạn đang phải đối mặt với những thử thách nghiêm trọng trong mối quan hệ, có thể liên quan đến sự tin tưởng, giao tiếp hoặc khác biệt về mục tiêu. Đây là thời điểm để đánh giá lại và quyết định hướng đi tiếp theo.'
      }
    },
    career: {
      'Bản thân': {
        upright: 'Trong công việc, bạn đang thể hiện những phẩm chất tích cực như sự chuyên nghiệp, sáng tạo và tinh thần trách nhiệm. Đây là thời điểm tốt để theo đuổi mục tiêu nghề nghiệp hoặc đề xuất ý tưởng mới.',
        reversed: 'Bạn có thể đang cảm thấy mất phương hướng hoặc thiếu động lực trong công việc. Hãy xem xét lại mục tiêu nghề nghiệp và tìm cách tái tạo động lực cho bản thân.'
      },
      'Hoàn cảnh': {
        upright: 'Môi trường làm việc đang mang lại những cơ hội thuận lợi cho sự phát triển của bạn. Hãy tận dụng các mối quan hệ và nguồn lực hiện có để tiến xa hơn trong sự nghiệp.',
        reversed: 'Có những thách thức trong môi trường làm việc đang ảnh hưởng đến hiệu suất của bạn. Bạn cần thích nghi và tìm cách vượt qua những trở ngại này.'
      },
      'Thử thách': {
        upright: 'Thử thách trong sự nghiệp của bạn là cân bằng giữa tham vọng và thực tế, giữa công việc và cuộc sống cá nhân. Hãy lập kế hoạch rõ ràng và thực hiện từng bước một.',
        reversed: 'Bạn đang đối mặt với những khó khăn đáng kể trong công việc, có thể liên quan đến sự xung đột, áp lực vượt quá khả năng hoặc sự trì trệ trong thăng tiến. Đây là lúc cần đánh giá lại con đường sự nghiệp của bạn.'
      }
    },
    finance: {
      'Bản thân': {
        upright: 'Về tài chính, bạn đang có những quyết định đúng đắn và khả năng quản lý tốt. Đây là thời điểm lý tưởng để lập kế hoạch tài chính dài hạn hoặc bắt đầu các khoản đầu tư mới.',
        reversed: 'Bạn có thể đang gặp khó khăn trong việc kiểm soát chi tiêu hoặc có những lo lắng về tài chính. Hãy xem xét lại ngân sách và tìm cách cải thiện thói quen tài chính.'
      },
      'Hoàn cảnh': {
        upright: 'Các yếu tố kinh tế xung quanh đang tạo điều kiện thuận lợi cho tình hình tài chính của bạn. Đây có thể là thời điểm tốt để nắm bắt cơ hội đầu tư hoặc tìm kiếm nguồn thu nhập mới.',
        reversed: 'Có những yếu tố bên ngoài đang gây áp lực lên tài chính của bạn. Hãy thận trọng với các quyết định tài chính và có kế hoạch dự phòng.'
      },
      'Thử thách': {
        upright: 'Thử thách tài chính của bạn là tìm cách cân bằng giữa chi tiêu và tiết kiệm, giữa an toàn và rủi ro. Hãy lên kế hoạch tài chính chi tiết và tuân thủ nó.',
        reversed: 'Bạn đang đối mặt với những thách thức nghiêm trọng về tài chính, có thể liên quan đến nợ nần, mất mát không lường trước hoặc chi phí gia tăng. Đây là lúc cần tìm kiếm tư vấn tài chính chuyên nghiệp.'
      }
    },
    health: {
      'Bản thân': {
        upright: 'Về sức khỏe, bạn đang có trạng thái tích cực và sức sống dồi dào. Đây là thời điểm tốt để bắt đầu thói quen lành mạnh mới hoặc theo đuổi các mục tiêu sức khỏe.',
        reversed: 'Bạn có thể đang cảm thấy mệt mỏi hoặc có những vấn đề sức khỏe cần được chú ý. Hãy lắng nghe cơ thể và tìm kiếm sự hỗ trợ y tế nếu cần.'
      },
      'Hoàn cảnh': {
        upright: 'Môi trường sống đang hỗ trợ tích cực cho sức khỏe của bạn. Hãy tận dụng điều này để xây dựng lối sống lành mạnh và cân bằng.',
        reversed: 'Có những yếu tố trong môi trường đang ảnh hưởng tiêu cực đến sức khỏe của bạn. Hãy nhận diện và giảm thiểu các tác động này.'
      },
      'Thử thách': {
        upright: 'Thử thách sức khỏe của bạn là duy trì sự cân bằng giữa công việc và nghỉ ngơi, giữa hoạt động thể chất và tinh thần. Hãy xây dựng lịch trình hài hòa và lắng nghe nhu cầu của cơ thể.',
        reversed: 'Bạn đang phải đối mặt với những thách thức sức khỏe đáng kể, có thể liên quan đến stress mãn tính, mệt mỏi hoặc các vấn đề sức khỏe tiềm ẩn. Đây là lúc cần ưu tiên chăm sóc bản thân.'
      }
    },
    spiritual: {
      'Bản thân': {
        upright: 'Về tâm linh, bạn đang trong giai đoạn tỉnh thức và kết nối sâu sắc với bản thân. Đây là thời điểm lý tưởng để thực hành thiền định, chánh niệm hoặc tìm hiểu các triết lý tâm linh.',
        reversed: 'Bạn có thể đang cảm thấy mất kết nối với bản thân hoặc có những hoài nghi về con đường tâm linh. Hãy dành thời gian cho nội tâm và tìm kiếm sự hướng dẫn tinh thần.'
      },
      'Hoàn cảnh': {
        upright: 'Môi trường xung quanh đang tạo điều kiện thuận lợi cho sự phát triển tâm linh của bạn. Hãy tận dụng nguồn năng lượng tích cực này để đào sâu vào thực hành tâm linh.',
        reversed: 'Có những yếu tố bên ngoài đang làm sao nhãng hành trình tâm linh của bạn. Hãy tạo không gian riêng và bảo vệ năng lượng cá nhân.'
      },
      'Thử thách': {
        upright: 'Thử thách tâm linh của bạn là tích hợp những hiểu biết tâm linh vào cuộc sống hàng ngày, từ bỏ những niềm tin hạn chế. Hãy kiên nhẫn với hành trình của mình.',
        reversed: 'Bạn đang phải đối mặt với những cuộc khủng hoảng tinh thần hoặc đấu tranh giữa niềm tin và hiện thực. Đây là thời điểm để đặt câu hỏi sâu sắc và tìm kiếm sự thật bên trong.'
      }
    },
    general: {
      'Bản thân': {
        upright: 'Lá bài này thể hiện rằng bạn đang có một năng lượng tích cực và cảm giác cân bằng trong cuộc sống. Đây là thời điểm tốt để phát triển bản thân và theo đuổi ước mơ.',
        reversed: 'Bạn có thể đang trải qua giai đoạn khó khăn hoặc cảm thấy mất phương hướng. Hãy dành thời gian để nhìn nhận lại nhu cầu của bản thân và tìm cách tái tạo năng lượng.'
      },
      'Hoàn cảnh': {
        upright: 'Môi trường xung quanh đang tạo điều kiện thuận lợi cho sự phát triển của bạn. Hãy tận dụng những cơ hội này để tiến về phía trước.',
        reversed: 'Có những yếu tố bên ngoài đang gây áp lực hoặc cản trở bạn. Hãy học cách thích nghi và tìm ra giải pháp sáng tạo cho các thách thức.'
      },
      'Thử thách': {
        upright: 'Thử thách của bạn là giữ vững niềm tin vào bản thân và kiên trì theo đuổi mục tiêu dù có khó khăn. Hãy nhớ rằng mọi trở ngại đều là cơ hội để học hỏi và trưởng thành.',
        reversed: 'Bạn đang đối mặt với những thách thức đáng kể, có thể liên quan đến sự tự nghi ngờ hoặc cảm giác bị quá tải. Đây là lúc cần đánh giá lại ưu tiên và tìm kiếm sự hỗ trợ.'
      }
    }
  };
  
  // Lấy template phù hợp với lĩnh vực và vị trí
  const domainTemplates = interpretationTemplates[domain] || interpretationTemplates.general;
  const positionTemplates = domainTemplates[position] || domainTemplates['Bản thân'];
  
  // Lấy template phù hợp với trạng thái ngược/xuôi
  const templateKey = isReversed ? 'reversed' : 'upright';
  const template = positionTemplates[templateKey] || `Lá bài ${name} ở vị trí ${position} ${isReversed ? 'ngược' : 'xuôi'} cho thấy...`;
  
  return template;
};

/**
 * Tạo diễn giải đầy đủ cho một lá bài
 * 
 * @param {Object} card - Thông tin về lá bài
 * @param {string} domain - Lĩnh vực được chọn (love, career, finance, health, spiritual)
 * @returns {Object} - Đối tượng chứa thông tin diễn giải
 */
export const interpretCard = (card, domain = 'general') => {
  const basicInterpretation = getBasicCardInterpretation(card, domain);
  const domainInterpretation = getDomainSpecificInterpretation(card, domain);
  
  return {
    title: `${card.position}: ${card.name} ${card.isReversed ? '(Ngược)' : ''}`,
    basic: basicInterpretation,
    domain: domainInterpretation,
    content: `${basicInterpretation} ${domainInterpretation}`
  };
};

/**
 * Tạo diễn giải đầy đủ cho trải bài 3 lá
 * 
 * @param {Array} cards - Mảng 3 lá bài đã được người dùng chọn
 * @param {string} question - Câu hỏi của người dùng
 * @param {string} domain - Lĩnh vực được chọn (love, career, finance, health, spiritual)
 * @returns {Object} - Đối tượng chứa thông tin diễn giải đầy đủ
 */
export const interpretThreeCardReading = (cards, question = '', domain = 'general') => {
  // Kiểm tra đầu vào
  if (!cards || !Array.isArray(cards) || cards.length !== 3) {
    console.error('Cần cung cấp đúng 3 lá bài để diễn giải');
    return null;
  }
  
  // Tạo diễn giải cho từng lá bài
  const cardInterpretations = cards.map(card => interpretCard(card, domain));
  
  // Tạo phần mở đầu
  let summary = '';
  if (question && question.trim()) {
    summary = `Dưới đây là trải bài Tarot 3 lá liên quan đến câu hỏi: "${question}"`;
  } else {
    // Tùy chỉnh mở đầu theo lĩnh vực
    switch (domain) {
      case 'love':
        summary = "Dưới đây là diễn giải chi tiết cho trải bài về tình yêu của bạn";
        break;
      case 'career':
        summary = "Dưới đây là diễn giải chi tiết cho trải bài về sự nghiệp của bạn";
        break;
      case 'finance':
        summary = "Dưới đây là diễn giải chi tiết cho trải bài về tài chính của bạn";
        break;
      case 'health':
        summary = "Dưới đây là diễn giải chi tiết cho trải bài về sức khỏe của bạn";
        break;
      case 'spiritual':
        summary = "Dưới đây là diễn giải chi tiết cho trải bài về hành trình tâm linh của bạn";
        break;
      default:
        summary = "Dưới đây là diễn giải chi tiết cho trải bài của bạn";
        break;
    }
  }
  
  // Tạo kết luận
  const reversedCards = cards.filter(c => c.isReversed).length;
  const reversedInfo = reversedCards > 0 
    ? `Có ${reversedCards} lá bài xuất hiện ở trạng thái ngược, điều này cho thấy có những thách thức cần được chú ý. ` 
    : "Tất cả các lá bài đều xuất hiện ở trạng thái xuôi, điều này là một dấu hiệu tích cực. ";
  
  const domainConclusions = {
    love: `${question ? `Liên quan đến câu hỏi về tình yêu của bạn, ` : ''}
      ${reversedInfo}
      Trải bài này cho thấy trạng thái tình cảm hiện tại của bạn (${cards[0]?.name || ''} ${cards[0]?.isReversed ? '(Ngược)' : ''}), 
      hoàn cảnh ảnh hưởng đến mối quan hệ (${cards[1]?.name || ''} ${cards[1]?.isReversed ? '(Ngược)' : ''}), 
      và những thử thách cần vượt qua để tình yêu phát triển (${cards[2]?.name || ''} ${cards[2]?.isReversed ? '(Ngược)' : ''}). 
      Sự cân bằng giữa tình yêu và tôn trọng sẽ là chìa khóa cho hạnh phúc lâu dài.`,
    career: `${question ? `Liên quan đến câu hỏi về sự nghiệp của bạn, ` : ''}
      ${reversedInfo}
      Trải bài này phản ánh vị trí nghề nghiệp hiện tại của bạn (${cards[0]?.name || ''} ${cards[0]?.isReversed ? '(Ngược)' : ''}), 
      môi trường làm việc và các yếu tố ảnh hưởng (${cards[1]?.name || ''} ${cards[1]?.isReversed ? '(Ngược)' : ''}), 
      và những thách thức nghề nghiệp cần vượt qua (${cards[2]?.name || ''} ${cards[2]?.isReversed ? '(Ngược)' : ''}). 
      Tập trung vào phát triển kỹ năng và xây dựng mối quan hệ tích cực sẽ mang lại thành công.`,
    finance: `${question ? `Liên quan đến câu hỏi về tài chính của bạn, ` : ''}
      ${reversedInfo}
      Trải bài này cho thấy tình trạng tài chính hiện tại của bạn (${cards[0]?.name || ''} ${cards[0]?.isReversed ? '(Ngược)' : ''}), 
      các yếu tố kinh tế ảnh hưởng (${cards[1]?.name || ''} ${cards[1]?.isReversed ? '(Ngược)' : ''}), 
      và những thách thức tài chính cần vượt qua (${cards[2]?.name || ''} ${cards[2]?.isReversed ? '(Ngược)' : ''}). 
      Việc lập kế hoạch tài chính dài hạn và kiểm soát chi tiêu là vô cùng quan trọng.`,
    health: `${question ? `Liên quan đến câu hỏi về sức khỏe của bạn, ` : ''}
      ${reversedInfo}
      Trải bài này cho thấy tình trạng sức khỏe hiện tại của bạn (${cards[0]?.name || ''} ${cards[0]?.isReversed ? '(Ngược)' : ''}), 
      các yếu tố môi trường và lối sống ảnh hưởng (${cards[1]?.name || ''} ${cards[1]?.isReversed ? '(Ngược)' : ''}), 
      và những thách thức sức khỏe cần được chú ý (${cards[2]?.name || ''} ${cards[2]?.isReversed ? '(Ngược)' : ''}). 
      Hãy lắng nghe cơ thể và duy trì sự cân bằng giữa thể chất và tinh thần.`,
    spiritual: `${question ? `Liên quan đến câu hỏi về tâm linh của bạn, ` : ''}
      ${reversedInfo}
      Trải bài này phản ánh hành trình tâm linh hiện tại của bạn (${cards[0]?.name || ''} ${cards[0]?.isReversed ? '(Ngược)' : ''}), 
      những ảnh hưởng từ môi trường xung quanh (${cards[1]?.name || ''} ${cards[1]?.isReversed ? '(Ngược)' : ''}), 
      và những bài học tâm linh cần tiếp thu (${cards[2]?.name || ''} ${cards[2]?.isReversed ? '(Ngược)' : ''}). 
      Việc tạo không gian cho sự phát triển nội tâm và thực hành chánh niệm sẽ mang lại nhiều lợi ích.`,
    general: `${question ? `Liên quan đến câu hỏi của bạn, ` : ''}
      ${reversedInfo}
      Khi xem xét bố cục các lá bài, ${cards[0]?.name || ''} ${cards[0]?.isReversed ? '(Ngược)' : ''} liên quan đến bản thân bạn, 
      ${cards[1]?.name || ''} ${cards[1]?.isReversed ? '(Ngược)' : ''} phản ánh hoàn cảnh xung quanh bạn, 
      và ${cards[2]?.name || ''} ${cards[2]?.isReversed ? '(Ngược)' : ''} đại diện cho thử thách cần vượt qua.
      Sự kết hợp của các lá bài này cho thấy một hành trình từ nhận thức bản thân, qua hoàn cảnh hiện tại, đến thử thách cần vượt qua. 
      Hãy cân nhắc sự tương tác giữa các lá bài này để có cái nhìn toàn diện.`
  };
  
  const conclusion = domainConclusions[domain] || domainConclusions.general;
  
  // Trả về kết quả diễn giải đầy đủ
  return {
    summary,
    sections: cardInterpretations,
    conclusion
  };
}; 