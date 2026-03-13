// importujeme funkce z Reactu
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Subject {
    id: string;
    name: string;
    grades: number[];
}

export interface Exam {
    id: string;
    subjectId: string;
    date: string;
    topic?: string;
}

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

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const URL : string = import.meta.env.VITE_API_URL;
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);

    // Načtení dat ze serveru po přihlášení
    useEffect(() => {
        if (!user) {
            setSubjects([]);
            setExams([]);
            return;
        }
        
        const loadData = async () => {
            try {
                const response = await fetch(URL+ "data", {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSubjects(data.subjects || []);
                    setExams(data.exams || []);
                }
            } catch (err) {
                console.error("Chyba při načítání dat pro uživatele:", err);
            }
        };

        loadData();
    }, [user]);

    // Uložení dat na server při každé změně
    const saveDataToBackend = async (newSubjects: Subject[], newExams: Exam[]) => {
        if (!user) return;
        try {
            await fetch(URL+"data", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}` 
                },
                body: JSON.stringify({ subjects: newSubjects, exams: newExams })
            });
        } catch (err) {
            console.error("Chyba uložení dat:", err);
        }
    };

    const addSubject = (name: string) => {
        const newSubject: Subject = {
            id: crypto.randomUUID(),
            name,
            grades: []
        };
        const newSubjects = [...subjects, newSubject];
        setSubjects(newSubjects);
        saveDataToBackend(newSubjects, exams);
    };

    const deleteSubject = (id: string) => {
        const newSubjects = subjects.filter((s) => s.id !== id);
        const newExams = exams.filter((e) => e.subjectId !== id);
        
        setSubjects(newSubjects);
        setExams(newExams);
        saveDataToBackend(newSubjects, newExams);
    };

    const addGrade = (subjectId: string, grade: number) => {
        const newSubjects = subjects.map((s) =>
            s.id === subjectId
                ? { ...s, grades: [...s.grades, grade] }
                : s
        );
        setSubjects(newSubjects);
        saveDataToBackend(newSubjects, exams);
    };

    const deleteGrade = (subjectId: string, gradeIndex: number) => {
        const newSubjects = subjects.map((s) =>
            s.id === subjectId
                ? { ...s, grades: s.grades.filter((_, i) => i !== gradeIndex) }
                : s
        );
        setSubjects(newSubjects);
        saveDataToBackend(newSubjects, exams);
    };

    const addExam = (examData: Omit<Exam, "id">) => {
        const newExam: Exam = {
            ...examData,
            id: crypto.randomUUID(),
        };
        const newExams = [...exams, newExam];
        setExams(newExams);
        saveDataToBackend(subjects, newExams);
    };

    const deleteExam = (id: string) => {
        const newExams = exams.filter((e) => e.id !== id);
        setExams(newExams);
        saveDataToBackend(subjects, newExams);
    };

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

export function useSchool() {
    const context = useContext(SchoolContext);
    if (!context) {
        throw new Error("useSchool must be used within a SchoolProvider");
    }
    return context;
}