import { Link } from "react-router-dom";
import { Eye, FilePresentation, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { PresentationWithTags } from "@/hooks/usePresentations";

type Props = {
  presentation: PresentationWithTags;
  index?: number;
};

export default function PresentationCard({ presentation: p, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link to={`/presentation/${p.id}`}>
        <Card className="group overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
          {/* Thumbnail */}
          <div className="aspect-video bg-muted overflow-hidden relative">
            {p.thumbnail_url ? (
              <img
                src={p.thumbnail_url}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FilePresentation className="w-10 h-10 text-muted-foreground/40" />
              </div>
            )}
            {/* Slide count badge */}
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded font-medium">
              {p.slide_count} slides
            </span>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-2 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {p.title}
              </h3>
            </div>

            {p.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
            )}

            {/* Tags */}
            {p.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-auto pt-1">
                {p.tags.slice(0, 3).map((tag) => (
                  <span key={tag.id} className="tag-pill tag-pill-gray text-[10px]">
                    #{tag.label}
                  </span>
                ))}
                {p.tags.length > 3 && (
                  <span className="tag-pill tag-pill-gray text-[10px]">+{p.tags.length - 3}</span>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2 mt-1">
              <div className="flex items-center gap-2">
                {p.team && <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{p.team}</Badge>}
                {p.language && (
                  <span className="flex items-center gap-0.5">
                    <Globe className="w-3 h-3" /> {p.language}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> {p.views ?? 0}
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">{formatDate(p.created_at)}</p>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
