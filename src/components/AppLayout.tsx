import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Bibliothèque", icon: BookOpen },
  { to: "/upload", label: "Ajouter", icon: Upload },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-display">SlideBase</span>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname === to
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        SlideBase — usage interne uniquement
      </footer>
    </div>
  );
}
