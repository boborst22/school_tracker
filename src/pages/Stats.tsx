import { useSchool } from "../context/SchoolContext";

// komponenta pro stranku Statistiky
// zobrazuje ruzne statistiky z dat aplikace
export default function Stats() {

  // ziskani dat z globalniho SchoolContextu
  // subjects = seznam predmetu
  // exams = seznam testu
  const { subjects, exams } = useSchool();

  // pocet predmetu (delka pole subjects)
  const totalSubjects = subjects.length;

  // pocet testu
  const totalExams = exams.length;

  // vytvori jedno pole se vsemi znamkami ze vsech predmetu
  // flatMap vezme grades z kazdeho predmetu a spoji je
  const allGrades = subjects.flatMap(s => s.grades);

  // vypocet prumeru vsech znamek
  const averageGrade = allGrades.length > 0
    ? (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(2)
    : "–";

  return (
    <div>

      {/* hlavni nadpis stranky */}
      <h1>Statistiky</h1>

      {/* tri karty se zakladnimi statistikami */}
      <div className="grid" style={{ marginBottom: "2rem" }}>

        {/* karta pocet predmetu */}
        <div className="card" style={{ textAlign: "center", marginBottom: 0 }}>
          <div>Počet předmětů</div>
          <div>{totalSubjects}</div>
        </div>

        {/* karta pocet testu */}
        <div className="card" style={{ textAlign: "center", marginBottom: 0 }}>
          <div>Počet testů</div>
          <div>{totalExams}</div>
        </div>

        {/* karta prumerna znamka */}
        <div className="card" style={{ textAlign: "center", marginBottom: 0 }}>
          <div>Průměrná známka</div>
          <div>{averageGrade}</div>
        </div>

      </div>

      {/* seznam prumeru podle predmetu */}
      <h2>Průměry dle předmětů</h2>

      {/* pokud nejsou zadne predmety */}
      {subjects.length === 0 ? (
        <p className="empty-state">Žádné předměty.</p>
      ) : (

        <div className="card">

          {/* projde vsechny predmety */}
          {subjects.map((s) => {

            // vypocet prumeru pro konkretni predmet
            const avg = s.grades.length > 0
              ? (s.grades.reduce((a, b) => a + b, 0) / s.grades.length).toFixed(2)
              : "–";

            return (

              // radek s nazvem predmetu a prumerem
              <div key={s.id}>

                <span>{s.name}</span>

                <strong>{avg}</strong>

              </div>

            );
          })}

        </div>
      )}

    </div>
  );
}