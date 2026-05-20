// supabase/functions/send-newsletter
// Envoi d'une notification à tous les abonnés pour un rapport donné.
// Endpoint protégé : nécessite un token utilisateur authentifié (admin connecté).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { sendEmail, newsletterTemplate } from '../_shared/email.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Vérifier que l'appelant est authentifié
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Non authentifié.' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const mailKey = Deno.env.get('MAILERSEND_API_TOKEN')!;
    const fromEmail = Deno.env.get('NEWSLETTER_FROM')!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await userClient.auth.getUser();
    if (userError || !userData?.user) {
      return json({ error: 'Session invalide.' }, 401);
    }

    // 2. Lire le payload
    const { title, description, category, fileUrl } = await req.json();
    if (!title || !description) {
      return json({ error: 'Payload incomplet.' }, 400);
    }

    // 3. Récupérer les abonnés
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: subs, error: subsError } = await admin
      .from('subscribers')
      .select('email, unsubscribe_token');

    if (subsError) {
      console.error('Fetch subscribers error', subsError);
      return json({ error: 'Impossible de récupérer les abonnés.' }, 500);
    }

    if (!subs || subs.length === 0) {
      return json({ sent: 0 });
    }

    // 4. Envoi à chaque abonné (séquentiel pour rester sous le rate-limit Resend gratuit)
    let sent = 0;
    for (const sub of subs) {
      const unsubscribeUrl = `${supabaseUrl}/functions/v1/unsubscribe?token=${sub.unsubscribe_token}`;
      try {
        await sendEmail({
          to: sub.email,
          subject: `[Market Radar] ${title}`,
          html: newsletterTemplate({ title, description, category, fileUrl, unsubscribeUrl }),
          apiKey: mailKey,
          from: fromEmail,
        });
        sent++;
      } catch (err) {
        console.error(`Failed to send to ${sub.email}`, err);
      }
    }

    return json({ sent });
  } catch (err) {
    console.error('send-newsletter error', err);
    return json({ error: 'Erreur serveur.' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
