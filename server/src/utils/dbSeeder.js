const fs = require('fs');
const path = require('path');
const db = require('../models');
const TarotCard = db.tarotCards;

// Đường dẫn tới file JSON chứa dữ liệu mẫu
const SEED_DATA_PATH = path.resolve(__dirname, '../data/tarot_cards_data.json');

async function seedTarotCards() {
  try {
    console.log('Kiểm tra dữ liệu lá bài tarot...');
    
    // Kiểm tra xem đã có dữ liệu trong bảng tarot_cards chưa
    const cardCount = await TarotCard.count();
    
    if (cardCount > 0) {
      console.log(`Đã tìm thấy ${cardCount} lá bài trong database. Không cần seed dữ liệu.`);
      return;
    }
    
    console.log('Chưa có dữ liệu lá bài. Tiến hành seed dữ liệu mẫu...');
    
    // Tạo thư mục data nếu chưa tồn tại
    const dataDir = path.resolve(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Tạo dữ liệu mẫu nếu file không tồn tại
    if (!fs.existsSync(SEED_DATA_PATH)) {
      console.log('Tạo file dữ liệu mẫu...');
      createSampleData();
    }
    
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(SEED_DATA_PATH);
    const cards = JSON.parse(rawData);
    
    console.log(`Đang seed ${cards.length} lá bài tarot vào database...`);
    
    // Sử dụng bulkCreate để insert nhiều bản ghi cùng lúc
    await TarotCard.bulkCreate(cards);
    
    console.log('Seed dữ liệu lá bài tarot thành công!');
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu lá bài tarot:', error);
    throw error;
  }
}

function createSampleData() {
  // Tạo 5 lá bài mẫu trong trường hợp không có dữ liệu
  const sampleCards = [
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
  
  // Lưu dữ liệu mẫu vào file JSON
  fs.writeFileSync(SEED_DATA_PATH, JSON.stringify(sampleCards, null, 2));
}

module.exports = { seedTarotCards }; 