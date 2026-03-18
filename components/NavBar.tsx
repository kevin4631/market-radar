import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  const handleScrollToPdfs = () => {
    const grid = document.getElementById('market-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('market-grid')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="fixed top-6 left-0 w-full z-50 flex justify-center pointer-events-none px-4">
      <nav className="pointer-events-auto bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl shadow-black/50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-6 h-6">
             <div className="absolute inset-0 bg-radar-accent rounded-full animate-ping opacity-20"></div>
             <div className="relative w-6 h-6 bg-gradient-to-tr from-radar-900 to-radar-600 rounded-full border border-radar-accent/50 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>
             </div>
          </div>
          <span className="font-sans font-bold text-white tracking-tight text-lg">
            MARKET<span className="text-radar-accent font-light">RADAR</span>
          </span>
        </Link>

        <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleScrollToPdfs}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105"
          >
            ACCÉDER AUX PDFS
          </button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;