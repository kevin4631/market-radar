import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="text-xs font-mono text-radar-accent tracking-[0.3em] uppercase mb-3 flex items-center gap-3">
      <span className="w-6 h-[1px] bg-radar-accent"></span>
      {title}
    </h2>
    <div className="text-gray-300 leading-relaxed space-y-3 text-[15px]">{children}</div>
  </section>
);

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-radar-accent uppercase tracking-wider mb-10 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l'accueil
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          Politique de <span className="text-radar-accent">confidentialité</span>
        </h1>
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-12">
          Dernière mise à jour : 20 mai 2026
        </p>

        <div className="glass-card rounded-2xl border border-gray-800 p-8 md:p-12">

          <Section title="1. Responsable du traitement">
            <p>
              Market Radar est un projet étudiant édité dans le cadre des études à Ynov.
              Le responsable du traitement des données est l'équipe éditoriale du projet, joignable à l'adresse suivante :{' '}
              <a href="mailto:contact@marketradar.local" className="text-radar-accent underline hover:text-white">contact@marketradar.local</a>.
            </p>
            <p className="text-xs text-gray-500 italic">
              (Remplace cette adresse par ton vrai contact dans <code>pages/Privacy.tsx</code>.)
            </p>
          </Section>

          <Section title="2. Données collectées">
            <p>Lorsque tu t'inscris à la newsletter, nous collectons uniquement :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ton <strong className="text-white">adresse email</strong></li>
              <li>La <strong className="text-white">date et l'heure</strong> de ton inscription</li>
              <li>Un <strong className="text-white">jeton de désinscription</strong> unique (technique, généré aléatoirement)</li>
            </ul>
            <p>Aucune autre information personnelle n'est collectée. Pas de cookies de tracking, pas d'analytics tiers.</p>
          </Section>

          <Section title="3. Finalité du traitement">
            <p>
              Tes données sont utilisées <strong className="text-white">uniquement</strong> pour t'envoyer un email à chaque nouvelle publication d'un PDF sur Market Radar.
              Nous ne t'enverrons pas de contenu publicitaire ou commercial.
            </p>
          </Section>

          <Section title="4. Base légale">
            <p>
              Le traitement repose sur ton <strong className="text-white">consentement explicite</strong> (article 6.1.a du RGPD),
              donné lors de l'inscription via la case à cocher dédiée.
            </p>
          </Section>

          <Section title="5. Durée de conservation">
            <p>
              Tes données sont conservées tant que tu restes inscrit à la newsletter.
              Elles sont <strong className="text-white">immédiatement supprimées</strong> lorsque tu te désinscris (via le lien présent dans chaque email)
              ou si tu nous en fais la demande par mail.
            </p>
          </Section>

          <Section title="6. Destinataires des données">
            <p>Tes données sont stockées chez nos sous-traitants techniques :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Supabase</strong> (hébergement de la base de données, région UE)</li>
              <li><strong className="text-white">Resend</strong> (envoi des emails)</li>
            </ul>
            <p>Aucune donnée n'est transmise à des tiers à des fins commerciales.</p>
          </Section>

          <Section title="7. Tes droits">
            <p>Conformément au RGPD, tu disposes des droits suivants :</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Droit d'accès</strong> : savoir quelles données nous détenons sur toi</li>
              <li><strong className="text-white">Droit de rectification</strong> : corriger une donnée inexacte</li>
              <li><strong className="text-white">Droit à l'effacement</strong> : supprimer ton inscription (lien dans chaque mail)</li>
              <li><strong className="text-white">Droit d'opposition</strong> : refuser le traitement de tes données</li>
              <li><strong className="text-white">Droit à la portabilité</strong> : récupérer tes données dans un format lisible</li>
            </ul>
            <p>
              Pour exercer ces droits, contacte-nous à{' '}
              <a href="mailto:contact@marketradar.local" className="text-radar-accent underline hover:text-white">contact@marketradar.local</a>.
            </p>
          </Section>

          <Section title="8. Réclamation">
            <p>
              Si tu estimes que tes droits ne sont pas respectés, tu peux introduire une réclamation auprès de la{' '}
              <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-radar-accent underline hover:text-white">
                CNIL (Commission Nationale de l'Informatique et des Libertés)
              </a>
              .
            </p>
          </Section>

          <Section title="9. Sécurité">
            <p>
              Nous mettons en œuvre des mesures techniques pour protéger tes données :
              chiffrement en transit (HTTPS), stockage sécurisé chez Supabase, accès restreint à l'administration.
            </p>
          </Section>

        </div>

        <p className="text-center text-xs text-gray-600 font-mono mt-10 uppercase tracking-widest">
          Market Radar — Projet étudiant Ynov
        </p>
      </motion.div>
    </div>
  );
};

export default Privacy;
