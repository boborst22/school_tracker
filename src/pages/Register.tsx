import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const URL : string = import.meta.env.VITE_API_URL;
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(URL+ "auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    firstName,
                    lastName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Chyba při registraci");
            }

            // automatické přihlášení po úspěšné registraci
            login({
                id: data.id,
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                token: data.token
            });

            navigate("/subjects");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", margin: "2rem 0" }}>
            <div className="card" style={{ width: "100%", maxWidth: "400px" }}>

                <div className="header-container" style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem" }}>Registrace</h1>
                    <p style={{ color: "var(--color-text-secondary)" }}>
                        Vytvořte si nový účet
                    </p>
                </div>

                {error && (
                    <div style={{ backgroundColor: "var(--color-danger)", color: "white", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label htmlFor="firstName">Jméno</label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label htmlFor="lastName">Příjmení</label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label htmlFor="username">Uživatelské jméno</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label htmlFor="password">Heslo</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="primary" disabled={loading} style={{ marginTop: "1rem" }}>
                        {loading ? "Registruji..." : "Zaregistrovat se"}
                    </button>
                    
                    <div style={{ textAlign: "center", marginTop: "1rem" }}>
                        <Link to="/login" style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                            Již máte účet? Přihlaste se.
                        </Link>
                    </div>
                </form>

            </div>
        </div>
    );
}
