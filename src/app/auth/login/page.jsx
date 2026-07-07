"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  ArrowRight,
  LayoutDashboard,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/firebase/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ModelFirestore from "@/model/model";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push("/pages/dashboard");
    } catch (err) {
      setError("Email atau password belum cocok.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const model = new ModelFirestore();
      await model.loginWithGoogle();
      router.push("/pages/dashboard");
    } catch (error) {
      console.error(error);
      setError("Login dengan Google gagal. Coba lagi.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-5 py-8 text-slate-950">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-slate-900 bg-slate-100 shadow-md shadow-slate-200/70 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-semibold">
            <span className="flex size-9 items-center justify-center rounded-md bg-white text-slate-950">
              <LayoutDashboard className="size-4" />
            </span>
            Mahasiswa Center
          </Link>

          <div className="my-auto">
            <div className="mb-6 mt-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1 text-sm text-sky-100">
              <ShieldCheck className="size-4 text-green-400" />
              Workspace akademik pribadi
            </div>
            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Lanjutkan rencana kuliahmu dari satu dashboard.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Masuk untuk melihat tugas, jadwal, dan catatan yang sudah kamu
              susun sebelumnya.
            </p>

            <div className="mt-8 overflow-hidden rounded-lg border border-white/10 bg-white/5">
              <Image
                src="/ss/dashboard.png"
                alt="Preview dashboard Mahasiswa Center"
                width={900}
                height={560}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 flex items-center gap-3 text-sm font-semibold lg:hidden">
              <span className="flex size-9 items-center justify-center rounded-md bg-slate-950 text-white">
                <LayoutDashboard className="size-4" />
              </span>
              Mahasiswa Center
            </Link>

            <p className="text-sm font-bold uppercase text-sky-600">
              Welcome back
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              Masuk ke akunmu
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Gunakan email atau akun Google untuk kembali ke workspace kamu.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="h-11 pl-10"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-2 h-11"
                  placeholder="Masukkan password"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="outline"
              disabled={loading || googleLoading}
              className="mt-6 h-11 w-full hover:text-slate-500">
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Masuk"}
              {!loading && <ArrowRight className="size-4" />}
            </Button>

            <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              atau
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="h-11 w-full hover:text-slate-500">
              {googleLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Image src="/google.png" alt="Google" width={18} height={18} />
              )}
              Lanjut dengan Google
            </Button>

            <p className="mt-8 text-center text-sm text-slate-600">
              Belum punya akun?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-sky-700 hover:text-sky-800">
                Buat akun
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
