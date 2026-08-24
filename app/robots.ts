import type { MetadataRoute } from "next";

// AI scrapers and LLM training crawlers to block
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "Bytespider",
  "CCBot",
  "omgili",
  "omgilibot",
  "FacebookBot",
  "Diffbot",
  "ImagesiftBot",
  "cohere-ai",
  "PerplexityBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Block all AI scrapers and LLM training bots
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
      // Standard crawlers — allow public pages only
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/dashboard/", "/api/"],
      },
    ],
    sitemap: "https://proxigo.ai/sitemap.xml",
  };
}
