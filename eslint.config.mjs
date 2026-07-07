import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
    ...nextVitals,
    {
        rules: {
            "react-hooks/set-state-in-effect": "off",
        },
    },
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
        ],
    },
];

export default eslintConfig;
