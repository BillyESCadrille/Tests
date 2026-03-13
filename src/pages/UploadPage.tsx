import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, FilePresentation, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAllTags } from "@/hooks/useTags";

const TEAMS = ["Sales", "Product", "Marketing", "HR"];
const LANGUAGES = ["FR", "EN", "ES"];

// Placeholder user id used while auth is disabled
const ANON_USER_ID = "00000000-0000-0000-0000-000000000000";

export default function UploadPage() {
  const navigate = useNavigate();
  const { tags: allTags } = useAllTags();

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [team, setTeam] = useState("");
  const [language, setLanguage] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.name.match(/\.(pptx|pdf)$/i)) {
      setError("Seuls les fichiers .pptx et .pdf sont acceptés.");
      return;
    }
    if (f.size > 100 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 100 Mo).");
      return;
    }
    setFile(f);
    setError(null);
    if (!title) setTitle(f.name.replace(/\.(pptx|pdf)$/i, "").replace(/_/g, " "));
  };

  const toggleTag = (id: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const addNewTag = async () => {
    const label = newTag.trim().toLowerCase();
    if (!label) return;
    const { data, error } = await supabase
      .from("tags")
      .insert({ label, created_by: null })
      .select()
      .single();
    if (error) { setError(error.message); return; }
    setSelectedTagIds((prev) => [...prev, data.id]);
    setNewTag("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);
    setError(null);

    try {
      // 1. Upload file to Supabase Storage
      setProgress(20);
      const ext = file.name.split(".").pop();
      const storagePath = `public/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from("presentations")
        .upload(storagePath, file, { upsert: false });
      if (uploadErr) throw uploadErr;

      setProgress(60);

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from("presentations")
        .getPublicUrl(storagePath);
      const fileUrl = urlData.publicUrl;

      // 3. Insert presentation row
      setProgress(80);
      const { data: pres, error: insertErr } = await supabase
        .from("presentations")
        .insert({
          title,
          description: description || null,
          uploaded_by: ANON_USER_ID,
          team: team || null,
          language: language || null,
          file_url: fileUrl,
          thumbnail_url: null, // thumbnail generated server-side (see /api/generate-thumbnail)
          slide_count: 0,
        })
        .select()
        .single();
      if (insertErr) throw insertErr;

      // 4. Link tags
      if (selectedTagIds.length > 0) {
        await supabase.from("presentation_tags").insert(
          selectedTagIds.map((tag_id) => ({ presentation_id: pres.id, tag_id }))
        );
      }

      setProgress(100);
      setDone(true);
      setTimeout(() => navigate(`/presentation/${pres.id}`), 1500);
    } catch (err: any) {
      setError(err.message ?? "Une erreur est survenue.");
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <div className="container max-w-2xl py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Ajouter une présentation</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Formats acceptés : .pptx, .pdf — 100 Mo max
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`rounded-xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
              dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/40"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pptx,.pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <FilePresentation className="w-10 h-10 text-primary" />
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} Mo
                  </p>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline flex items-center gap-1"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    <X className="w-3 h-3" /> Supprimer
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" className="flex flex-col items-center gap-2">
                  <Upload className="w-10 h-10 text-muted-foreground/50" />
                  <p className="font-medium text-sm">Glissez votre fichier ici</p>
                  <p className="text-xs text-muted-foreground">ou cliquez pour parcourir</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Titre *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pitch Deck Q1 2025"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Courte description du contenu…"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1.5 block">Équipe</label>
                <Select value={team} onValueChange={setTeam}>
                  <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                  <SelectContent>
                    {TEAMS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1.5 block">Langue</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {allTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`tag-pill transition-colors ${
                      selectedTagIds.includes(tag.id)
                        ? "bg-primary text-primary-foreground"
                        : "tag-pill-gray"
                    }`}
                  >
                    #{tag.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNewTag())}
                  placeholder="Nouveau tag…"
                  className="h-8 text-sm"
                />
                <Button type="button" variant="outline" size="sm" onClick={addNewTag}>
                  Ajouter
                </Button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Progress */}
          {uploading && !done && (
            <div className="space-y-1">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">{progress}%</p>
            </div>
          )}

          {done && (
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <CheckCircle className="w-4 h-4" /> Présentation publiée ! Redirection…
            </div>
          )}

          <Button
            type="submit"
            disabled={!file || !title || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? "Publication en cours…" : "Publier la présentation"}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
