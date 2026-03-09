import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Subjects from "./pages/Subjects";
import Exams from "./pages/Exams";
import Stats from "./pages/Stats";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { SchoolProvider } from "./context/SchoolContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// komponenta pro chranene cesty (jen pro prihlasene)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  // dokud se nacita z local storage nezobrazi nic
  if (isLoading) {
    return <div>Načítání...</div>;
  }

  // pokud neni prihlasen presmeruj na domovskou obrazovku
  if (!user) {
    return <Navigate to="/" />;
  }

  // uzivatel ok, zobraz obsah (child komponenty)
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <SchoolProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            {/* verejne stranky dostupne vsem */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* chranene stranky dostupne pouze po prihlaseni */}
            <Route path="/subjects" element={
              <ProtectedRoute>
                <Subjects />
              </ProtectedRoute>
            } />
            <Route path="/exams" element={
              <ProtectedRoute>
                <Exams />
              </ProtectedRoute>
            } />
            <Route path="/stats" element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            } />

            {/* pokud zadana neexistujici stranka -> zpatky na home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </SchoolProvider>
    </AuthProvider>
  );
}
