import { useState } from "react";
import { useSchool } from "../context/SchoolContext";

// hlavni komponenta stranky Subjects
// zobrazuje seznam predmetu a jejich znamky
export default function Subjects() {

  const { subjects, addSubject, addGrade, deleteSubject, deleteGrade } = useSchool();

  // lokalni state pro input nazvu noveho predmetu
  const [name, setName] = useState("");

  // objekt ktery drzi hodnotu inputu znamky pro kazdy predmet
  // key = id predmetu
  // value = hodnota inputu
  const [gradeInput, setGradeInput] = useState<{ [key: string]: string }>({});

  // funkce ktera prida novy predmet
  const handleAddSubject = () => {

    // pokud je input prazdny nic nedelat
    if (!name) return;

    // zavola funkci z contextu ktera prida predmet
    addSubject(name);

    // vymaze input
    setName("");
  };

  // funkce pro pridani znamky ke konkretnimu predmetu
  const handleAddGrade = (subjectId: string) => {

    // vezme hodnotu inputu a prevede ji na cislo
    const grade = parseInt(gradeInput[subjectId]);

    // kontrola jestli je znamka validni (1-5)
    if (isNaN(grade) || grade < 1 || grade > 5) return;

    // prida znamku do predmetu
    addGrade(subjectId, grade);

    // vymaze input pro tento predmet
    setGradeInput({ ...gradeInput, [subjectId]: "" });
  };

  return (
    <div>

      {/* hlavni nadpis stranky */}
      <div className="header-container">
        <h1>Předměty</h1>
      </div>

      {/* formular pro pridani noveho predmetu */}
      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>

        {/* input pro nazev predmetu */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Název nového předmětu..."
          style={{ flex: 1 }}

          // pokud uzivatel zmackne Enter prida se predmet
          onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
        />

        {/* tlacitko pro pridani predmetu */}
        <button className="primary" onClick={handleAddSubject}>
          + Přidat předmět
        </button>
      </div>

      {/* grid se vsemi predmety */}
      <div className="grid">

        {/* pokud nejsou zadne predmety zobraz hlasku */}
        {subjects.length === 0 && (
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            Zatím nemáte žádne předměty.
          </div>
        )}

        {/* projde vsechny predmety a pro kazdy vytvori kartu */}
        {subjects.map((s) => (

          <div key={s.id} className="card">

            {/* horni cast karty - nazev predmetu + smazani */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>

              <h2>{s.name}</h2>

              {/* tlacitko pro smazani predmetu */}
              <button
                className="danger"
                onClick={() => deleteSubject(s.id)}
              >
                ✕
              </button>
            </div>

            {/* seznam znamek */}
            <div>

              <div>ZNÁMKY</div>

              <div>

                {/* pokud existuji znamky */}
                {s.grades.length > 0 ? (

                  // projde vsechny znamky
                  s.grades.map((g, i) => (

                    // badge se znamkou
                    <span
                      key={i}

                      // kliknutim se znamka smaze
                      onClick={() => deleteGrade(s.id, i)}
                    >
                      {g}
                    </span>
                  ))

                ) : (

                  // pokud nejsou znamky
                  <span>Žádné známky</span>
                )}

              </div>
            </div>

            {/* input pro pridani nove znamky */}
            <div>

              <input
                type="number"
                min="1"
                max="5"
                placeholder="1-5"

                // hodnota inputu pro konkretni predmet
                value={gradeInput[s.id] || ""}

                // ulozi zadanou hodnotu do objektu gradeInput
                onChange={(e) =>
                  setGradeInput({ ...gradeInput, [s.id]: e.target.value })
                }

                // Enter prida znamku
                onKeyDown={(e) => e.key === 'Enter' && handleAddGrade(s.id)}
              />

              {/* tlacitko pro pridani znamky */}
              <button onClick={() => handleAddGrade(s.id)}>
                Přidat
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}