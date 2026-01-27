import { useSchool } from "../context/SchoolContext";

export default function Stats() {
  const { subjects, exams } = useSchool();

  const totalSubjects = subjects.length;
  const totalExams = exams.length;

  const allGrades = subjects.flatMap(s => s.grades);
  const averageGrade = allGrades.length > 0
    ? (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(2)
    : "–";

  return (
    <div>
      <h1>Statistiky</h1>

      <div className="grid" style={{ marginBottom: "2rem" }}>
        <div className="card" style={{ textAlign: "center", marginBottom: 0 }}>
          <div style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Počet předmětů</div>
          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--color-primary)" }}>{totalSubjects}</div>
        </div>
        <div className="card" style={{ textAlign: "center", marginBottom: 0 }}>
          <div style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Počet testů</div>
          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#facc15" }}>{totalExams}</div>
        </div>
        <div className="card" style={{ textAlign: "center", marginBottom: 0 }}>
          <div style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Průměrná známka</div>
          <div style={{ fontSize: "3rem", fontWeight: "bold", color: "#4ade80" }}>{averageGrade}</div>
        </div>
      </div>

      <h2>Průměry dle předmětů</h2>
      {subjects.length === 0 ? <p className="empty-state">Žádné předměty.</p> : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {subjects.map((s, i) => {
            const avg = s.grades.length > 0
              ? (s.grades.reduce((a, b) => a + b, 0) / s.grades.length).toFixed(2)
              : "–";
            return (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem 1.5rem",
                  borderBottom: i < subjects.length - 1 ? "1px solid var(--color-border)" : "none",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)"
                }}
              >
                <span style={{ fontWeight: 500 }}>{s.name}</span>
                <strong style={{ color: "var(--color-text)" }}>{avg}</strong>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
