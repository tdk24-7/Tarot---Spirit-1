import React, { useState, useEffect, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { AdvancedImage } from '@cloudinary/react';

// Import Cloudinary helpers
import { getCloudinaryImage } from '../utils/cloudinaryHelper';

// Import ảnh mặt sau dự phòng
import fallbackCardBack from '../../../assets/images/ui/card-back.png';

/**
 * Component hiển thị lá bài Tarot với animation
 * @param {Object} props - Component props
 * @param {Object} props.card - Thông tin lá bài
 * @param {boolean} props.isRevealed - Trạng thái lá bài (đã lật hay chưa)
 * @param {Function} props.onCardClick - Callback khi click vào lá bài
 * @param {boolean} props.isSelectable - Có thể select lá bài hay không
 * @param {boolean} props.isSelected - Lá bài đã được chọn hay chưa
 * @param {string} props.size - Kích thước lá bài ("small", "medium", "large")
 * @param {string} props.position - Vị trí lá bài trong trải bài
 * @param {string} props.cardBackImage - Ảnh mặt sau của lá bài
 */
const TarotCardDisplay = memo(({ 
  card = {}, 
  isRevealed = false, 
  onCardClick, 
  isSelectable = false,
  isSelected = false,
  size = 'medium',
  position = '',
  cardBackImage = fallbackCardBack,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReversal, setIsReversal] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [cloudinaryImage, setCloudinaryImage] = useState(null);
  const cldImage = useRef(null);

  // Xác định kích thước của lá bài
  const sizeMap = {
    small: { width: 96, height: 144 }, // w-24 h-36
    medium: { width: 128, height: 192 }, // w-32 h-48
    large: { width: 160, height: 240 }, // w-40 h-60
  };
  const currentSize = sizeMap[size] || sizeMap.medium;
  const sizeClasses = `w-${currentSize.width / 4} h-${currentSize.height / 4}`;

  // Log the incoming card prop, especially imageUrl
  useEffect(() => {
    if (card) {
      console.log('[TarotCardDisplay] Received card prop:', { 
        id: card.id, 
        name: card.name, 
        imageUrl: card.imageUrl || card.image_url,
        isReversedProp: card.isReversed 
      });
    } else {
      console.log('[TarotCardDisplay] Received card prop: null or undefined');
    }
  }, [card]);

  // Xác định lá bài ngược dựa vào dữ liệu card hoặc random
  useEffect(() => {
    if (card && card.isReversed !== undefined) {
      // Đảm bảo isReversed là boolean rõ ràng
      const isReversedBoolean = card.isReversed === true;
      setIsReversal(isReversedBoolean);
      console.log(`TarotCardDisplay - Card ${card.name}: received isReversed=${card.isReversed} (${typeof card.isReversed}), set to ${isReversedBoolean}`);
    } else {
      // 40% cơ hội lá bài sẽ ngược
      const randomReversed = Math.random() < 0.4;
      setIsReversal(randomReversed);
      console.log(`TarotCardDisplay - Card ${card?.name}: No isReversed prop, randomly set to ${randomReversed}`);
    }
  }, [card]);

  // Tạo Cloudinary image khi card thay đổi
  useEffect(() => {
    // Ưu tiên sử dụng imageUrl, fallback sang image_url nếu có
    const cardImageUrl = card?.imageUrl || card?.image_url;
    
    if (card && cardImageUrl) {
      try {
        console.log('Creating Cloudinary image for:', card.name, 'URL:', cardImageUrl);
        // Sử dụng kích thước dựa vào cấu hình size của card
        const currentWidth = currentSize.width * 2; // Nhân để có độ phân giải tốt hơn
        const currentHeight = currentSize.height * 2;
        const cldImg = getCloudinaryImage(cardImageUrl, currentWidth, currentHeight);
        setCloudinaryImage(cldImg);
        setImageError(false);
      } catch (error) {
        console.error('Failed to create Cloudinary image:', error);
        setImageError(true);
      }
    } else {
      console.log('No image URL found for card:', card?.name, card?.id);
      
      // Thử tạo URL dựa vào tên card nếu không có URL
      if (card && card.name) {
        try {
          const fallbackUrl = `https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522725/${card.name.replace(/\s+/g, '')}.png`;
          console.log('Trying fallback URL:', fallbackUrl);
          const cldImg = getCloudinaryImage(fallbackUrl, currentSize.width * 2, currentSize.height * 2);
          setCloudinaryImage(cldImg);
          setImageError(false);
        } catch (fallbackError) {
          console.error('Failed to create fallback Cloudinary image:', fallbackError);
          setImageError(true);
        }
      } else {
      setCloudinaryImage(null);
        setImageError(true);
      }
    }
  }, [card, currentSize?.width, currentSize?.height]);

  // Add a debug log to see the card object structure
  useEffect(() => {
    if (card && card.id) {
      console.log('Card object structure:', JSON.stringify(card, null, 2));
    }
  }, [card]);

  // Flip animation khi isRevealed thay đổi
  useEffect(() => {
    if (isRevealed) {
      const timer = setTimeout(() => {
        setIsFlipped(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsFlipped(false);
    }
  }, [isRevealed]);

  // Handler khi hover vào lá bài
  const handleMouseEnter = () => {
    if (isSelectable) {
      setIsHovering(true);
    }
  };

  // Handler khi rời chuột khỏi lá bài
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Handler khi click vào lá bài
  const handleCardClick = () => {
    if (onCardClick && (isSelectable || isRevealed)) {
      onCardClick(card);
    }
  };

  const handleImageError = () => {
    console.error("Cloudinary image failed to load for card:", card?.name, card?.imageUrl || card?.image_url);
    setImageError(true);
  };

  // Hiệu ứng cho lá bài
  const cardVariants = {
    hidden: { 
      scale: 0.9,
      opacity: 0,
      rotateY: 180
    },
    visible: { 
      scale: 1,
      opacity: 1,
      rotateY: isFlipped ? 0 : 180,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    selected: {
      scale: 1.05,
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3
      }
    }
  };

  // Hiệu ứng cho mặt sau lá bài
  const cardBackVariants = {
    hidden: { opacity: 1, rotateY: 0 },
    visible: { 
      opacity: 1, 
      rotateY: isFlipped ? 180 : 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Hiệu ứng cho mặt trước lá bài
  const cardFrontVariants = {
    hidden: { opacity: 0, rotateY: 180 },
    visible: { 
      opacity: 1, 
      rotateY: isFlipped ? 0 : 180,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Hiệu ứng glow khi hover
  const glowVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: isHovering ? 0.7 : 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <div 
      className={`absolute ${position} transition-transform duration-300`}
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <motion.div
        className={`relative ${sizeClasses} cursor-pointer perspective-500`}
        initial="hidden"
        animate={isRevealed ? "visible" : "hidden"}
        variants={cardVariants}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back */}
        <motion.div
          className="absolute inset-0 backface-hidden rounded-lg shadow-lg overflow-hidden"
          variants={cardBackVariants}
        >
          <img 
            src={cardBackImage} 
            alt="Card Back" 
            className="w-full h-full object-cover object-center"
            onError={e => {
              console.error("Error loading card back image:", e);
              e.target.src = fallbackCardBack;
            }}
          />
        </motion.div>
        
        {/* Card Front */}
        <motion.div
          className="absolute inset-0 backface-hidden rounded-lg shadow-lg overflow-hidden rotateY-180"
          variants={cardFrontVariants}
        >
          <div className={`w-full h-full relative ${isReversal ? 'rotate-180' : ''}`}>
            {cloudinaryImage && !imageError ? (
              <AdvancedImage 
                cldImg={cloudinaryImage} 
                alt={card.name || 'Tarot Card'} 
                className="w-full h-full object-cover object-center"
                onError={() => {
                  console.error('Cloudinary image failed to render, using fallback');
                  setImageError(true);
                }}
              />
            ) : (card?.imageUrl || card?.image_url) ? (
              // Sử dụng URL trực tiếp
              <img
                src={card.imageUrl || card.image_url}
                alt={card.name || 'Tarot Card'}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  console.error('Direct image failed to load, trying alternative format');
                  
                  // Nếu đã thử URL thay thế thì hiển thị fallback UI
                  if (e.target.src.includes('v1745522725/')) {
                    console.error('All image attempts failed for card:', card.name);
                    setImageError(true);
                    return;
                  }
                  
                  // Xử lý tên lá bài tiếng Việt
                  let formattedName = '';
                  let suffix = '';
                  
                  // Minor Arcana với suffix
                  if (card.name.includes('Mười Kiếm')) {
                    formattedName = 'TenOfSwords';
                    suffix = '_jerven';
                  } else if (card.name.includes('Mười Cốc')) {
                    formattedName = 'TenOfCups';
                    suffix = '_uoqb8c';
                  } else if (card.name.includes('Mười Gậy')) {
                    formattedName = 'TenOfWands';
                    suffix = '_euzzix';
                  } else if (card.name.includes('Mười Tiền')) {
                    formattedName = 'TenOfPentacles';
                    suffix = '_wtphlj';
                  } else if (card.name.includes('Chín Kiếm')) {
                    formattedName = 'NineOfSwords';
                    suffix = '_nijfvj';
                  } else if (card.name.includes('Chín Cốc')) {
                    formattedName = 'NineOfCups';
                    suffix = '_pyszhw';
                  } else if (card.name.includes('Chín Gậy')) {
                    formattedName = 'NineOfWands';
                    suffix = '_yvkl8e';
                  } else if (card.name.includes('Chín Tiền')) {
                    formattedName = 'NineOfPentacles';
                    suffix = '_tboaqv';
                  } else if (card.name.includes('Tám Kiếm')) {
                    formattedName = 'EightOfSwords';
                    suffix = '_kajc9g';
                  } else if (card.name.includes('Tám Cốc')) {
                    formattedName = 'EightOfCups';
                    suffix = '_w4ivqw';
                  } else if (card.name.includes('Tám Gậy')) {
                    formattedName = 'EightOfWands';
                    suffix = '_gbietz';
                  } else if (card.name.includes('Tám Tiền')) {
                    formattedName = 'EightOfPentacles';
                    suffix = '_y7o9k9';
                  } else if (card.name.includes('Bảy Kiếm')) {
                    formattedName = 'SevenOfSwords';
                    suffix = '_innw4v';
                  } else if (card.name.includes('Bảy Cốc')) {
                    formattedName = 'SevenOfCups';
                    suffix = '_wbt3zi';
                  } else if (card.name.includes('Bảy Gậy')) {
                    formattedName = 'SevenOfWands';
                    suffix = '_yngb4l';
                  } else if (card.name.includes('Bảy Tiền')) {
                    formattedName = 'SevenOfPentacles';
                    suffix = '_ysccld';
                  } else if (card.name.includes('Sáu Kiếm')) {
                    formattedName = 'SixOfSwords';
                    suffix = '_muvksz';
                  } else if (card.name.includes('Sáu Cốc')) {
                    formattedName = 'SixOfCups';
                    suffix = '_p74817';
                  } else if (card.name.includes('Sáu Gậy')) {
                    formattedName = 'SixOfWands';
                    suffix = '_uef068';
                  } else if (card.name.includes('Sáu Tiền')) {
                    formattedName = 'SixOfPentacles';
                    suffix = '_uzgyfh';
                  } else if (card.name.includes('Năm Kiếm')) {
                    formattedName = 'FiveOfSwords';
                    suffix = '_sdeegr';
                  } else if (card.name.includes('Năm Cốc')) {
                    formattedName = 'FiveOfCups';
                    suffix = '_bzawr6';
                  } else if (card.name.includes('Năm Gậy')) {
                    formattedName = 'FiveOfWands';
                    suffix = '_fmvkgg';
                  } else if (card.name.includes('Năm Tiền')) {
                    formattedName = 'FiveOfPentacles';
                    suffix = '_npbfyw';
                  } else if (card.name.includes('Bốn Kiếm')) {
                    formattedName = 'FourOfSwords';
                    suffix = '_fgtbpw';
                  } else if (card.name.includes('Bốn Cốc')) {
                    formattedName = 'FourOfCups';
                    suffix = '_maxvyk';
                  } else if (card.name.includes('Bốn Gậy')) {
                    formattedName = 'FourOfWands';
                    suffix = '_spesfc';
                  } else if (card.name.includes('Bốn Tiền')) {
                    formattedName = 'FourOfPentacles';
                    suffix = '_pxon77';
                  } else if (card.name.includes('Ba Kiếm')) {
                    formattedName = 'ThreeOfSwords';
                    suffix = '_nhm5h5';
                  } else if (card.name.includes('Ba Cốc')) {
                    formattedName = 'ThreeOfCups';
                    suffix = '_fpi8rp';
                  } else if (card.name.includes('Ba Gậy')) {
                    formattedName = 'ThreeOfWands';
                    suffix = '_uojynh';
                  } else if (card.name.includes('Ba Tiền')) {
                    formattedName = 'ThreeofPentacles';
                    suffix = '_j0kffg';
                  } else if (card.name.includes('Hai Kiếm')) {
                    formattedName = 'TwoOfSwords';
                    suffix = '_f05rgm';
                  } else if (card.name.includes('Hai Cốc')) {
                    formattedName = 'TwoOfCups';
                    suffix = '_pwpskq';
                  } else if (card.name.includes('Hai Gậy')) {
                    formattedName = 'TwoOfWands';
                    suffix = '_s1gelh';
                  } else if (card.name.includes('Hai Tiền')) {
                    formattedName = 'TwoOfPentacles';
                    suffix = '_agbu0n';
                  } else if (card.name.includes('Át Kiếm')) {
                    formattedName = 'AceOfSwords';
                    suffix = '_f1fzqw';
                  } else if (card.name.includes('Át Cốc')) {
                    formattedName = 'AceOfCups';
                    suffix = '_t4w5ut';
                  } else if (card.name.includes('Át Gậy')) {
                    formattedName = 'AceOfWands';
                    suffix = '_fhlfur';
                  } else if (card.name.includes('Át Tiền')) {
                    formattedName = 'AceOfPentacles';
                    suffix = '_vuges6';
                  } 
                  // Court Cards với suffix
                  else if (card.name.includes('Tiểu Đồng Kiếm')) {
                    formattedName = 'PageOfSwords';
                    suffix = '_zikkcf';
                  } else if (card.name.includes('Tiểu Đồng Cốc')) {
                    formattedName = 'PageOfCups';
                    suffix = '_ojzj7r';
                  } else if (card.name.includes('Tiểu Đồng Gậy')) {
                    formattedName = 'PageOfWands';
                    suffix = '_o4fj5p';
                  } else if (card.name.includes('Tiểu Đồng Tiền')) {
                    formattedName = 'PageOfPentacles';
                    suffix = '_n3hnmq';
                  } else if (card.name.includes('Hiệp Sĩ Kiếm')) {
                    formattedName = 'KnightOfSwords';
                    suffix = '_xqydss';
                  } else if (card.name.includes('Hiệp Sĩ Cốc')) {
                    formattedName = 'KnightOfCups';
                    suffix = '_vj0vaj';
                  } else if (card.name.includes('Hiệp Sĩ Gậy')) {
                    formattedName = 'KnightOfWands';
                    suffix = '_upeuxp';
                  } else if (card.name.includes('Hiệp Sĩ Tiền')) {
                    formattedName = 'KnightOfPentacles';
                    suffix = '_mhht9n';
                  } else if (card.name.includes('Hoàng Hậu Kiếm')) {
                    formattedName = 'QueenOfSwords';
                    suffix = '_zhonxv';
                  } else if (card.name.includes('Hoàng Hậu Cốc')) {
                    formattedName = 'QueenOfCups';
                    suffix = '_ptzivh';
                  } else if (card.name.includes('Hoàng Hậu Gậy')) {
                    formattedName = 'QueenOfWands';
                    suffix = '_f28hpp';
                  } else if (card.name.includes('Hoàng Hậu Tiền')) {
                    formattedName = 'QueenOfPentacles';
                    suffix = '_tjolog';
                  } else if (card.name.includes('Vua Kiếm')) {
                    formattedName = 'KingOfSwords';
                    suffix = '_hibs62';
                  } else if (card.name.includes('Vua Cốc')) {
                    formattedName = 'KingOfCups';
                    suffix = '_xusbfk';
                  } else if (card.name.includes('Vua Gậy')) {
                    formattedName = 'KingOfWands';
                    suffix = '_yggbgg';
                  } else if (card.name.includes('Vua Tiền')) {
                    formattedName = 'KingOfPentacles';
                    suffix = '_n9g4vz';
                  } 
                  // Major Arcana với suffix
                  else if (card.name === 'Mặt Trời') {
                    formattedName = 'TheSun';
                    suffix = '_o0habh';
                  } else if (card.name === 'Mặt Trăng') {
                    formattedName = 'TheMoon';
                    suffix = '_wiqrp1';
                  } else if (card.name === 'Người Treo Ngược') {
                    formattedName = 'TheHanged';
                    suffix = '_rhoyff';
                  } else if (card.name === 'Kẻ Ngốc') {
                    formattedName = 'TheFool';
                    suffix = '_ewfg71';
                  } else if (card.name === 'Nhà Ảo Thuật') {
                    formattedName = 'TheMagician';
                    suffix = '_fqzyrb';
                  } else if (card.name === 'Nữ Tư Tế Cấp Cao') {
                    formattedName = 'TheHighPriestess';
                    suffix = '_epsoay';
                  } else if (card.name === 'Nữ Hoàng') {
                    formattedName = 'TheEmpress';
                    suffix = '_zszjpa';
                  } else if (card.name === 'Hoàng Đế') {
                    formattedName = 'TheEmperor';
                    suffix = '_y1vfjk';
                  } else if (card.name === 'Giáo Hoàng') {
                    formattedName = 'TheHierophant';
                    suffix = '_n4buj1';
                  } else if (card.name === 'Những Người Yêu Nhau') {
                    formattedName = 'TheLovers';
                    suffix = '_wwajq8';
                  } else if (card.name === 'Cỗ Xe') {
                    formattedName = 'TheChariot';
                    suffix = '_xliwry';
                  } else if (card.name === 'Sức Mạnh') {
                    formattedName = 'Strength';
                    suffix = '_bqkfjy';
                  } else if (card.name === 'Ẩn Sĩ') {
                    formattedName = 'TheHermit';
                    suffix = '_kawr0b';
                  } else if (card.name === 'Vòng Quay May Mắn') {
                    formattedName = 'WheelOfFortune';
                    suffix = '_jgkdch';
                  } else if (card.name === 'Công Lý') {
                    formattedName = 'Justice';
                    suffix = '_e7uy1j';
                  } else if (card.name === 'Thần Chết') {
                    formattedName = 'Death';
                    suffix = '_djlyw0';
                  } else if (card.name === 'Sự Điều Hòa') {
                    formattedName = 'Temperance';
                    suffix = '_mtwuhm';
                  } else if (card.name === 'Tháp') {
                    formattedName = 'TheTower';
                    suffix = '_lmomxv';
                  } else if (card.name === 'Ngôi Sao') {
                    formattedName = 'TheStar';
                    suffix = '_teuak7';
                  } else if (card.name === 'Phán Xét') {
                    formattedName = 'Judgement';
                    suffix = '_e7uy1j'; // Duplicate Justice suffix
                  } else if (card.name === 'Thế Giới') {
                    formattedName = 'TheWorld';
                    suffix = '_fbqk2r';
                  } else {
                    formattedName = card.name.replace(/\s+/g, '');
                  }
                  
                  console.log('Using formatted name with suffix:', formattedName + suffix);
                  e.target.src = `https://res.cloudinary.com/dfp2ne3nn/image/upload/v1745522725/${formattedName}${suffix}.png`;
                }}
              />
            ) : (
              // Fallback khi không thể hiển thị hình ảnh
              <div className="w-full h-full flex flex-col items-center justify-center bg-purple-900/30 text-center p-2">
                <div className="text-white text-xs sm:text-sm font-semibold leading-tight">
                  {card?.name || 'Unknown Card'}
                </div>
                {card?.arcana && (
                  <div className="text-white/70 text-xs mt-1">
                    {card.arcana} {card.suit ? `(${card.suit})` : ''}
                  </div>
                )}
              </div>
            )}
            
            {/* Card Name */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-2">
              <p className="text-white text-center text-xs md:text-sm font-medium truncate">
                {card.name || 'Unknown Card'}
                {isReversal && ' (Reversed)'}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
});

TarotCardDisplay.propTypes = {
  card: PropTypes.object,
  isRevealed: PropTypes.bool,
  onCardClick: PropTypes.func,
  isSelectable: PropTypes.bool,
  isSelected: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  position: PropTypes.string,
  cardBackImage: PropTypes.string,
};

export default TarotCardDisplay; 