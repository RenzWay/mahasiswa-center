"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { LandingHeader } from "@/components/home/LandingHeader";
import { LandingHero } from "@/components/home/LandingHero";
import { LandingFeatures } from "@/components/home/LandingFeatures";
import { LandingCallToAction } from "@/components/home/LandingCallToAction";
import { LandingLoading } from "@/components/home/LandingLoading";

export default function LandingHome() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoading(true);
        setTimeout(() => router.push("/pages/dashboard"), 800);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) return <LandingLoading />;

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingCallToAction />
    </main>
  );
}
