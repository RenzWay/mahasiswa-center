const siteUrl = "https://mahasiswa-center.vercel.app";

export default function sitemap() {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
