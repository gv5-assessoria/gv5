import type { MetadataRoute } from "next";
import { URL_SITE } from "@/lib/site";
import { buscarPostsEmpresa } from "@/integrations/supabase/client";

// Mesma revalidação do blog: post novo entra no sitemap em até 5 minutos.
export const revalidate = 300;

// Data fixa para as páginas do código (não new Date()): só muda quando o conteúdo muda de verdade.
const ATUALIZACAO = new Date("2026-11-09");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await buscarPostsEmpresa();
  const maisRecente = posts[0]?.published_at ? new Date(posts[0].published_at) : ATUALIZACAO;
  return [
    { url: URL_SITE, lastModified: ATUALIZACAO, changeFrequency: "monthly", priority: 1 },
    { url: `${URL_SITE}/blog`, lastModified: maisRecente, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((post) => ({
      url: `${URL_SITE}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || ATUALIZACAO),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${URL_SITE}/privacidade`, lastModified: ATUALIZACAO, changeFrequency: "yearly", priority: 0.2 },
    { url: `${URL_SITE}/termos`, lastModified: ATUALIZACAO, changeFrequency: "yearly", priority: 0.2 },
  ];
}
