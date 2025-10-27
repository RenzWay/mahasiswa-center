"use client";

import {AnimatePresence, motion} from "framer-motion";
import {usePathname} from "next/navigation";

export default function PageTransition({children}) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div>
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
