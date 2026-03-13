// ─── Types ────────────────────────────────────────────────────────────────────

export type Tag = {
  id: string;
  label: string;
  color?: string;
};

export type Uploader = {
  id: string;
  name: string;
  avatar?: string;
};

export type Presentation = {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  team: string;
  language: string;
  uploadedBy: Uploader;
  thumbnail?: string;
  fileUrl?: string;
  slideCount: number;
  views: number;
  createdAt: string;
};

// ─── Seed data ────────────────────────────────────────────────────────────────

export const POPULAR_TAGS: Tag[] = [
  { id: "t1", label: "Product", color: "blue" },
  { id: "t2", label: "Sales", color: "green" },
  { id: "t3", label: "Onboarding", color: "purple" },
  { id: "t4", label: "Demo", color: "orange" },
  { id: "t5", label: "Roadmap", color: "pink" },
  { id: "t6", label: "Investisseurs", color: "yellow" },
];

export const PRESENTATIONS: Presentation[] = [
  {
    id: "p1",
    title: "Pitch Deck Q1 2025",
    description:
      "Présentation investisseurs pour le tour de financement Serie B. Couvre la vision produit, les métriques clés et le plan de croissance.",
    tags: [POPULAR_TAGS[5], POPULAR_TAGS[1]],
    team: "Sales",
    language: "FR",
    uploadedBy: { id: "u1", name: "Alice Martin", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Alice" },
    thumbnail: "https://placehold.co/640x360/3B82F6/ffffff?text=Pitch+Deck",
    slideCount: 22,
    views: 348,
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "p2",
    title: "Product Roadmap 2025",
    description:
      "Vue complète des fonctionnalités prévues pour 2025 : nouvelles intégrations, refonte UX et expansion internationale.",
    tags: [POPULAR_TAGS[0], POPULAR_TAGS[4]],
    team: "Product",
    language: "EN",
    uploadedBy: { id: "u2", name: "Thomas Dupont", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Thomas" },
    thumbnail: "https://placehold.co/640x360/8B5CF6/ffffff?text=Roadmap",
    slideCount: 35,
    views: 521,
    createdAt: "2025-02-03T09:00:00Z",
  },
  {
    id: "p3",
    title: "Demo Produit — Gestion de fiches",
    description:
      "Support de démonstration pour les appels commerciaux. Montre le flux complet de gestion des fiches établissements.",
    tags: [POPULAR_TAGS[3], POPULAR_TAGS[1]],
    team: "Sales",
    language: "FR",
    uploadedBy: { id: "u3", name: "Léa Rousseau", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Lea" },
    thumbnail: "https://placehold.co/640x360/10B981/ffffff?text=Demo",
    slideCount: 18,
    views: 892,
    createdAt: "2025-01-28T14:00:00Z",
  },
  {
    id: "p4",
    title: "Onboarding Nouveaux Arrivants",
    description:
      "Kit de bienvenue pour les nouvelles recrues : culture d'entreprise, outils, processus et organigramme.",
    tags: [POPULAR_TAGS[2]],
    team: "HR",
    language: "FR",
    uploadedBy: { id: "u4", name: "Sophie Bernard", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Sophie" },
    thumbnail: "https://placehold.co/640x360/F59E0B/ffffff?text=Onboarding",
    slideCount: 40,
    views: 203,
    createdAt: "2025-03-01T08:00:00Z",
  },
  {
    id: "p5",
    title: "Sales Playbook — Enterprise",
    description:
      "Guide complet pour les cycles de vente enterprise : objections, pricing, ROI calculator et success stories.",
    tags: [POPULAR_TAGS[1], POPULAR_TAGS[3]],
    team: "Sales",
    language: "EN",
    uploadedBy: { id: "u1", name: "Alice Martin", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Alice" },
    thumbnail: "https://placehold.co/640x360/EF4444/ffffff?text=Playbook",
    slideCount: 55,
    views: 674,
    createdAt: "2025-02-18T11:00:00Z",
  },
  {
    id: "p6",
    title: "Marketing Strategy 2025",
    description:
      "Stratégie marketing annuelle : brand awareness, SEO, campagnes payantes et partenariats.",
    tags: [POPULAR_TAGS[4]],
    team: "Marketing",
    language: "FR",
    uploadedBy: { id: "u5", name: "Julien Moreau", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Julien" },
    thumbnail: "https://placehold.co/640x360/EC4899/ffffff?text=Marketing",
    slideCount: 28,
    views: 310,
    createdAt: "2025-01-10T16:00:00Z",
  },
  {
    id: "p7",
    title: "Product Vision — IA & Automatisation",
    description:
      "Exploration des opportunités IA pour le produit : génération de contenu, scoring automatique et personnalisation.",
    tags: [POPULAR_TAGS[0], POPULAR_TAGS[4]],
    team: "Product",
    language: "FR",
    uploadedBy: { id: "u2", name: "Thomas Dupont", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Thomas" },
    thumbnail: "https://placehold.co/640x360/6366F1/ffffff?text=IA+Vision",
    slideCount: 20,
    views: 456,
    createdAt: "2025-03-05T10:00:00Z",
  },
  {
    id: "p8",
    title: "Demo Produit ES — Gestión de fichas",
    description:
      "Presentación de demostración para el mercado español. Flujo completo de gestión de fichas de establecimientos.",
    tags: [POPULAR_TAGS[3], POPULAR_TAGS[1]],
    team: "Sales",
    language: "ES",
    uploadedBy: { id: "u3", name: "Léa Rousseau", avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Lea" },
    thumbnail: "https://placehold.co/640x360/0EA5E9/ffffff?text=Demo+ES",
    slideCount: 18,
    views: 127,
    createdAt: "2025-02-25T15:00:00Z",
  },
];
