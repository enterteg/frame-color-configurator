import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}

const AnimatedCollapse: React.FC<AnimatedCollapseProps> = ({ 
  isOpen, 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={ isOpen ? { 
        height: 'auto', 
        opacity: 1,
        transition: {
          height: {
            duration: 0.4, // Increased by 100ms
            ease: [0.4, 0, 0.2, 1], // Same cubic-bezier as current
          },
          opacity: {
            duration: 0.3,
            delay: 0.1, // Slightly delayed for better effect
          }
        }
      } : {
        height: 0, 
        opacity: 0,
        transition: {
          height: {
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
          },
          opacity: {
            duration: 0.15,
          }
        }
      }}
      style={{ 
        overflow: 'hidden',
        pointerEvents: isOpen ? 'auto' : 'none' // Disable interactions when collapsed
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCollapse; 