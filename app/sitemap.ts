import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const now = new Date();

  // Test ID lari
  const testIds = ["1", "2", "3", "4", "5", "6"];

  const testEntries: MetadataRoute.Sitemap = testIds.map((id) => ({
    url: `${baseUrl}/tests/${id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          uz: baseUrl,
          ru: `${baseUrl}?lang=ru`,
          en: `${baseUrl}?lang=en`,
        },
      },
    },
    {
      url: `${baseUrl}/tests`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...testEntries,
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
