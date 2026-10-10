const siteUrl = "https://mahasiswa-center.vercel.app";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/pages/dashboard", "/task", "/schedule", "/note", "/test"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
