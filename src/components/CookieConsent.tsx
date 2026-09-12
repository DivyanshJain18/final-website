import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <div className="glass-panel p-5 rounded-xl shadow-2xl border border-white/10 bg-navy-900/95 backdrop-blur-xl">
            <h3 className="text-white font-semibold mb-2 text-sm">Cookie Consent</h3>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              <Link to="/privacy-policy" className="text-electric-blue hover:underline ml-1">
                Learn more
              </Link>
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleAccept}
                className="flex-1 bg-electric-blue hover:bg-blue-600 text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Accept
              </button>
              <button 
                onClick={handleReject}
                className="flex-1 bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
