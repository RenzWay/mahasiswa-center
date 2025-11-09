"use client";
import {motion} from "framer-motion";

export function LoadingDashboard() {
    return (
        <div
            className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="relative w-28 h-28">
                {/* Outer glow ring */}
                <motion.div
                    animate={{rotate: 360}}
                    transition={{repeat: Infinity, duration: 3, ease: "linear"}}
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 shadow-lg"
                />
                {/* Middle ring */}
                <motion.div
                    animate={{rotate: -360}}
                    transition={{repeat: Infinity, duration: 2.5, ease: "linear"}}
                    className="absolute inset-2 rounded-full border-4 border-transparent border-b-pink-500 border-l-indigo-500 opacity-80"
                />
                {/* Inner pulsing orb */}
                <motion.div
                    animate={{scale: [1, 1.2, 1]}}
                    transition={{repeat: Infinity, duration: 1.8, ease: "easeInOut"}}
                    className="absolute inset-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                >
                    <div className="w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-inner"/>
                </motion.div>
            </div>

            {/* Text with subtle shimmer */}
            <motion.p
                initial={{opacity: 0.3}}
                animate={{opacity: [0.3, 1, 0.3]}}
                transition={{repeat: Infinity, duration: 2}}
                className="mt-12 text-gray-700 dark:text-gray-300 font-semibold text-lg tracking-wide"
            >
                Loading Dashboard...
            </motion.p>
        </div>
    );
}
