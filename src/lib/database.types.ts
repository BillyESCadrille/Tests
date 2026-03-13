// Auto-generated types matching the Supabase schema.
// Re-generate with: npx supabase gen types typescript --project-id YOUR_ID > src/lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          role: "user" | "admin";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      presentations: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          uploaded_by: string;
          team: string | null;
          language: string | null;
          file_url: string;
          thumbnail_url: string | null;
          slide_count: number;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["presentations"]["Row"],
          "id" | "views" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["presentations"]["Insert"]>;
      };
      slides: {
        Row: {
          id: string;
          presentation_id: string;
          slide_index: number;
          thumbnail_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["slides"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["slides"]["Insert"]>;
      };
      tags: {
        Row: {
          id: string;
          label: string;
          category: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tags"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["tags"]["Insert"]>;
      };
      presentation_tags: {
        Row: { presentation_id: string; tag_id: string };
        Insert: Database["public"]["Tables"]["presentation_tags"]["Row"];
        Update: Partial<Database["public"]["Tables"]["presentation_tags"]["Insert"]>;
      };
      slide_tags: {
        Row: { slide_id: string; tag_id: string };
        Insert: Database["public"]["Tables"]["slide_tags"]["Row"];
        Update: Partial<Database["public"]["Tables"]["slide_tags"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ─── Convenience row types ────────────────────────────────────────────────────
export type DBPresentation = Database["public"]["Tables"]["presentations"]["Row"];
export type DBSlide = Database["public"]["Tables"]["slides"]["Row"];
export type DBTag = Database["public"]["Tables"]["tags"]["Row"];
export type DBUser = Database["public"]["Tables"]["users"]["Row"];
