import React, { useState, useEffect } from 'react';
import { getReports, seedInitialData, getCategories } from '../services/storage';
import { MarketReport } from '../types';
import PDFCard from '../components/PDFCard';
import NewsletterSection from '../components/NewsletterSection';
import { motion, AnimatePresence } from 'framer-motion';

const Home: React.FC = () => {
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<MarketReport | null>(null);

  useEffect(() => {
    const load = async () => {
      await seedInitialData();
      const [reps, cats] = await Promise.all([getReports(), getCategories()]);
      setReports(reps);
      setCategories(['All', ...cats]);
    };
    load();
  }, []);

  const filteredReports = filter === 'All'
    ? reports
    : reports.filter(r => r.category === filter);

  const scrollToGrid = () => {
    document.getElementById('market-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative z-10 overflow-hidden">

      {/* --- HERO RADAR --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140vw] h-[100vh] -z-10 pointer-events-none flex justify-center overflow-hidden">
        <div
           className="w-[100vw] h-[100vw] md:w-[60vw] md:h-[60vw] max-w-[800px] max-h-[800px] rounded-full animate-[spin_15s_linear_infinite] opacity-30 mix-blend-screen mt-[-10%]"
           style={{
             background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(255, 49, 49, 0.5) 360deg)'
           }}
        />
        <div className="absolute top-[25%] md:top-[30%] left-1/2 -translate-x-1/2 w-64 h-64 bg-radar-accent/20 blur-[100px] rounded-full"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-7xl md:text-9xl font-bold text-white mb-8 tracking-tighter leading-[0.85] text-glow select-none relative">
            MARKET<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-radar-accent via-white to-[#ffe6e6]">RADAR</span>
          </h1>

          <div className="flex justify-center mb-12">
             <button
               onClick={scrollToGrid}
               className="group relative px-8 py-4 bg-white text-black font-bold text-sm rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
             >
                <div className="absolute inset-0 w-full h-full bg-radar-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  EXPLORER LE FLUX
                  <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </span>
             </button>
          </div>
        </motion.div>
      </div>

      {/* --- PROJECT PRESENTATION (MANIFESTO) --- */}
      <div className="max-w-5xl mx-auto px-6 mb-32 relative">
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-l border-radar-accent/30 pl-8 md:pl-12 py-2"
         >
            <h3 className="text-xs font-mono text-radar-accent tracking-[0.4em] mb-6 uppercase flex items-center gap-3">
               <span className="w-8 h-[1px] bg-radar-accent"></span>
               Identité du Projet
            </h3>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 leading-tight">
                Décrypter <span className="text-gray-600">l'actu</span>, garder l'avance.
            </h2>

            <div className="grid md:grid-cols-2 gap-12 text-gray-400 text-lg font-light leading-relaxed">
               <p>
                  <span className="text-white font-medium">Chaque semaine</span>, un PDF qui condense les tendances tech, marketing, design, business pour les étudiants Ynov. On filtre le bruit, on synthétise ce qui compte, on livre un format court et actionnable.
               </p>
               <p>
                   <span className="text-white font-medium">L'objectif :</span> faciliter l'accès à l'information utile et créer un réflexe de veille régulier, avec un support simple, structuré, pensé pour vos projets.</p>
            </div>
         </motion.div>
      </div>

      {/* --- MAIN GRID SECTION --- */}
      <div id="market-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">DERNIÈRES PARUTIONS</h2>
            <p className="text-gray-500 font-mono text-xs">VOTRE DOSE D'INSIGHTS HEBDOMADAIRE</p>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 md:mt-0 p-1 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full inline-flex gap-1 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap ${
                  filter === cat
                    ? 'bg-white text-black shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'All' ? 'TOUT' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReports.length > 0 ? (
              filteredReports.map((report, index) => (
                <PDFCard
                  key={report.id}
                  report={report}
                  index={index}
                  onOpen={setSelectedReport}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/5"
              >
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                </div>
                <p className="text-gray-500 font-mono text-sm tracking-widest">AUCUN FLUX DE DONNÉES</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- NEWSLETTER SECTION --- */}
      <NewsletterSection />

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0f0f0f] w-full max-w-6xl h-[85vh] rounded-3xl border border-white/10 overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-radar-accent/10 flex items-center justify-center text-radar-accent">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   </div>
                   <div>
                     <h2 className="text-lg font-bold text-white tracking-tight">{selectedReport.title}</h2>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-500 font-mono uppercase">ID: {selectedReport.id}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 font-mono uppercase">{selectedReport.category}</span>
                     </div>
                   </div>
                </div>

                <div className="flex gap-4">
                    {/* NEW TAB BUTTON */}
                    {selectedReport.fileUrl && (
                        <a
                            href={selectedReport.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors border border-white/10"
                        >
                            <span>OUVRIR DANS UN NOUVEL ONGLET</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                    )}

                    <button
                    onClick={() => setSelectedReport(null)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
              </div>

              {/* Viewer Content */}
              <div className="flex-1 bg-[#050505] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
                 {/* Grid Background in Viewer */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                          backgroundSize: '40px 40px'
                      }}>
                 </div>

                 {selectedReport.fileUrl ? (
                   <iframe src={selectedReport.fileUrl} className="w-full h-full border-none z-10" title="PDF Preview" />
                 ) : (
                    <div className="relative z-10 max-w-lg">
                        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-2xl relative">
                           <div className="absolute inset-0 bg-radar-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                           <svg className="w-10 h-10 text-gray-400 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l4-4 4 4h-3v4h-2z"/></svg>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">Protocole de Chiffrement Actif</h3>
                        <p className="text-gray-500 mb-10 text-sm leading-relaxed">
                          Ce document est protégé par un chiffrement de niveau militaire.
                          <br/>La prévisualisation est désactivée.
                        </p>
                    </div>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
