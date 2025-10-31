"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import ModelFirestore from "@/model/model";

export default function RegisterPage() {
    const router = useRouter();
    const model = new ModelFirestore();

    const [form, setForm] = useState({name: "", email: "", password: ""});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await model.registerUser(form.name, form.email, form.password);
            alert(`Account created successfully! Welcome, ${user.displayName || "User"} ✨`);
            router.push("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const user = await model.loginWithGoogle();
            alert(`Welcome, ${user.displayName || "User"}!`);
            router.push("/");
        } catch (err) {
            setError("Google sign-up failed. Try again.");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-slate-800/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700 space-y-5"
            >
                <h2 className="text-3xl font-bold text-center mb-2">Create an Account</h2>
                <p className="text-sm text-gray-400 text-center mb-6">
                    Join us and start exploring 🚀
                </p>

                <div>
                    <Label htmlFor="name" className="text-gray-300">
                        Username
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="Your name"
                    />
                </div>

                <div>
                    <Label htmlFor="email" className="text-gray-300">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <Label htmlFor="password" className="text-gray-300">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
                >
                    {loading ? "Creating account..." : "Register"}
                </Button>

                <div className="flex items-center justify-center">
                    <span className="text-gray-500 text-sm">or</span>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleRegister}
                    className="w-full font-medium dark:text-white text-black flex items-center justify-center gap-2 transition-all"
                >
                    <Image src={"/google.png"} alt="Google" width={20} height={20}/>
                    Continue with Google
                </Button>

                <p className="text-sm text-center text-gray-50 mt-4">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-blue-400 hover:underline">
                        Sign in
                    </a>
                </p>
            </form>
        </div>
    );
}
