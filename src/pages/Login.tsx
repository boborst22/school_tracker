// Gemini -----------------------------------------

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// stranka pro prihlaseni uzivatele
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // funkce pro prihlaseni z contextu
    const { login } = useAuth();
    // hook pro presmerovani na jinou stranku
    const navigate = useNavigate();

    // obsluha odeslani formulare
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // overeni hesla proti backendu (dummyjson api)
            const response = await fetch("https://dummyjson.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            // pokud endpoint vrati ze je to spatne
            if (!response.ok) {
                throw new Error(data.message || "Neplatné jméno nebo heslo");
            }

            // prihlaseni se zadarilo
            login({
                id: data.id,
                username: data.username,
                firstName: data.firstName,
                lastName: data.lastName,
                token: data.token
            });

            // po uspesnem prihlaseni presmerovat na predmety
            navigate("/subjects");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
            <div className="card" style={{ width: "100%", maxWidth: "400px" }}>

                <div className="header-container" style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem" }}>Přihlášení</h1>
                    <p style={{ color: "var(--color-text-secondary)" }}>
                        Zadejte své údaje (např. jméno: emilys, heslo: emilyspass)
                    </p>
                </div>

                {/* pokud je chyba, zobraz blok s chybou */}
                {error && (
                    <div style={{ backgroundColor: "var(--color-danger)", color: "white", padding: "1rem", borderRadius: "var(--radius-sm)", marginBottom: "1rem", textAlign: "center" }}>
                        {error}
                    </div>
                )}

                {/* formulář přihlášení */}
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

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
                        />
                    </div>

                    <button type="submit" className="primary" disabled={loading} style={{ marginTop: "1rem" }}>
                        {loading ? "Přihlašuji..." : "Přihlásit se"}
                    </button>
                </form>

            </div>
        </div>
    );
}

//-------------------------------