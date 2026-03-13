import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "@/pages/Index";
import UploadPage from "@/pages/UploadPage";
import PresentationDetail from "@/pages/PresentationDetail";
import LoginPage from "@/pages/LoginPage";
import AuthCallback from "@/pages/AuthCallback";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthorized } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Chargement…
      </div>
    );
  }
  return isAuthorized ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      <Route path="/presentation/:id" element={<ProtectedRoute><PresentationDetail /></ProtectedRoute>} />

      {/* Public slide share link (no auth required) */}
      <Route path="/presentation/:id/slide/:slideIndex" element={<PresentationDetail />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
