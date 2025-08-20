'use client';

import { LayoutDashboard } from 'lucide-react';
import { THEME_COLORS } from '@/lib/theme-colors';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

const sizeConfig = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4',
    text: 'text-sm'
  },
  md: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6',
    text: 'text-base'
  },
  lg: {
    container: 'w-16 h-16',
    icon: 'w-8 h-8',
    text: 'text-lg'
  },
  xl: {
    container: 'w-24 h-24',
    icon: 'w-12 h-12',
    text: 'text-xl'
  }
};

export function LoadingSpinner({ 
  size = 'md', 
  text, 
  className 
}: LoadingSpinnerProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className || ''}`}>
      {/* Animated Icon Container */}
      <motion.div
        className={`
          ${config.container} 
          ${THEME_COLORS.logo.background} 
          rounded-2xl 
          flex items-center justify-center
          shadow-lg
        `}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <motion.div
          animate={{
            scale: [1, 0.8, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <LayoutDashboard 
            className={`${config.icon} ${THEME_COLORS.logo.icon}`}
          />
        </motion.div>
      </motion.div>

      {/* Animated Dots */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${THEME_COLORS.logo.background}`}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              delay: index * 0.2
            }}
          />
        ))}
      </div>

      {/* Optional Loading Text */}
      {text && (
        <motion.p
          className={`
            ${config.text} 
            ${THEME_COLORS.dashboard.subtitle} 
            font-medium text-center
          `}
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Loading Overlay Component para páginas completas
export function LoadingOverlay({ 
  text = "Cargando...",
  className 
}: { 
  text?: string; 
  className?: string; 
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        fixed inset-0 
        ${THEME_COLORS.main.background} ${THEME_COLORS.main.backgroundDark}
        flex items-center justify-center z-50
        ${className || ''}
      `}
    >
      <LoadingSpinner size="lg" text={text} />
    </motion.div>
  );
}