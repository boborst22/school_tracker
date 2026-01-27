import { useState } from "react";
import { useSchool } from "../context/SchoolContext";

export default function Subjects() {
  const { subjects, addSubject, addGrade, deleteSubject, deleteGrade } = useSchool();
  const [name, setName] = useState("");
  const [gradeInput, setGradeInput] = useState<{ [key: string]: string }>({});

  const handleAddSubject = () => {
    if (!name) return;
    addSubject(name);
    setName("");
  };

  const handleAddGrade = (subjectId: string) => {
    const grade = parseInt(gradeInput[subjectId]);
    if (isNaN(grade) || grade < 1 || grade > 5) return;
    addGrade(subjectId, grade);
    setGradeInput({ ...gradeInput, [subjectId]: "" });
  };

  return (
    <div>
      <div className="header-container">
        <h1>Předměty</h1>
      </div>

      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Název nového předmětu..."
          style={{ flex: 1 }}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
        />
        <button className="primary" onClick={handleAddSubject}>+ Přidat předmět</button>
      </div>

      <div className="grid">
        {subjects.length === 0 && (
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            Zatím nemáte žádné předměty. Začněte tím, že nějaký přidáte.
          </div>
        )}

        {subjects.map((s) => (
          <div key={s.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <h2 style={{ fontSize: "1.5rem", margin: 0 }}>{s.name}</h2>
              <button
                className="danger"
                onClick={() => deleteSubject(s.id)}
                title="Smazat předmět"
                style={{ padding: "0.4em 0.8em" }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>
                ZNÁMKY
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {s.grades.length > 0 ? (
                  s.grades.map((g, i) => (
                    <span
                      key={i}
                      className={`badge badge-${g}`}
                      title="Kliknutím smažeš"
                      onClick={() => deleteGrade(s.id, i)}
                      style={{ cursor: "pointer" }}
                    >
                      {g}
                    </span>
                  ))
                ) : (
                  <span style={{ fontStyle: "italic", color: "var(--color-text-secondary)" }}>Žádné známky</span>
                )}
              </div>
            </div>

            <div className="input-group" style={{ marginTop: "auto", borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
              <input
                type="number"
                min="1"
                max="5"
                placeholder="1-5"
                value={gradeInput[s.id] || ""}
                onChange={(e) => setGradeInput({ ...gradeInput, [s.id]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGrade(s.id)}
                style={{ width: "80px" }}
              />
              <button onClick={() => handleAddGrade(s.id)} style={{ flex: 1 }}>Přidat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
