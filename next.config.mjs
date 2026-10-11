import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tiptap and its ProseMirror wrappers must resolve the same model module.
  // A duplicate class identity makes operations such as Enter fail at runtime.
  turbopack: {
    resolveAlias: {
      "prosemirror-model": path.resolve(
        process.cwd(),
        "node_modules/prosemirror-model/dist/index.js",
      ),
    },
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "prosemirror-model": path.resolve(
        process.cwd(),
        "node_modules/prosemirror-model/dist/index.js",
      ),
    };
    return config;
  },
};

export default nextConfig;
