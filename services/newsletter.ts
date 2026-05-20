import { supabase } from './supabase';
import { MarketReport, Subscriber } from '../types';

const FUNCTIONS_BASE = `${process.env.SUPABASE_URL}/functions/v1`;
const ANON_KEY = process.env.SUPABASE_ANON_KEY!;

// --- PUBLIC : INSCRIPTION ---

export const subscribeToNewsletter = async (email: string): Promise<void> => {
  const res = await fetch(`${FUNCTIONS_BASE}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Inscription impossible. Réessaie plus tard.');
  }
};

// --- ADMIN : LISTE / SUPPRESSION ---

export const getSubscribers = async (): Promise<Subscriber[]> => {
  const { data, error } = await supabase
    .from('subscribers')
    .select('id, email, subscribed_at')
    .order('subscribed_at', { ascending: false });

  if (error) {
    console.error('Failed to load subscribers', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    email: row.email,
    subscribedAt: row.subscribed_at,
  }));
};

export const deleteSubscriber = async (id: string): Promise<void> => {
  const { error } = await supabase.from('subscribers').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete subscriber', error);
    throw error;
  }
};

// --- ADMIN : ENVOI NEWSLETTER ---

export const notifySubscribers = async (report: MarketReport): Promise<{ sent: number }> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Session admin requise.');

  const res = await fetch(`${FUNCTIONS_BASE}/send-newsletter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      reportId: report.id,
      title: report.title,
      description: report.description,
      category: report.category,
      fileUrl: report.fileUrl,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Échec de l'envoi de la newsletter.");
  }

  return res.json();
};
