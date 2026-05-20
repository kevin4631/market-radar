<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Market Radar

Plateforme de veille hebdomadaire : publication de PDFs thématiques pour étudiants Ynov, avec admin protégé et newsletter.

View your app in AI Studio: https://ai.studio/apps/drive/13EMxewOn47kFJAZbGXxZh0KbPGC6WEUZ

---

## Lancement local

**Prérequis :** Node.js 20+

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Configurer `.env.local` (voir [variables d'environnement](#variables-denvironnement) ci-dessous).
3. Lancer le serveur de dev :
   ```bash
   npm run dev
   ```

---

## Variables d'environnement

Crée un fichier `.env.local` à la racine avec :

```env
# Supabase (récupéré dans Project Settings > API)
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi...

# Gemini (pour la synthèse IA des rapports)
GEMINI_API_KEY=...
```

---

## Base de données Supabase

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Va dans **SQL Editor** et exécute le contenu de [`supabase-schema.sql`](./supabase-schema.sql).
3. Dans **Authentication > Users**, crée ton compte admin (email/mot de passe) — c'est ce compte qui pourra se connecter sur `/admin`.

---

## Newsletter — Configuration

La newsletter utilise **[MailerSend](https://mailersend.com)** + **Supabase Edge Functions** pour l'envoi d'emails.

### 1. Créer un compte MailerSend

1. Inscription gratuite sur [mailersend.com](https://mailersend.com) (3000 mails/mois en trial).
2. Va dans **Domains** : MailerSend te fournit automatiquement un **trial domain** (`test-XXXXX.mlsender.net`). Tu peux l'utiliser pour les tests. Pour la prod, vérifie ton propre domaine.
3. Va dans **API Tokens** et crée un nouveau token (avec permission `Email -> Send`).

> ⚠️ Le trial domain limite l'envoi à l'adresse email administrateur du compte MailerSend. Pour tester, abonne-toi avec **le même email que ton compte MailerSend**.

### 2. Configurer les secrets Supabase

Installe [Supabase CLI](https://supabase.com/docs/guides/cli) puis :

```bash
supabase login
supabase link --project-ref <ton-project-ref>

# Secrets pour les Edge Functions
supabase secrets set MAILERSEND_API_TOKEN=mlsn.xxx
supabase secrets set NEWSLETTER_FROM="Market Radar <signal@test-XXXXX.mlsender.net>"
supabase secrets set PUBLIC_SITE_URL=https://ton-site.com
```

> `SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` sont automatiquement disponibles dans les Edge Functions, pas besoin de les définir manuellement.
>
> `PUBLIC_SITE_URL` est utilisé pour rediriger après la désinscription. En dev local : `http://localhost:5173`. En prod : ton vrai domaine.

### 3. Déployer les Edge Functions

```bash
supabase functions deploy subscribe
supabase functions deploy send-newsletter
supabase functions deploy unsubscribe
```

### 4. Tester

- Va sur la home → section "Signal direct" → inscris-toi avec un email valide.
- Vérifie ta boîte (et les spams) pour le mail de bienvenue.
- Connecte-toi sur `/admin` → tu vois ton inscription dans le panneau **Abonnés Newsletter**.
- Publie un PDF → bouton **Notifier** sur le rapport envoie un mail à tous les abonnés.

---

## Architecture

```
market-radar/
├── App.tsx                    # Routes : / , /admin , /privacy , /unsubscribed
├── pages/
│   ├── Home.tsx               # Page publique + section newsletter
│   ├── Admin.tsx              # Dashboard (PDFs, catégories, abonnés)
│   ├── Privacy.tsx            # Politique RGPD
│   └── Unsubscribed.tsx       # Page de confirmation après désinscription
├── components/
│   ├── NavBar.tsx
│   ├── Background.tsx
│   ├── PDFCard.tsx
│   ├── NewsletterSection.tsx  # Formulaire d'inscription Home
│   └── NewsletterPopup.tsx    # Mini bandeau bas-droite (8s)
├── services/
│   ├── supabase.ts            # Client Supabase
│   ├── storage.ts             # CRUD PDFs + catégories
│   ├── newsletter.ts          # Inscription, liste, notify
│   └── gemini.ts              # Synthèse IA
└── supabase/
    ├── config.toml            # Config JWT par fonction
    └── functions/
        ├── _shared/
        │   ├── cors.ts
        │   └── email.ts       # MailerSend API + templates HTML
        ├── subscribe/         # Inscription + mail bienvenue
        ├── send-newsletter/   # Envoi notification (admin only)
        └── unsubscribe/       # Désinscription → redirige vers /unsubscribed
```

---

## Conformité RGPD

- ✅ Consentement explicite via case à cocher avant inscription
- ✅ Lien vers la politique de confidentialité (`/privacy`)
- ✅ Désinscription en un clic (lien dans chaque mail)
- ✅ Données stockées en UE (Supabase région EU)
- ✅ Droit à l'effacement immédiat
- ⚠️ **À personnaliser** : adresse de contact dans `pages/Privacy.tsx` (actuellement `contact@marketradar.local`)
