import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MarketReport } from '../types';

interface PDFCardProps {
  report: MarketReport;
  onOpen: (report: MarketReport) => void;
  index: number;
}

const PDFCard: React.FC<PDFCardProps> = ({ report, onOpen, index }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      className="relative rounded-2xl bg-radar-card border border-white/5 overflow-hidden group cursor-pointer"
      onClick={() => onOpen(report)}
    >
      {/* Spotlight Effect Gradient (Red) */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255, 49, 49, 0.1), transparent 40%)`,
        }}
      />
      {/* Border Spotlight (Red) */}
      <div 
         className="absolute inset-0 rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 pointer-events-none"
         style={{
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255, 49, 49, 0.4), transparent 40%)`,
            maskImage: 'linear-gradient(#fff, #fff)',
            WebkitMaskImage: 'linear-gradient(#fff, #fff)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px'
         }}
      >
        <div className="w-full h-full bg-transparent rounded-2xl" />
      </div>

      <div className="relative p-6 h-full flex flex-col z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-radar-accent animate-pulse shadow-[0_0_10px_#ff3131]" />
            <span className="text-[10px] font-mono text-radar-accent/80 uppercase tracking-widest">
              {report.category}
            </span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-radar-accent transition-colors leading-tight">
          {report.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-6 flex-1 leading-relaxed border-l-2 border-white/5 pl-4 ml-1">
          {report.description}
        </p>

        <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
          <span className="text-xs text-gray-600 font-mono">
             {new Date(report.uploadDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          <div className="flex items-center gap-2 text-white text-xs font-bold tracking-wider group-hover:translate-x-1 transition-transform">
             ACCÉDER
             <svg className="w-4 h-4 text-radar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PDFCard;