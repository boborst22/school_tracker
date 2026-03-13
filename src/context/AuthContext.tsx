//Gemini (https://gemini.com)  ----------------------------------------

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// definice typu pro uzivatele
interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
}

// definice dat v contextu
interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

// vytvoreni contextu
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// provider komponenta, ktera obali aplikaci
export function AuthProvider({ children }: { children: ReactNode }) {
    // stav prihlaseneho uzivatele
    const [user, setUser] = useState<User | null>(null);
    // stav nacitani (aby se stranka nepresmerovala hned po nacteni)
    const [isLoading, setIsLoading] = useState(true);

    // nacteni uzivatele z local storage po spusteni aplikace
    useEffect(() => {
        const storedUser = localStorage.getItem("school_tracker_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Chyba při parsování uživatele", e);
            }
        }
        setIsLoading(false);
    }, []);

    // funkce pro uspesne prihlaseni (ulozi uzivatele)
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("school_tracker_user", JSON.stringify(userData));
    };

    // funkce pro odhlaseni (smaze uzivatele)
    const logout = () => {
        setUser(null);
        localStorage.removeItem("school_tracker_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

// custom hook pro jednoduche pouzivani contextu
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

//---------------------------------