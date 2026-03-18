import { supabase } from './supabase';
import { MarketReport, DEFAULT_CATEGORIES } from '../types';

// --- REPORTS ---

export const getReports = async (): Promise<MarketReport[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Failed to load reports', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    uploadDate: row.upload_date,
    fileUrl: row.file_url,
    aiSummary: row.ai_summary,
  }));
};

export const saveReport = async (report: MarketReport, file?: File): Promise<void> => {
  let fileUrl = report.fileUrl;

  // Upload PDF to storage if a new file is provided
  if (file) {
    const filePath = `${report.id}/${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(filePath, file, { contentType: 'application/pdf', upsert: true });

    if (uploadError) {
      console.error('Failed to upload PDF', uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage.from('pdfs').getPublicUrl(filePath);
    fileUrl = urlData.publicUrl;
  }

  const row = {
    id: report.id,
    title: report.title,
    description: report.description,
    category: report.category,
    upload_date: report.uploadDate,
    file_url: fileUrl,
    ai_summary: report.aiSummary ?? null,
  };

  const { error } = await supabase
    .from('reports')
    .upsert(row, { onConflict: 'id' });

  if (error) {
    console.error('Failed to save report', error);
    throw error;
  }
};

export const deleteReport = async (id: string): Promise<void> => {
  // Delete associated files from storage
  const { data: files } = await supabase.storage.from('pdfs').list(id);
  if (files && files.length > 0) {
    const paths = files.map(f => `${id}/${f.name}`);
    await supabase.storage.from('pdfs').remove(paths);
  }

  const { error } = await supabase.from('reports').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete report', error);
    throw error;
  }
};

// --- CATEGORIES ---

export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('name');

  if (error) {
    console.error('Failed to load categories', error);
    return DEFAULT_CATEGORIES;
  }

  return data.length > 0 ? data.map(row => row.name) : DEFAULT_CATEGORIES;
};

export const saveCategory = async (category: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .insert({ name: category });

  if (error && error.code !== '23505') { // ignore unique violation
    console.error('Failed to save category', error);
    throw error;
  }
};

export const deleteCategory = async (category: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('name', category);

  if (error) {
    console.error('Failed to delete category', error);
    throw error;
  }
};

// Seed initial data if tables are empty
export const seedInitialData = async (): Promise<void> => {
  // Seed categories
  const { data: existingCats } = await supabase.from('categories').select('name').limit(1);
  if (!existingCats || existingCats.length === 0) {
    const rows = DEFAULT_CATEGORIES.map(name => ({ name }));
    await supabase.from('categories').insert(rows);
  }
};
