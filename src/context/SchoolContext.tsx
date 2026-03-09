// importujeme funkce z Reactu
// createContext = vytvori sdilene misto pro data
// useContext = komponenty si z toho umi vzit data
// useState = uklada stav (data)
// useEffect = spusti kod kdyz se neco zmeni
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// typ predmeta
// kazdy predmet ma id, nazev a seznam znamek
export interface Subject {
    id: string;
    name: string;
    grades: number[];
}

// typ testu
// test patri k nejakemu predmetu pomoci subjectId
export interface Exam {
    id: string;
    subjectId: string;
    date: string;
    topic?: string; // tema je nepovinne
}

// typ pro cely context
// rika jaka data a funkce budou dostupna v aplikaci
interface SchoolContextType {
    subjects: Subject[];
    exams: Exam[];
    addSubject: (name: string) => void;
    deleteSubject: (id: string) => void;
    addGrade: (subjectId: string, grade: number) => void;
    deleteGrade: (subjectId: string, gradeIndex: number) => void;
    addExam: (exam: Omit<Exam, "id">) => void;
    deleteExam: (id: string) => void;
}

// vytvoreni contextu pro sdileni dat v aplikaci
const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

// provider ktery bude obalovat aplikaci
// diky tomu budou vsechny komponenty mit pristup k datum
export function SchoolProvider({ children }: { children: ReactNode }) {

    // stav pro predmety
    // pri startu aplikace se pokusi nacist data z localStorage
    const [subjects, setSubjects] = useState<Subject[]>(() => {
        const stored = localStorage.getItem("school_subjects");
        return stored ? JSON.parse(stored) : [];
    });

    // stav pro testy
    const [exams, setExams] = useState<Exam[]>(() => {
        const stored = localStorage.getItem("school_exams");
        return stored ? JSON.parse(stored) : [];
    });

    // kdykoliv se zmeni predmety, ulozi se do localStorage
    useEffect(() => {
        localStorage.setItem("school_subjects", JSON.stringify(subjects));
    }, [subjects]);

    // kdykoliv se zmeni testy, ulozi se do localStorage
    useEffect(() => {
        localStorage.setItem("school_exams", JSON.stringify(exams));
    }, [exams]);

    // prida novy predmet
    const addSubject = (name: string) => {

        // vytvoreni noveho predmetu
        const newSubject: Subject = {
            id: crypto.randomUUID(), // vygeneruje nahodne id
            name,
            grades: []
        };

        // prida ho do seznamu predmetu
        setSubjects([...subjects, newSubject]);
    };

    // smaze predmet podle id
    const deleteSubject = (id: string) => {

        // odstrani predmet ze seznamu
        setSubjects(subjects.filter((s) => s.id !== id));

        // smaze i testy ktere patri k tomuto predmetu
        setExams(exams.filter((e) => e.subjectId !== id));
    };

    // prida znamku k predmetu
    const addGrade = (subjectId: string, grade: number) => {

        // projde vsechny predmety
        setSubjects(
            subjects.map((s) =>
                // pokud je to spravny predmet, prida znamku
                s.id === subjectId
                    ? { ...s, grades: [...s.grades, grade] }
                    : s
            )
        );
    };

    // smaze znamku z predmetu
    const deleteGrade = (subjectId: string, gradeIndex: number) => {

        setSubjects(
            subjects.map((s) =>
                s.id === subjectId
                    // filtr odstrani znamku podle indexu
                    ? { ...s, grades: s.grades.filter((_, i) => i !== gradeIndex) }
                    : s
            )
        );
    };

    // prida novy test
    const addExam = (examData: Omit<Exam, "id">) => {

        // vytvori novy test
        const newExam: Exam = {
            ...examData,
            id: crypto.randomUUID(),
        };

        // prida ho do seznamu testu
        setExams([...exams, newExam]);
    };

    // smaze test podle id
    const deleteExam = (id: string) => {
        setExams(exams.filter((e) => e.id !== id));
    };

    // provider ktery poskytne data cele aplikaci
    return (
        <SchoolContext.Provider
            value={{
                subjects,
                exams,
                addSubject,
                deleteSubject,
                addGrade,
                deleteGrade,
                addExam,
                deleteExam,
            }}
        >
            {children}
        </SchoolContext.Provider>
    );
}

// vlastni hook pro jednoduche pouziti contextu
export function useSchool() {

    const context = useContext(SchoolContext);

    // ochrana aby se hook nepouzil mimo provider
    if (!context) {
        throw new Error("useSchool must be used within a SchoolProvider");
    }

    return context;
}