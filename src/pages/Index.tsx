import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppLayout from "@/components/AppLayout";
import PresentationCard from "@/components/PresentationCard";
import PresentationListItem from "@/components/PresentationListItem";
import TagPill from "@/components/TagPill";
import { usePresentations } from "@/hooks/usePresentations";
import { usePopularTags } from "@/hooks/useTags";
import type { DBTag } from "@/lib/database.types";
import { motion } from "framer-motion";

const TEAMS = ["Sales", "Product", "Marketing", "HR"];
const LANGUAGES = ["FR", "EN", "ES"];

export default function Index() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<DBTag[]>([]);
  const [teamFilter, setTeamFilter] = useState<string>("");
  const [langFilter, setLangFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const tagIds = useMemo(
    () => (selectedTags.length > 0 ? selectedTags.map((t) => t.id) : undefined),
    [selectedTags]
  );

  const { data: presentations, loading } = usePresentations({
    search: search || undefined,
    team: teamFilter || undefined,
    language: langFilter || undefined,
    tagIds,
  });

  const { tags: popularTags } = usePopularTags();

  const toggleTag = (tag: DBTag) => {
    setSelectedTags((prev) =>
      prev.find((t) => t.id === tag.id)
        ? prev.filter((t) => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const hasFilters = selectedTags.length > 0 || teamFilter || langFilter;

  const clearAll = () => {
    setSearch("");
    setSelectedTags([]);
    setTeamFilter("");
    setLangFilter("");
  };

  return (
    <AppLayout>
      <div className="container py-8 space-y-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Trouvez la bonne slide,{" "}
            <span className="text-primary">en quelques secondes</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Toutes les présentations Partoo centralisées. Recherchez, prévisualisez et partagez vos slides facilement.
          </p>
        </motion.div>

        {/* Search */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre, tag, auteur…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-12 h-12 text-base rounded-xl bg-card border shadow-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              onClick={() => setShowFilters(!showFilters)}
              title="Filtres"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap gap-3"
            >
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Équipe" />
                </SelectTrigger>
                <SelectContent>
                  {TEAMS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={langFilter} onValueChange={setLangFilter}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="Langue" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1 text-destructive">
                  <X className="w-3 h-3" /> Réinitialiser
                </Button>
              )}
            </motion.div>
          )}

          {/* Popular Tags */}
          {popularTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Tags populaires :</span>
              {popularTags.map((tag) => (
                <TagPill
                  key={tag.id}
                  tag={tag}
                  onClick={toggleTag}
                  isSelected={selectedTags.some((t) => t.id === tag.id)}
                />
              ))}
            </div>
          )}

          {/* Active tag filters */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-primary">Filtres actifs :</span>
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  className="tag-pill-blue cursor-pointer flex items-center gap-1"
                  onClick={() => toggleTag(tag)}
                >
                  #{tag.label} <X className="w-3 h-3" />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {loading ? "Chargement…" : `${presentations.length} présentation${presentations.length !== 1 ? "s" : ""}`}
            </p>
            <div className="flex items-center gap-1 border rounded-lg p-0.5">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-7 w-7"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {presentations.map((p, i) => (
                <PresentationCard key={p.id} presentation={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {presentations.map((p, i) => (
                <PresentationListItem key={p.id} presentation={p} index={i} />
              ))}
            </div>
          )}

          {!loading && presentations.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-display">Aucun résultat</p>
              <p className="text-sm mt-1">Essayez d'autres mots-clés ou tags</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
