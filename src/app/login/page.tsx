"use client";

import AuthForm from "../components/auth-form";
import { auth } from "../components/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {

    const [error, setError] = useState('');

    const route = useRouter();

    const login = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const userData = userCredential.user;

            if (!userData.emailVerified) {
                setError("User Does Not Exist!");
            }

            if (userData.emailVerified) {
                route.push('/')
            } else {
                setError("Please Verilfy your email before logging in!")
            }

        } catch (e) {
            console.error(e);
        }
    };

    return (
        <AuthForm
            func={login}
            errorMsg={error}
        />
    );
}