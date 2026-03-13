import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Download, Share2, ChevronLeft, ChevronRight,
  Maximize2, ArrowLeft, Trash2, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TagPill from "@/components/TagPill";
import { usePresentation, deletePresentation } from "@/hooks/usePresentations";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";

export default function PresentationDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: presentation, slides, loading, error } = usePresentation(id ?? "");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copySlideLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/presentation/${id}/slide/${currentSlide}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Supprimer cette présentation ?")) return;
    await deletePresentation(id!);
    navigate("/");
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container py-16 text-center text-muted-foreground">Chargement…</div>
      </AppLayout>
    );
  }

  if (error || !presentation) {
    return (
      <AppLayout>
        <div className="container py-16 text-center text-destructive">
          {error ?? "Présentation introuvable"}
        </div>
      </AppLayout>
    );
  }

  const activeSlide = slides[currentSlide];
  const totalSlides = slides.length || presentation.slide_count;

  return (
    <AppLayout>
      <div className="container py-6 space-y-6">
        {/* Breadcrumb */}
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Bibliothèque
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Viewer */}
          <div className="flex-1 space-y-3">
            {/* Main slide */}
            <div
              className={`relative bg-muted rounded-xl overflow-hidden border ${
                fullscreen ? "fixed inset-0 z-50 rounded-none bg-black" : "aspect-video"
              }`}
            >
              <AnimatePresence mode="wait">
                {activeSlide?.thumbnail_url ? (
                  <motion.img
                    key={currentSlide}
                    src={activeSlide.thumbnail_url}
                    alt={`Slide ${currentSlide + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Aperçu non disponible
                  </div>
                )}
              </AnimatePresence>

              {/* Fullscreen toggle */}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="absolute top-3 right-3 bg-black/50 text-white rounded-md p-1.5 hover:bg-black/70 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Prev / Next */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide((s) => Math.max(0, s - 1))}
                    disabled={currentSlide === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-md p-1.5 hover:bg-black/70 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((s) => Math.min(totalSlides - 1, s + 1))}
                    disabled={currentSlide === totalSlides - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-md p-1.5 hover:bg-black/70 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Slide counter */}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                {currentSlide + 1} / {totalSlides}
              </span>
            </div>

            {/* Thumbnail strip */}
            {slides.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(i)}
                    className={`shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-colors ${
                      i === currentSlide ? "border-primary" : "border-transparent"
                    }`}
                  >
                    {s.thumbnail_url ? (
                      <img src={s.thumbnail_url} alt={`Miniature ${i + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                        {i + 1}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Tags on active slide */}
            {activeSlide?.tags?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Tags slide :</span>
                {activeSlide.tags.map((tag) => (
                  <TagPill key={tag.id} tag={tag} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 space-y-5 shrink-0">
            <div>
              <h1 className="text-xl font-bold font-display leading-tight">{presentation.title}</h1>
              {presentation.description && (
                <p className="text-sm text-muted-foreground mt-2">{presentation.description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {presentation.team && <Badge variant="secondary">{presentation.team}</Badge>}
              {presentation.language && <Badge variant="outline">{presentation.language}</Badge>}
            </div>

            {presentation.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {presentation.tags.map((tag) => (
                  <TagPill key={tag.id} tag={tag} />
                ))}
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
              <p><span className="font-medium">Ajouté le :</span> {formatDate(presentation.created_at)}</p>
              <p><span className="font-medium">Slides :</span> {presentation.slide_count}</p>
              <p><span className="font-medium">Vues :</span> {presentation.views}</p>
            </div>

            <div className="flex flex-col gap-2">
              {presentation.file_url && (
                <Button asChild variant="default" className="gap-2">
                  <a href={presentation.file_url} download target="_blank" rel="noreferrer">
                    <Download className="w-4 h-4" /> Télécharger .pptx
                  </a>
                </Button>
              )}

              <Button variant="outline" className="gap-2" onClick={copySlideLink}>
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? "Lien copié !" : "Copier le lien de cette slide"}
              </Button>

              {user?.id === presentation.uploaded_by && (
                <Button variant="ghost" className="gap-2 text-destructive hover:text-destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4" /> Supprimer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
