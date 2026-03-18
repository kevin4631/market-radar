export interface MarketReport {
  id: string;
  title: string;
  description: string;
  category: string;
  uploadDate: string;
  fileUrl: string | null;
  aiSummary?: string;
}

export const DEFAULT_CATEGORIES = ['Tech', 'Marketing', 'Design', 'Business'];