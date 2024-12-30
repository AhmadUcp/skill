"use client";

import { FirebaseError } from "firebase/app";
import AuthForm from "../components/auth-form";
import { auth,db } from "../components/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SignUp() {
    const [error, setError] = useState('');
    const [isSignedUp, setIsSignedUp] = useState(false); // Track signup completion
    const route = useRouter();

    const resetErrorAfterTimeout = (msg: string) => {
        setError(msg);
        setTimeout(() => setError(''), 3000);
    };

    const signUp = async (email: string, password: string, username?: string, role?: string) => {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
    
            await sendEmailVerification(user);
            resetErrorAfterTimeout("Verification email sent! Please check your inbox.");
    
            saveUserToFirebase(email, password, username || "Unknown User", user.uid, role || "Employee");
    
            setIsSignedUp(true);
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                if (err.code === "auth/email-already-in-use") {
                    resetErrorAfterTimeout("This email is already in use. Please use a different email.");
                } else if (err.code === "auth/weak-password") {
                    resetErrorAfterTimeout("Password is too weak. Please choose a stronger password.");
                } else {
                    resetErrorAfterTimeout("Something went wrong. Please try again.");
                }
            } else {
                resetErrorAfterTimeout("An unexpected error occurred. Please try again.");
            }
        }
    };
    

    const saveUserToFirebase = async (email: string, password: string, username: string, uid: string, role: string) => {
        const user = { email, password, uid, username, role }; // Include role
        const docRef = doc(db, "users", uid);

        await setDoc(docRef, user);
    };

    useEffect(() => {
        if (isSignedUp) {
            route.push('/emailVerification');
        }
    }, [isSignedUp, route]); 

 

    return (    
        <AuthForm
            func={signUp}
            signup={true}
            errorMsg={error}
        />
    );
}
