import { useState } from "react";
import { useSchool } from "../context/SchoolContext";

export default function Exams() {
  const { exams, subjects, addExam, deleteExam } = useSchool();
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [topic, setTopic] = useState("");

  const handleAddExam = () => {
    if (!subjectId || !date) return;
    addExam({ subjectId, date, topic });
    setSubjectId("");
    setDate("");
    setTopic("");
  };

  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? subject.name : "Neznámý předmět";
  };

  //serazeni podle data
  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <h1>Nadcházející testy</h1>

      <div className="card" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "end" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>Předmět</label>
          <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">Vyber předmět</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>Datum</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1, minWidth: "200px" }}>
          <label style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>Téma (volitelné)</label>
          <input
            placeholder="Např. Pololetní písemka..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddExam()}
          />
        </div>

        <button className="primary" onClick={handleAddExam} style={{ height: "42px" }}>Přidat test</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {sortedExams.length === 0 && (
          <div className="empty-state">
            Žádné nadcházející testy.
          </div>
        )}

        {sortedExams.map((e) => (
          <div key={e.id} className="card" style={{ margin: 0, display: "flex", alignItems: "center", padding: "1rem" }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "var(--color-surface-hover)",
              padding: "0.5rem",
              borderRadius: "var(--radius-sm)",
              marginRight: "1.5rem",
              minWidth: "60px"
            }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--color-primary)" }}>
                {new Date(e.date).toLocaleDateString('cs-CZ', { month: 'short' }).toUpperCase()}
              </span>
              <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {new Date(e.date).getDate()}
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{getSubjectName(e.subjectId)}</h3>
              {e.topic && <div style={{ color: "var(--color-text-secondary)" }}>{e.topic}</div>}
            </div>

            <button
              className="danger"
              onClick={() => deleteExam(e.id)}
              title="Odstranit"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
