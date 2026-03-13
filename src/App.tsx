import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import UploadPage from "@/pages/UploadPage";
import PresentationDetail from "@/pages/PresentationDetail";

// Auth is disabled for now — re-enable by wrapping routes with AuthProvider + ProtectedRoute
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/presentation/:id" element={<PresentationDetail />} />
        <Route path="/presentation/:id/slide/:slideIndex" element={<PresentationDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
