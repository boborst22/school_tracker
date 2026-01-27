import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Subjects from "./pages/Subjects";
import Exams from "./pages/Exams";
import Stats from "./pages/Stats";
import { SchoolProvider } from "./context/SchoolContext";

export default function App() {
  return (
    <SchoolProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Navigate to="/subjects" />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </SchoolProvider>
  );
}
