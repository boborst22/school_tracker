import { NavLink } from "react-router-dom";

export default function Navbar() {
  const getLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: "0.8rem 1.5rem",
    borderRadius: "var(--radius-sm)",
    color: isActive ? "white" : "var(--color-text-secondary)",
    backgroundColor: isActive ? "var(--color-primary)" : "transparent",
    fontWeight: isActive ? 600 : 400,
    textDecoration: "none",
    transition: "all 0.2s"
  });

  return (
    <nav style={{
      display: "flex",
      gap: "0.5rem",
      padding: "1rem",
      marginBottom: "2rem",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      justifyContent: "center"
    }}>
      <NavLink to="/subjects" style={getLinkStyle}>Předměty</NavLink>
      <NavLink to="/exams" style={getLinkStyle}>Testy</NavLink>
      <NavLink to="/stats" style={getLinkStyle}>Statistiky</NavLink>
    </nav>
  );
}