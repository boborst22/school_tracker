import { useNavigate } from "react-router-dom";

// hlavni landing page pro neprihlaseneho uzivatele
export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem", alignItems: "center", textAlign: "center", paddingTop: "2rem" }}>

            {}
            <div style={{ maxWidth: "600px" }}>
                <h1 style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>School Tracker</h1>
                <p style={{ fontSize: "1.2rem", color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
                    Nejlepší nástroj pro sledování vašich školních známek, testů a statistik na jednom místě.
                    Mějte své vzdělání pevně pod kontrolou.
                </p>
                <button
                    className="primary"
                    style={{ fontSize: "1.2rem", padding: "1rem 2rem", borderRadius: "var(--radius-md)" }}
                    onClick={() => navigate("/login")}
                >
                    Začít používat
                </button>
            </div>

            {/* sekce s prehledem funkci - komponenty */}
            <div className="grid">
                <div className="card">
                    <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)" }}>Správa předmětů</h2>
                    <p style={{ color: "var(--color-text-secondary)" }}>
                        Přidávejte a mažte předměty podle vaší libosti. Přehledně uspořádáno pro maximální efektivitu.
                    </p>
                </div>
                <div className="card">
                    <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)" }}>Sledování testů</h2>
                    <p style={{ color: "var(--color-text-secondary)" }}>
                        Zapisujte si datum a předmět budoucího testu, abyste už nikdy na nic nezapomněli.
                    </p>
                </div>
                <div className="card">
                    <h2 style={{ fontSize: "1.5rem", color: "var(--color-primary)" }}>Detailní statistiky</h2>
                    <p style={{ color: "var(--color-text-secondary)" }}>
                        Získejte přehled o svém studijním průměru. Zjistěte, ze kterých předmětů excelujete a kde je potřeba zabrat.
                    </p>
                </div>
            </div>

        </div>
    );
}
