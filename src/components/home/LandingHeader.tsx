"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-slate-950 text-white">
            <LayoutDashboard className="size-4" />
          </span>
          <span className="text-base font-bold">Mahasiswa Center</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="hover:text-slate-950">
            Fitur
          </a>
          <a href="#preview" className="hover:text-slate-950">
            Preview
          </a>
          <a href="#start" className="hover:text-slate-950">
            Mulai
          </a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost">
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">
              Mulai Gratis
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-medium text-slate-700">
            <a href="#features" onClick={() => setOpen(false)}>
              Fitur
            </a>
            <a href="#preview" onClick={() => setOpen(false)}>
              Preview
            </a>
            <a href="#start" onClick={() => setOpen(false)}>
              Mulai
            </a>
            <Button asChild className={"mt-2"}>
              <Link href="/auth/register">Mulai Gratis</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
