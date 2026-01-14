import React, { useState, useEffect } from 'react';
import { getReports, saveReport, deleteReport, getCategories, saveCategory, deleteCategory } from '../services/storage';
import { MarketReport } from '../types';
import { motion } from 'framer-motion';

const Admin: React.FC = () => {
  // Initialize auth state from localStorage to persist session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('market_radar_admin_session') === 'true';
  });
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Data State
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Form State (Report)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [currentFileData, setCurrentFileData] = useState<string | null>(null);
  
  // Form State (Category)
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    setReports(getReports());
    const cats = getCategories();
    setCategories(cats);
    if (!category && cats.length > 0) setCategory(cats[0]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('market_radar_admin_session', 'true');
    } else {
      alert('Identifiants incorrects');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('market_radar_admin_session');
  };

  // --- REPORT MANAGEMENT ---

  const handleEditClick = (report: MarketReport) => {
    setEditingId(report.id);
    setTitle(report.title);
    setDescription(report.description);
    setCategory(report.category);
    setCurrentFileData(report.fileData);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setFile(null);
    setCurrentFileData(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let fileData = currentFileData;

    if (file) {
      fileData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const reportToSave: MarketReport = {
      id: editingId || Date.now().toString(),
      title,
      description,
      category,
      uploadDate: editingId ? (reports.find(r => r.id === editingId)?.uploadDate || new Date().toISOString()) : new Date().toISOString(),
      fileData,
    };

    saveReport(reportToSave);
    loadData();
    handleCancelEdit();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Supprimer définitivement ce rapport ?')) {
      deleteReport(id);
      loadData();
      if (editingId === id) handleCancelEdit();
    }
  };

  // --- CATEGORY MANAGEMENT ---

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      saveCategory(newCategory.trim());
      setNewCategory('');
      loadData();
    }
  };

  const handleDeleteCategory = (cat: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Supprimer le thème "${cat}" ?`)) {
      deleteCategory(cat);
      loadData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center z-10 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-2xl w-full max-w-md border border-gray-800 bg-black/80"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-mono text-radar-accent tracking-widest">ACCÈS ADMINISTRATEUR</h2>
            <p className="text-gray-500 text-xs mt-2 uppercase">Authentification Requise</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
               <label className="block text-xs font-mono text-gray-500 mb-1">UTILISATEUR</label>
               <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:border-radar-accent focus:outline-none transition-colors"
               />
            </div>
            <div>
               <label className="block text-xs font-mono text-gray-500 mb-1">MOT DE PASSE</label>
               <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded p-3 text-white focus:border-radar-accent focus:outline-none transition-colors"
               />
            </div>
            <button
              type="submit"
              className="w-full bg-radar-accent text-black font-bold py-3 rounded hover:bg-white transition-colors mt-4 uppercase tracking-wider"
            >
              Connexion
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: EDITOR & SETTINGS (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* EDITOR PANEL */}
          <div className="glass-card p-6 rounded-xl border border-gray-800 sticky top-24">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full animate-pulse ${editingId ? 'bg-yellow-500' : 'bg-radar-accent'}`}></span>
                 {editingId ? 'ÉDITER LE RAPPORT' : 'PUBLIER INTEL'}
               </h2>
               <div className="flex items-center gap-3">
                 {editingId && (
                   <button onClick={handleCancelEdit} className="text-xs text-gray-400 hover:text-white underline">Annuler</button>
                 )}
                 <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-400 underline uppercase tracking-wider">
                   Déconnexion
                 </button>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">TITRE</label>
                <input
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-radar-accent focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">THÈME</label>
                <select
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-radar-accent focus:outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">DESCRIPTION</label>
                <textarea
                  required value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                  className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-radar-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-1">
                   DOCUMENT PDF {editingId && '(Laisser vide pour conserver l\'actuel)'}
                </label>
                <input
                  type="file" accept="application/pdf" onChange={handleFileChange}
                  required={!editingId && !file} 
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-radar-accent/10 file:text-radar-accent hover:file:bg-radar-accent/20"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-radar-accent text-black font-bold py-3 rounded hover:bg-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {editingId ? 'METTRE À JOUR' : 'PUBLIER'}
              </button>
            </form>
          </div>

          {/* CATEGORY MANAGER PANEL */}
          <div className="glass-card p-6 rounded-xl border border-gray-800">
             <h3 className="text-sm font-bold text-white mb-4 font-mono tracking-widest border-b border-gray-800 pb-2">GESTION DES THÈMES</h3>
             
             <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                <input 
                  type="text" placeholder="Nouveau thème..." value={newCategory} onChange={e => setNewCategory(e.target.value)}
                  className="flex-1 bg-black/40 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-radar-accent focus:outline-none"
                />
                <button type="submit" className="px-3 py-2 bg-white/10 hover:bg-radar-accent text-white rounded text-xs font-bold transition-colors">+</button>
             </form>

             <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center gap-1 pl-3 pr-1 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                     {cat}
                     <button 
                       type="button"
                       onClick={(e) => handleDeleteCategory(cat, e)} 
                       className="p-1 hover:text-radar-accent text-gray-500 rounded-full hover:bg-white/10 transition-colors"
                     >
                        ×
                     </button>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIST (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-end">
             <h2 className="text-xl font-bold text-white">DOCUMENTS ACTIFS ({reports.length})</h2>
             <p className="text-xs text-gray-500">Cliquez sur un rapport pour l'éditer</p>
          </div>
          
          <div className="grid gap-4">
            {reports.map((report) => (
              <div 
                key={report.id} 
                onClick={() => handleEditClick(report)}
                className={`glass-card p-5 rounded-lg border flex justify-between items-center group cursor-pointer transition-all ${editingId === report.id ? 'border-radar-accent bg-radar-accent/5' : 'border-gray-800 hover:border-gray-600'}`}
              >
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-mono font-bold text-radar-accent px-1.5 py-0.5 bg-radar-accent/10 rounded uppercase">
                        {report.category}
                      </span>
                      <h3 className="font-bold text-white group-hover:text-radar-accent transition-colors">{report.title}</h3>
                   </div>
                   <p className="text-sm text-gray-400 truncate max-w-2xl">{report.description}</p>
                   <div className="mt-2 text-xs font-mono text-gray-600 flex gap-4">
                      <span>ID: {report.id}</span>
                      <span>DATE: {new Date(report.uploadDate).toLocaleDateString()}</span>
                   </div>
                </div>
                <button
                  onClick={(e) => handleDelete(report.id, e)}
                  className="ml-4 p-3 rounded-full hover:bg-red-500/20 text-gray-600 hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;