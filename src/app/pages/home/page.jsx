import { AuthRedirect } from "@/components/home/AuthRedirect";
import { LandingHeader } from "@/components/home/LandingHeader";
import { LandingHero } from "@/components/home/LandingHero";
import { LandingFeatures } from "@/components/home/LandingFeatures";
import { LandingCallToAction } from "@/components/home/LandingCallToAction";

export default function LandingHome() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <AuthRedirect />
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingCallToAction />
    </main>
  );
}
