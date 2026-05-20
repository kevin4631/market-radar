// Shared email helpers (MailerSend API + HTML templates)

const MAILERSEND_ENDPOINT = 'https://api.mailersend.com/v1/email';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  apiKey: string;
  // Accept "Name <email@domain>" or just "email@domain"
  from: string;
}

export async function sendEmail({ to, subject, html, apiKey, from }: SendEmailParams) {
  // Parse "Name <email>" format into MailerSend's object format
  const fromMatch = from.match(/^(.+?)\s*<(.+)>$/);
  const fromObj = fromMatch
    ? { name: fromMatch[1].trim(), email: fromMatch[2].trim() }
    : { email: from.trim() };

  const res = await fetch(MAILERSEND_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    body: JSON.stringify({
      from: fromObj,
      to: [{ email: to }],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`MailerSend error ${res.status}: ${body}`);
  }

  // MailerSend retourne 202 Accepted (corps vide) quand l'email est mis en file d'attente
  if (res.status === 202) return { queued: true };
  return res.json().catch(() => ({ queued: true }));
}

// --- TEMPLATES ---

export function welcomeTemplate(unsubscribeUrl: string) {
  return `
  <!DOCTYPE html>
  <html lang="fr">
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#fff;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111111;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
              <tr>
                <td style="padding:48px 40px 32px;text-align:center;border-bottom:1px solid #1f1f1f;">
                  <div style="display:inline-block;width:48px;height:48px;background:#ff3131;border-radius:50%;margin-bottom:16px;"></div>
                  <h1 style="margin:0;font-size:28px;color:#fff;font-weight:700;letter-spacing:-0.5px;">
                    MARKET<span style="color:#ff3131;font-weight:300;">RADAR</span>
                  </h1>
                  <p style="margin:8px 0 0;font-size:11px;color:#888;letter-spacing:3px;text-transform:uppercase;">Signal connecté</p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;color:#d4d4d4;font-size:15px;line-height:1.6;">
                  <h2 style="margin:0 0 16px;color:#fff;font-size:22px;">Bienvenue sur Market Radar.</h2>
                  <p style="margin:0 0 16px;">Ton inscription est confirmée. À chaque nouvelle publication, tu recevras un mail avec un lien direct vers le PDF.</p>
                  <p style="margin:0 0 24px;">Pas de spam, pas de pub, juste le signal.</p>
                  <div style="text-align:center;margin:32px 0;">
                    <a href="${unsubscribeUrl.replace(/\/unsubscribe.*$/, '')}" style="display:inline-block;padding:14px 32px;background:#ff3131;color:#000;text-decoration:none;font-weight:700;border-radius:999px;text-transform:uppercase;letter-spacing:1px;font-size:13px;">Explorer le flux</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px;background:#0a0a0a;border-top:1px solid #1f1f1f;text-align:center;font-size:11px;color:#666;line-height:1.6;">
                  <p style="margin:0 0 8px;">Tu reçois ce mail car tu t'es inscrit sur marketradar.</p>
                  <p style="margin:0;">
                    <a href="${unsubscribeUrl}" style="color:#888;text-decoration:underline;">Se désinscrire</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

export function newsletterTemplate(params: {
  title: string;
  description: string;
  category: string;
  fileUrl: string | null;
  unsubscribeUrl: string;
}) {
  const { title, description, category, fileUrl, unsubscribeUrl } = params;
  return `
  <!DOCTYPE html>
  <html lang="fr">
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;color:#fff;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#111111;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
              <tr>
                <td style="padding:32px 40px 24px;border-bottom:1px solid #1f1f1f;">
                  <table width="100%"><tr>
                    <td style="font-size:11px;letter-spacing:3px;color:#ff3131;text-transform:uppercase;">// Nouveau signal</td>
                    <td align="right" style="font-size:11px;letter-spacing:2px;color:#888;text-transform:uppercase;">${escapeHtml(category)}</td>
                  </tr></table>
                </td>
              </tr>
              <tr>
                <td style="padding:32px 40px;">
                  <h2 style="margin:0 0 16px;color:#fff;font-size:26px;font-weight:700;line-height:1.3;letter-spacing:-0.5px;">${escapeHtml(title)}</h2>
                  <p style="margin:0 0 32px;color:#a0a0a0;font-size:15px;line-height:1.6;">${escapeHtml(description)}</p>
                  ${fileUrl ? `
                  <div style="text-align:center;margin:32px 0;">
                    <a href="${fileUrl}" style="display:inline-block;padding:14px 32px;background:#ff3131;color:#000;text-decoration:none;font-weight:700;border-radius:999px;text-transform:uppercase;letter-spacing:1px;font-size:13px;">Ouvrir le PDF</a>
                  </div>
                  ` : ''}
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px;background:#0a0a0a;border-top:1px solid #1f1f1f;text-align:center;font-size:11px;color:#666;line-height:1.6;">
                  <p style="margin:0 0 8px;">Tu reçois ce mail car tu es abonné à Market Radar.</p>
                  <p style="margin:0;">
                    <a href="${unsubscribeUrl}" style="color:#888;text-decoration:underline;">Se désinscrire</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
