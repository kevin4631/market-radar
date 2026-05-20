// supabase/functions/unsubscribe
// Endpoint GET public appelé depuis le lien de désinscription dans les mails.
// Vérifie le token, supprime l'abonné, puis redirige vers la page /unsubscribed
// du site React (qui affiche la confirmation avec le bon style).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const siteUrl = Deno.env.get('PUBLIC_SITE_URL') || 'http://localhost:5173';

  let status = 'ok';
  let email = '';

  if (!token || !/^[a-f0-9]{32}$/.test(token)) {
    status = 'invalid';
  } else {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { data, error } = await admin
      .from('subscribers')
      .delete()
      .eq('unsubscribe_token', token)
      .select('email');

    if (error) {
      console.error('Unsubscribe error', error);
      status = 'error';
    } else if (!data || data.length === 0) {
      status = 'already';
    } else {
      email = data[0].email;
    }
  }

  const params = new URLSearchParams({ status });
  if (email) params.set('email', email);

  // HashRouter → query params placés dans le hash
  const redirectUrl = `${siteUrl}/#/unsubscribed?${params.toString()}`;

  return new Response(null, {
    status: 302,
    headers: { Location: redirectUrl },
  });
});
