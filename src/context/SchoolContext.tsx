import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
    const [subjects, setSubjects] = useState<Subject[]>(() => {
        const stored = localStorage.getItem("school_subjects");
        return stored ? JSON.parse(stored) : [];
    });

    const [exams, setExams] = useState<Exam[]>(() => {
        const stored = localStorage.getItem("school_exams");
        return stored ? JSON.parse(stored) : [];
    });

    // Persist functionality
    useEffect(() => {
        localStorage.setItem("school_subjects", JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem("school_exams", JSON.stringify(exams));
    }, [exams]);

    const addSubject = (name: string) => {
        const newSubject: Subject = {
            id: crypto.randomUUID(),
            name,
            grades: []
        };
        setSubjects([...subjects, newSubject]);
    };

    const deleteSubject = (id: string) => {
        setSubjects(subjects.filter((s) => s.id !== id));
        // Also cleanup exams for this subject
        setExams(exams.filter((e) => e.subjectId !== id));
    };

    const addGrade = (subjectId: string, grade: number) => {
        setSubjects(
            subjects.map((s) =>
                s.id === subjectId ? { ...s, grades: [...s.grades, grade] } : s
            ) // Appending grade
        );
    };

    const deleteGrade = (subjectId: string, gradeIndex: number) => {
        setSubjects(
            subjects.map((s) =>
                s.id === subjectId
                    ? { ...s, grades: s.grades.filter((_, i) => i !== gradeIndex) }
                    : s
            )
        );
    }

    const addExam = (examData: Omit<Exam, "id">) => {
        const newExam: Exam = {
            ...examData,
            id: crypto.randomUUID(),
        };
        setExams([...exams, newExam]);
    };

    const deleteExam = (id: string) => {
        setExams(exams.filter((e) => e.id !== id));
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
