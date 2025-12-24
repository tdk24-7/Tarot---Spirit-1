/**
 * Animation variants for Framer Motion
 * Used across the tarot components for consistent animations
 */

// Fade animation variants
export const fadeVariants = {
  hidden: { 
    opacity: 0,
    y: 10,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
}

// Card animation variants
export const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateY: 180,
    scale: 0.8
  },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: custom * 0.1,
      duration: 0.5
    }
  }),
  hover: {
    y: -10,
    scale: 1.05,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  selected: {
    y: -15,
    scale: 1.1,
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 }
  }
}

// Deck animation variants
export const deckVariants = {
  initial: {
    rotateZ: 0,
    x: 0,
    y: 0
  },
  shuffling: (custom) => ({
    rotateZ: custom.rotation,
    x: custom.x,
    y: custom.y,
    transition: {
      type: 'spring',
      stiffness: 1000,
      damping: 10
    }
  }),
  dealing: {
    scale: 0.98,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  }
}

// Result card animation variants
export const resultCardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateY: 180
  },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      delay: custom * 0.2,
      duration: 0.8
    }
  }),
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 }
  }
}

// Hover animation for various UI elements
export const hoverVariants = {
  initial: {
    scale: 1
  },
  hover: {
    scale: 1.05,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95
  }
} 