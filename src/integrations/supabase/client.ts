import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://altqnqmdfezqfbudgajg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsdHFucW1kZmV6cWZidWRnYWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0Mzc1OTcsImV4cCI6MjEwNDAxMzU5N30.CvlFbFtlMygUcm8byGA4tVD84CGCZR-9RCuLU3oXqZc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Empresa cujos posts aparecem no blog (tabela companies do painel GV5 Insight). Um lugar só.
const SLUG_EMPRESA = "gv5";

export interface Post {
  id: string;
  company_id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  published_at?: string;
  updated_at?: string;
  status: string;
  category?: string;
}

// Busca defensiva dos posts da empresa 'gv5'
export async function buscarPostsEmpresa(): Promise<Post[]> {
  try {
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", SLUG_EMPRESA)
      .eq("status", "active")
      .single();

    if (companyError || !company) {
      console.warn("Empresa 'gv5' não encontrada ou inativa no Supabase.");
      return [];
    }

    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select("*")
      .eq("company_id", company.id)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (postsError || !posts) {
      console.warn("Erro ao buscar publicações:", postsError?.message);
      return [];
    }

    return posts as Post[];
  } catch (err) {
    console.error("Falha defensiva ao consultar posts do blog:", err);
    return [];
  }
}

// Busca defensiva de post individual pelo slug
export async function buscarPostPorSlug(slug: string): Promise<Post | null> {
  try {
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("id")
      .eq("slug", SLUG_EMPRESA)
      .eq("status", "active")
      .single();

    if (companyError || !company) return null;

    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("company_id", company.id)
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (postError || !post) return null;

    return post as Post;
  } catch (err) {
    console.error("Falha defensiva ao consultar post por slug:", err);
    return null;
  }
}
