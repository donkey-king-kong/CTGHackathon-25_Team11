import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MessageAnimationProps {
  children: ReactNode;
  animationType: string;
  isHovered: boolean;
  onClick: () => void;
  delay?: number;
}

const animationVariants = {
  plane: {
    initial: { x: -100, y: -100, rotate: -45, opacity: 0 },
    animate: { x: 0, y: 0, rotate: 0, opacity: 1 },
    hover: { y: -8, rotate: 5 },
    transition: { type: "spring" as const, duration: 0.8 }
  },
  candy: {
    initial: { scale: 0, rotate: 180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    hover: { scale: 1.05, rotate: [0, -5, 5, 0] },
    transition: { type: "spring" as const, duration: 0.6 }
  },
  heart: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: [1, 1.2, 1], transition: { duration: 0.4 } },
    transition: { type: "spring" as const, duration: 0.5 }
  },
  balloon: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: [-2, -8, -2], transition: { duration: 1, repeat: Infinity } },
    transition: { type: "spring" as const, duration: 0.7 }
  },
  letterbox: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -5, rotateY: 5 },
    transition: { duration: 0.4 }
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case 'plane': return '✈️';
    case 'candy': return '🍭';
    case 'heart': return '❤️';
    case 'balloon': return '🎈';
    case 'letterbox': return '📮';
    default: return '💌';
  }
};

export function MessageAnimation({ 
  children, 
  animationType, 
  isHovered, 
  onClick, 
  delay = 0 
}: MessageAnimationProps) {
  const variants = animationVariants[animationType as keyof typeof animationVariants] || animationVariants.letterbox;

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={variants.initial}
      animate={variants.animate}
      whileHover={variants.hover}
      transition={{ ...variants.transition, delay }}
      onClick={onClick}
    >
      {/* Delivery icon */}
      <motion.div
        className="absolute -top-2 -right-2 text-2xl z-10"
        animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {getIcon(animationType)}
      </motion.div>

      {/* Message content */}
      <motion.div
        className="relative"
        animate={isHovered ? { boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } : {}}
      >
        {children}
      </motion.div>

      {/* Sparkles effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-400 text-sm"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}