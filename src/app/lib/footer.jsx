"use client";

import {Github} from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t mt-auto w-full py-4 text-center text-sm text-muted-foreground transition-all">
            <p className="flex items-center justify-center gap-2">
                Made with ❤️ by
                <span className="font-semibold text-foreground hover:text-primary transition-colors">
          RenzWay
        </span>
                🚀
                <a
                    href="https://github.com/RenzWay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                    <Github className="w-4 h-4"/>
                    <span className="underline underline-offset-2">GitHub</span>
                </a>
            </p>
        </footer>
    );
}
