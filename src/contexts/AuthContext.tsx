import React, { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    User,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    createUserWithEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const createUserWithEmail = async (email: string, password: string) => {
        setError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (err: any) {

            let errorMessage = "Failed to create account.";
            if (err.code === 'auth/email-already-in-use') {
                errorMessage = "An account with this email already exists.";
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            } else if (err.code === 'auth/weak-password') {
                errorMessage = "Password is too weak.";
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = "Network error: Please check your internet connection.";
            }

            setError(errorMessage);
            throw err;
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {

            // Provide more specific error messages
            let errorMessage = "Failed to sign in. Please check your credentials.";
            if (err.code === 'auth/network-request-failed') {
                errorMessage = "Network error: Please check your internet connection and try again.";
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = "Invalid email format.";
            } else if (err.code === 'auth/user-disabled') {
                errorMessage = "This account has been disabled.";
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = "No account found with this email.";
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password.";
            }

            setError(errorMessage);
            throw err;
        }
    };

    const logout = async () => {
        setError(null);
        try {
            await signOut(auth);
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, createUserWithEmail, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
