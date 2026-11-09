import type { MetadataRoute } from "next";
import { URL_SITE } from "@/lib/site";

// busca/citação: OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User
// treino: GPTBot, ClaudeBot, Google-Extended, Applebot-Extended (bloquear só esses se não quiser treino)
const ROBOS_DE_IA = [
  "OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User",
  "GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // /api/ é a rota do formulário: não é página.
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...ROBOS_DE_IA.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] })),
    ],
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
