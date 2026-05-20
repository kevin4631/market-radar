import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

type Status = 'ok' | 'already' | 'invalid' | 'error';

interface Display {
  title: string;
  message: string;
  success: boolean;
}

const buildDisplay = (status: Status, email: string | null): Display => {
  switch (status) {
    case 'invalid':
      return {
        title: 'Lien invalide',
        message: 'Le lien de désinscription est invalide ou expiré.',
        success: false,
      };
    case 'error':
      return {
        title: 'Erreur',
        message: 'Une erreur est survenue. Réessaie plus tard.',
        success: false,
      };
    case 'already':
      return {
        title: 'Déjà désinscrit',
        message: 'Tu n\'es plus inscrit à la newsletter Market Radar.',
        success: true,
      };
    case 'ok':
    default:
      return {
        title: 'Désinscription confirmée',
        message: email
          ? `${email} a été retiré de la newsletter. À bientôt !`
          : 'Tu as bien été retiré de la newsletter. À bientôt !',
        success: true,
      };
  }
};

const Unsubscribed: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = (params.get('status') || 'ok') as Status;
  const email = params.get('email');
  const display = buildDisplay(status, email);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className="glass-card rounded-3xl border border-gray-800 p-12 max-w-md w-full text-center relative overflow-hidden"
      >
        {/* Glow */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 blur-[80px] rounded-full pointer-events-none"
          style={{ background: display.success ? 'rgba(255,49,49,0.15)' : 'rgba(120,120,120,0.1)' }}
        ></div>

        <div className="relative z-10">
          <div
            className={`text-[11px] font-mono uppercase tracking-[0.4em] mb-8 ${
              display.success ? 'text-radar-accent' : 'text-gray-500'
            }`}
          >
            // Market Radar
          </div>

          <div className="mb-6 flex justify-center">
            {display.success ? (
              <div className="w-14 h-14 rounded-full bg-radar-accent/10 border border-radar-accent/30 flex items-center justify-center">
                <svg className="w-7 h-7 text-radar-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{display.title}</h1>
          <p className="text-gray-400 leading-relaxed mb-10">{display.message}</p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-radar-accent text-white hover:text-black border border-white/10 hover:border-radar-accent text-xs font-bold uppercase tracking-wider transition-all"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Unsubscribed;
