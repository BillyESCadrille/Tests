import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { DBTag } from "@/lib/database.types";

/** Returns the 8 most-used tags (by presentation_tags count) */
export function usePopularTags(limit = 8) {
  const [tags, setTags] = useState<DBTag[]>([]);

  useEffect(() => {
    supabase
      .from("tags")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(limit)
      .then(({ data }) => setTags(data ?? []));
  }, [limit]);

  return { tags };
}

export function useAllTags() {
  const [tags, setTags] = useState<DBTag[]>([]);

  useEffect(() => {
    supabase
      .from("tags")
      .select("*")
      .order("label")
      .then(({ data }) => setTags(data ?? []));
  }, []);

  return { tags };
}
