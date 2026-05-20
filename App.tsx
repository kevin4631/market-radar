import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import NavBar from './components/NavBar';
import Background from './components/Background';
import NewsletterPopup from './components/NewsletterPopup';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import Unsubscribed from './pages/Unsubscribed';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen font-sans text-gray-100 overflow-x-hidden selection:bg-radar-accent selection:text-black relative">
        <Background />
        
        {/* Content wrapper with z-index to sit on top of background */}
        <div className="relative z-10">
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/unsubscribed" element={<Unsubscribed />} />
            </Routes>
          </main>

          <footer className="py-12 text-center pointer-events-auto flex flex-col items-center gap-3">
            <Link
              to="/privacy"
              className="text-gray-500 text-[10px] font-mono tracking-widest uppercase hover:text-radar-accent transition-colors"
            >
              Politique de confidentialité
            </Link>
            <Link
              to="/admin"
              className="text-gray-500 text-[10px] font-mono tracking-widest uppercase opacity-20 cursor-default hover:text-gray-500 decoration-0"
              style={{ cursor: 'default' }}
            >
              Market Radar
            </Link>
          </footer>

          <NewsletterPopup />
        </div>
      </div>
    </HashRouter>
  );
};

export default App;