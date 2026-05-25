import { motion, useInView, useAnimation } from 'motion/react';
import { ReactNode, useEffect, useRef } from 'react';

interface RevealProps {
  children: ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function Reveal({ 
  children, 
  width = '100%', 
  delay = 0.25, 
  duration = 0.5,
  direction = 'up',
  className = ''
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 75 : direction === 'down' ? -75 : 0,
      x: direction === 'left' ? 75 : direction === 'right' ? -75 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      transition: { duration, delay, ease: "easeOut" as const }
    },
  };

  return (
    <div ref={ref} style={{ width }} className={`relative ${className}`}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={mainControls}
      >
        {children}
      </motion.div>
    </div>
  );
}
