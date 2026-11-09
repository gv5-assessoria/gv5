import { buscarPostsEmpresa } from "@/integrations/supabase/client";
import BlogDestaqueConteudo from "./Conteudo";

// Busca no servidor (antes era no navegador): os 3 últimos artigos vão no HTML da home, legíveis pelo Google e pelas IAs.
// Sem posts ou com falha no banco, a seção some.
export default async function BlogDestaque() {
  const posts = await buscarPostsEmpresa();
  if (posts.length === 0) return null;
  // Só os campos do card: o conteúdo completo do artigo não precisa ir para o navegador.
  const cards = posts.slice(0, 3).map((p) => ({ ...p, content: "" }));
  return <BlogDestaqueConteudo posts={cards} />;
}
