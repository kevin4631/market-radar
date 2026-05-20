// supabase/functions/subscribe
// Insère un nouvel abonné et envoie le mail de bienvenue.
// Endpoint public (appelé depuis le formulaire newsletter).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { sendEmail, welcomeTemplate } from '../_shared/email.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return json({ error: 'Adresse email invalide.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const mailKey = Deno.env.get('MAILERSEND_API_TOKEN')!;
    const fromEmail = Deno.env.get('NEWSLETTER_FROM')!;
    const publicSiteUrl = Deno.env.get('PUBLIC_SITE_URL') || 'http://localhost:5173';

    const admin = createClient(supabaseUrl, serviceKey);

    // Insertion (le token unsubscribe est généré par la DB)
    const { data, error } = await admin
      .from('subscribers')
      .insert({ email: cleanEmail })
      .select('unsubscribe_token')
      .single();

    if (error) {
      if (error.code === '23505') {
        return json({ error: 'Cet email est déjà inscrit.' }, 409);
      }
      console.error('Insert error', error);
      return json({ error: 'Inscription impossible.' }, 500);
    }

    const unsubscribeUrl = `${supabaseUrl}/functions/v1/unsubscribe?token=${data.unsubscribe_token}`;

    // Envoi du mail de bienvenue
    try {
      await sendEmail({
        to: cleanEmail,
        subject: 'Bienvenue sur Market Radar',
        html: welcomeTemplate(unsubscribeUrl),
        apiKey: mailKey,
        from: fromEmail,
      });
    } catch (mailErr) {
      // L'inscription est faite, on log juste l'échec d'envoi
      console.error('Welcome email failed', mailErr);
    }

    return json({ ok: true });
  } catch (err) {
    console.error('subscribe error', err);
    return json({ error: 'Erreur serveur.' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
