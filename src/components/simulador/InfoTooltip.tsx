"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoTooltipProps {
    content: string;
    children?: React.ReactNode;
}

export default function InfoTooltip({ content, children }: InfoTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="relative inline-block ml-2">
            <button
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="text-gray-400 hover:text-tech-blue transition-colors focus:outline-none"
            >
                {children || (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
            </button>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-navy-slate text-white text-[10px] font-medium rounded-xl shadow-2xl z-50 pointer-events-none"
                    >
                        <div className="relative">
                            {content}
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-navy-slate rotate-45 -mb-1"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

