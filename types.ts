export interface MarketReport {
  id: string;
  title: string;
  description: string;
  category: string; // Changed from rigid Enum to string to allow dynamic categories
  uploadDate: string;
  fileData: string | null; // Base64 data URI for demo purposes
  aiSummary?: string;
}

// Default categories for seeding
export const DEFAULT_CATEGORIES = ['Tech', 'Marketing', 'Design', 'Business'];