import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { subscribeToNewsletter } from '../services/newsletter';

type Status = 'idle' | 'loading' | 'success' | 'error';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setStatus('error');
      setMessage('Tu dois accepter la politique de confidentialité pour t\'inscrire.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      await subscribeToNewsletter(email.trim().toLowerCase());
      setStatus('success');
      setMessage('Inscription confirmée. Vérifie ta boîte de réception (et les spams).');
      setEmail('');
      setConsent(false);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
  };

  return (
    <section id="newsletter" className="max-w-5xl mx-auto px-6 mt-32 mb-12 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative glass-card rounded-3xl border border-radar-accent/20 p-8 md:p-14 overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-32 -right-32 w-72 h-72 bg-radar-accent/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-radar-accent/10 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-xs font-mono text-radar-accent tracking-[0.4em] mb-4 uppercase flex items-center gap-3">
              <span className="w-8 h-[1px] bg-radar-accent"></span>
              Signal direct
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Reçois chaque <span className="text-radar-accent">nouveau PDF</span> dès sa publication.
            </h2>
            <p className="text-gray-400 text-base leading-relaxed">
              Une notification par mail, zéro spam, désinscription en un clic.
              Pas de partage de ton adresse, point.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newsletter-email" className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
                Ton email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@ynov.com"
                disabled={status === 'loading'}
                className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 text-white focus:border-radar-accent focus:outline-none transition-colors disabled:opacity-50"
              />
            </div>

            <label className="flex items-start gap-3 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                disabled={status === 'loading'}
                className="mt-0.5 accent-radar-accent"
              />
              <span className="leading-relaxed">
                J'accepte de recevoir la newsletter Market Radar et la{' '}
                <Link to="/privacy" className="text-radar-accent underline hover:text-white transition-colors">
                  politique de confidentialité
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="w-full bg-radar-accent text-black font-bold py-3 rounded-lg hover:bg-white transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'INSCRIPTION...' : "S'inscrire au signal"}
            </button>

            {message && (
              <p
                role="status"
                className={`text-xs font-mono ${status === 'success' ? 'text-radar-accent' : 'text-red-400'}`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default NewsletterSection;
