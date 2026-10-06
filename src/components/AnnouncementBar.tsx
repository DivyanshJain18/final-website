import { motion } from 'motion/react';

interface AnnouncementBarProps {
  className?: string;
}

export function AnnouncementBar({ className = '' }: AnnouncementBarProps) {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full bg-navy-900/90 backdrop-blur-md border-b border-white/10 text-slate-300 text-center text-xs sm:text-[13px] py-2.5 px-4 shadow-sm z-30 ${className}`}
      role="region"
      aria-label="Announcement"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-1.5">
        <span className="font-semibold text-white">Leading Importer & Wholesale Supplier:</span>
        <span>Our online catalog is currently being updated. We supply all varieties of robotics and computer components—please</span>
        <a 
          href="mailto:sales@mechafyglobal.com?subject=Quote%20Request%20-%20Mechafy%20Global" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-electric-blue hover:text-cyan-300 hover:underline font-bold transition-colors ml-1 inline-flex items-center"
        >
          REQUEST A QUOTE VIA EMAIL
        </a>
        <span>for items not yet listed.</span>
      </div>
    </motion.div>
  );
}
