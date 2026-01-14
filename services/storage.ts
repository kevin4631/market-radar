import { MarketReport, DEFAULT_CATEGORIES } from '../types';

const REPORTS_KEY = 'market_radar_reports';
const CATEGORIES_KEY = 'market_radar_categories';

// --- REPORTS ---

export const getReports = (): MarketReport[] => {
  try {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load reports", e);
    return [];
  }
};

export const saveReport = (report: MarketReport): void => {
  const reports = getReports();
  // Check if update or create
  const index = reports.findIndex(r => r.id === report.id);
  
  if (index >= 0) {
    // Update existing
    reports[index] = report;
  } else {
    // Create new
    reports.unshift(report);
  }
  
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
};

export const deleteReport = (id: string): void => {
  const reports = getReports();
  const filtered = reports.filter(r => r.id !== id);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(filtered));
};

// --- CATEGORIES ---

export const getCategories = (): string[] => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  } catch (e) {
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategory = (category: string): void => {
  const categories = getCategories();
  if (!categories.includes(category)) {
    categories.push(category);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }
};

export const deleteCategory = (category: string): void => {
  let categories = getCategories();
  categories = categories.filter(c => c !== category);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

// Seed some initial data if empty
export const seedInitialData = () => {
  // Seed Reports
  if (getReports().length === 0) {
    const mockReports: MarketReport[] = [
      {
        id: '1',
        title: 'Recap Tech Hebdo #42',
        description: 'Analyse des sorties IA de la semaine, impact sur le développement web et nouvelles stacks émergentes.',
        category: 'Tech',
        uploadDate: new Date().toISOString(),
        fileData: null,
        aiSummary: 'Focus sur les LLMs locaux et frameworks JS.'
      },
      {
        id: '2',
        title: 'Tendances Design UI 2024',
        description: 'Pourquoi le Bento Grid domine tout et comment l\'intégrer dans vos projets étudiants.',
        category: 'Design',
        uploadDate: new Date(Date.now() - 86400000).toISOString(),
        fileData: null,
        aiSummary: 'Minimalisme fonctionnel et grilles modulaires.'
      }
    ];
    localStorage.setItem(REPORTS_KEY, JSON.stringify(mockReports));
  }

  // Seed Categories if not exist
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  }
};