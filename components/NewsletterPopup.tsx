import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToNewsletter } from '../services/newsletter';

const STORAGE_KEY = 'mr-newsletter-popup';
const SHOW_DELAY_MS = 8000;
// Si l'utilisateur ferme sans s'inscrire, on attend 7 jours avant de réafficher
const CLOSE_COOLDOWN_DAYS = 7;

type Status = 'idle' | 'loading' | 'success' | 'error';

interface PopupState {
  status: 'subscribed' | 'dismissed';
  at: string;
}

const NewsletterPopup: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  // Ne pas afficher sur /admin, /privacy, /unsubscribed
  const isExcludedRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/privacy') ||
    location.pathname.startsWith('/unsubscribed');

  useEffect(() => {
    if (isExcludedRoute) {
      setVisible(false);
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const state: PopupState = JSON.parse(raw);
        if (state.status === 'subscribed') return;
        if (state.status === 'dismissed') {
          const closedAt = new Date(state.at).getTime();
          const cooldown = CLOSE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
          if (Date.now() - closedAt < cooldown) return;
        }
      } catch {
        // ignore parse errors
      }
    }

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isExcludedRoute]);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'dismissed', at: new Date().toISOString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setStatus('error');
      setMessage('Accepte la politique pour t\'inscrire.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      await subscribeToNewsletter(email.trim().toLowerCase());
      setStatus('success');
      setMessage('Inscription confirmée. Check tes mails.');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'subscribed', at: new Date().toISOString() }));
      setTimeout(() => setVisible(false), 2500);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="fixed bottom-6 right-6 z-[90] w-[calc(100vw-3rem)] max-w-sm pointer-events-auto"
        >
          <div className="relative glass-card rounded-2xl border border-radar-accent/30 p-5 shadow-2xl shadow-black/60 overflow-hidden">
            {/* Glow accent */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-radar-accent/20 blur-3xl rounded-full pointer-events-none"></div>

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Fermer"
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center z-10"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-radar-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-radar-accent"></span>
                </span>
                <span className="text-[10px] font-mono text-radar-accent tracking-[0.3em] uppercase">
                  Signal direct
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-1 leading-tight">
                Reste à l'affût du <span className="text-radar-accent">prochain PDF</span>.
              </h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Un mail à chaque parution. Zéro spam, désinscription en 1 clic.
              </p>

              {status === 'success' ? (
                <p className="text-xs font-mono text-radar-accent py-3" role="status">
                  ✓ {message}
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    disabled={status === 'loading'}
                    className="w-full bg-black/50 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:border-radar-accent focus:outline-none transition-colors disabled:opacity-50"
                  />

                  <label className="flex items-start gap-2 text-[11px] text-gray-400 cursor-pointer leading-snug">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      disabled={status === 'loading'}
                      className="mt-0.5 accent-radar-accent flex-shrink-0"
                    />
                    <span>
                      J'accepte la{' '}
                      <Link to="/privacy" className="text-radar-accent underline hover:text-white">
                        politique de confidentialité
                      </Link>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={status === 'loading' || !email}
                    className="w-full bg-radar-accent text-black font-bold py-2 rounded-md hover:bg-white transition-colors uppercase tracking-wider text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'INSCRIPTION...' : "S'inscrire"}
                  </button>

                  {message && status === 'error' && (
                    <p className="text-[11px] font-mono text-red-400 pt-1" role="status">
                      {message}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterPopup;
