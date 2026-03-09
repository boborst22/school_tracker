import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// navigacni lista
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // spolecny styl pro tlacitka v navigaci
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
      justifyContent: "center",
      alignItems: "center"
    }}>

      {/* pokud je uzivatel prihlasen */}
      {user ? (
        <>
          <NavLink to="/subjects" style={getLinkStyle}>Předměty</NavLink>
          <NavLink to="/exams" style={getLinkStyle}>Testy</NavLink>
          <NavLink to="/stats" style={getLinkStyle}>Statistiky</NavLink>

          <div style={{ width: "1px", height: "24px", background: "var(--color-border)", margin: "0 0.5rem" }} />

          <button
            className="danger"
            onClick={() => {
              logout();
              navigate("/");
            }}
            style={{ padding: "0.6rem 1rem", fontSize: "0.9rem" }}
          >
            Odhlásit
          </button>
        </>
      ) : (
        /* pokud uzivatel neni prihlasen */
        <>
          <NavLink to="/" style={getLinkStyle}>Úvod</NavLink>
          <NavLink to="/login" style={getLinkStyle}>Přihlášení</NavLink>
        </>
      )}

    </nav>
  );
}