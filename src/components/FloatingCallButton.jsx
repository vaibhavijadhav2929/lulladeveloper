import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';

const FloatingCallButton = () => {
    return (
        <motion.a
            href="tel:+919876543210"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[99] flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:shadow-green-500/50 hover:bg-green-400 transition-all cursor-pointer group"
            aria-label="Call Us"
        >
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
            <PhoneCall className="w-6 h-6 relative z-10" />
            
            {/* Tooltip on hover */}
            <span className="absolute right-full mr-4 px-3 py-1.5 bg-dark text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-white/10 hidden sm:block">
                Call Now
            </span>
        </motion.a>
    );
};

export default FloatingCallButton;
