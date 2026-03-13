import { Link } from "react-router-dom";
import { Eye, FilePresentation, Globe, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { PresentationWithTags } from "@/hooks/usePresentations";

type Props = {
  presentation: PresentationWithTags;
  index?: number;
};

export default function PresentationListItem({ presentation: p, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="group flex items-center gap-4 rounded-xl border bg-card p-3 hover:shadow-sm transition-shadow"
    >
      {/* Thumbnail */}
      <Link to={`/presentation/${p.id}`} className="shrink-0">
        <div className="w-24 h-16 rounded-md bg-muted overflow-hidden">
          {p.thumbnail_url ? (
            <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FilePresentation className="w-6 h-6 text-muted-foreground/40" />
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/presentation/${p.id}`}>
          <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
            {p.title}
          </h3>
        </Link>

        {p.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{p.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {p.team && <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{p.team}</Badge>}
          {p.language && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Globe className="w-3 h-3" /> {p.language}
            </span>
          )}
          {p.tags.slice(0, 4).map((tag) => (
            <span key={tag.id} className="tag-pill tag-pill-gray text-[10px]">
              #{tag.label}
            </span>
          ))}
          {p.tags.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{p.tags.length - 4}</span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="shrink-0 flex flex-col items-end gap-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {p.views ?? 0}</span>
        <span>{p.slide_count} slides</span>
        <span>{formatDate(p.created_at)}</span>
      </div>

      {/* Download button */}
      {p.file_url && (
        <a href={p.file_url} download target="_blank" rel="noreferrer" className="shrink-0">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Télécharger .pptx">
            <Download className="w-4 h-4" />
          </Button>
        </a>
      )}
    </motion.div>
  );
}
