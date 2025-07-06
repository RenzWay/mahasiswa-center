"use client";
import { useState } from "react";
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      sessionStorage.setItem("useruid", user.uid);
      window.location.href = "/pages"; // redirect
    } catch (error) {
      alert("Login gagal: " + error.message);
    }
  };

  return (
    <section className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        className="w-full max-w-sm text-black bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">
          Login
        </h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-blue-700 font-medium">
            Email
          </label>
          <input
            className="border border-blue-300 rounded-md p-2"
            type="email"
            id="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-blue-700 font-medium">
            Password
          </label>
          <input
            className="border border-blue-300 rounded-md p-2"
            type="password"
            id="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input
          type="submit"
          value="Sign In"
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md p-2"
        />
      </form>
    </section>
  );
}
