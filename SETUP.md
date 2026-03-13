# SlideBase — Guide de mise en ligne

## Stack
- **Frontend** : React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend / Auth / DB / Storage** : Supabase
- **Déploiement** : Vercel

---

## 1. Supabase — Créer le projet

1. Aller sur [supabase.com](https://supabase.com) → New project
2. Choisir une région EU (RGPD)
3. Dans **SQL Editor**, coller et exécuter le contenu de `supabase/migrations/001_init.sql`
4. Dans **Authentication → Providers → Google**, activer Google OAuth :
   - Créer un projet sur [console.cloud.google.com](https://console.cloud.google.com)
   - Activer l'API "Google Identity" et créer des identifiants OAuth 2.0
   - Redirect URI : `https://<votre-projet>.supabase.co/auth/v1/callback`
   - Copier Client ID et Client Secret dans Supabase
5. Dans **Authentication → URL Configuration** :
   - Site URL : `https://votre-domaine.vercel.app`
   - Redirect URLs : `https://votre-domaine.vercel.app/auth/callback`
6. Dans **Storage**, créer un bucket nommé `presentations` (public)
   - Ajouter une policy : authenticated users can upload, public can read

---

## 2. Variables d'environnement

Copier `.env.example` en `.env.local` :

```bash
cp .env.example .env.local
```

Remplir avec les valeurs depuis **Supabase → Settings → API** :
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...
```

---

## 3. Développement local

```bash
npm install
npm run dev
```

---

## 4. Déploiement sur Vercel

```bash
# Option A — via CLI
npm i -g vercel
vercel

# Option B — via GitHub
# 1. Pusher le repo sur GitHub
# 2. Importer le projet sur vercel.com
# 3. Ajouter les variables d'environnement dans Vercel → Settings → Environment Variables
```

Framework preset : **Vite**
Build command : `npm run build`
Output directory : `dist`

---

## 5. Génération des thumbnails (optionnel, phase 2)

La conversion .pptx → images de slides nécessite un serveur avec LibreOffice.
Options recommandées :
- **Vercel Function** avec [unoserver](https://github.com/unoconv/unoserver) (via Docker)
- **Service externe** : [CloudConvert API](https://cloudconvert.com) ou [Aspose](https://products.aspose.app)

La fonction `/api/generate-thumbnail` peut être ajoutée dans `api/generate-thumbnail.js` (Vercel Serverless Functions).

---

## Structure du projet

```
src/
├── App.tsx                  # Routing + Auth provider
├── context/AuthContext.tsx  # Session Supabase
├── hooks/
│   ├── usePresentations.ts  # CRUD présentations
│   └── useTags.ts           # Tags
├── lib/
│   ├── supabase.ts          # Client Supabase
│   ├── auth.ts              # Google OAuth helpers
│   └── database.types.ts    # Types TypeScript générés
├── pages/
│   ├── Index.tsx            # Recherche + liste
│   ├── UploadPage.tsx       # Upload + métadonnées
│   ├── PresentationDetail.tsx # Viewer + partage
│   ├── LoginPage.tsx        # Connexion Google
│   └── AuthCallback.tsx     # Callback OAuth
└── components/
    ├── AppLayout.tsx
    ├── PresentationCard.tsx
    ├── PresentationListItem.tsx
    ├── TagPill.tsx
    └── ui/                  # shadcn/ui components
supabase/
└── migrations/001_init.sql  # Schéma DB + RLS
```
