import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { DBPresentation, DBTag } from "@/lib/database.types";

export type PresentationWithTags = DBPresentation & { tags: DBTag[] };

type Filters = {
  search?: string;
  team?: string;
  language?: string;
  tagIds?: string[];
};

export function usePresentations(filters: Filters = {}) {
  const [data, setData] = useState<PresentationWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        let query = supabase
          .from("presentations")
          .select(`*, tags:presentation_tags(tag:tags(*))`)
          .order("created_at", { ascending: false });

        if (filters.team) query = query.eq("team", filters.team);
        if (filters.language) query = query.eq("language", filters.language);
        if (filters.search) {
          const q = `%${filters.search}%`;
          query = query.or(`title.ilike.${q},description.ilike.${q}`);
        }

        const { data: rows, error: err } = await query;
        if (err) throw err;

        const presentations = (rows ?? []).map((row: any) => ({
          ...row,
          tags: (row.tags ?? []).map((pt: any) => pt.tag).filter(Boolean),
        })) as PresentationWithTags[];

        // Client-side tag filter (AND logic — every selected tag must match)
        const filtered =
          filters.tagIds && filters.tagIds.length > 0
            ? presentations.filter((p) =>
                filters.tagIds!.every((tid) => p.tags.some((t) => t.id === tid))
              )
            : presentations;

        if (!cancelled) {
          setData(filtered);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.team, filters.language, filters.tagIds?.join(",")]);

  return { data, loading, error };
}

export function usePresentation(id: string) {
  const [data, setData] = useState<PresentationWithTags | null>(null);
  const [slides, setSlides] = useState<
    { id: string; slide_index: number; thumbnail_url: string | null; tags: DBTag[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [presResult, slidesResult] = await Promise.all([
          supabase
            .from("presentations")
            .select(`*, tags:presentation_tags(tag:tags(*))`)
            .eq("id", id)
            .single(),
          supabase
            .from("slides")
            .select(`*, tags:slide_tags(tag:tags(*))`)
            .eq("presentation_id", id)
            .order("slide_index"),
        ]);

        if (presResult.error) throw presResult.error;

        const pres = {
          ...presResult.data,
          tags: (presResult.data?.tags ?? []).map((pt: any) => pt.tag).filter(Boolean),
        } as PresentationWithTags;

        const slideRows = (slidesResult.data ?? []).map((s: any) => ({
          ...s,
          tags: (s.tags ?? []).map((st: any) => st.tag).filter(Boolean),
        }));

        // Increment view counter (fire and forget)
        supabase
          .from("presentations")
          .update({ views: (pres.views ?? 0) + 1 })
          .eq("id", id)
          .then(() => {});

        if (!cancelled) {
          setData(pres);
          setSlides(slideRows);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  return { data, slides, loading, error };
}

export async function deletePresentation(id: string) {
  const { error } = await supabase.from("presentations").delete().eq("id", id);
  if (error) throw error;
}
