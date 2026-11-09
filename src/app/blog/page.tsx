import type { Metadata } from "next";
import Link from "next/link";
import { buscarPostsEmpresa } from "@/integrations/supabase/client";
import { ogPagina } from "@/lib/site";
import Cabecalho from "@/components/layout/Cabecalho";
import Rodape from "@/components/layout/Rodape";
import Faiscas from "@/components/effects/Faiscas";
import { Calendar, ArrowRight } from "lucide-react";
import styles from "./style.module.css";

const TITULO = "Blog & Conteúdos Estratégicos | GV5 Assessoria";
const DESCRICAO = "Artigos práticos sobre escala gastronômica, tráfego pago para restaurantes, engenharia de cardápio e ROI comprovado.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/blog" },
  openGraph: ogPagina(TITULO, DESCRICAO, "/blog"),
};

// Post publicado ou editado no painel GV5 Insight aparece aqui em até 5 minutos, sem deploy.
export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await buscarPostsEmpresa();

  return (
    <>
      <Faiscas />
      <Cabecalho />
      <main className={styles.paginaBlog}>
        <div className="container">
          <div className={styles.cabecalhoSecao}>
            <span className={styles.etiqueta}>Central de Conteúdo</span>
            <h1 className={styles.tituloPrincipal}>Blog & Inteligência Comercial</h1>
            <p className={styles.subtitulo}>
              Metodologias, estudos de caso e insights estratégicos para transformar seu restaurante em uma máquina de vendas.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className={styles.estadoVazio}>
              <h3>Nenhum artigo publicado no momento</h3>
              <p>Novos materiais estratégicos estão sendo preparados pela nossa equipe. Volte em breve!</p>
              <Link href="/" className={styles.botaoVoltar}>
                Voltar à página inicial
              </Link>
            </div>
          ) : (
            <div className={styles.gradeCards}>
              {posts.map((post) => {
                const dataFormatada = post.published_at
                  ? new Date(post.published_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recente";

                return (
                  <article key={post.id} className={styles.cardArtigo}>
                    <Link href={"/blog/" + post.slug} className={styles.linkCapa}>
                      {post.cover_image ? (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className={styles.imagemCapa}
                          loading="lazy"
                        />
                      ) : (
                        <div className={styles.placeholderCapa}>
                          <span>GV5 Content</span>
                        </div>
                      )}
                    </Link>

                    <div className={styles.corpoCard}>
                      <div className={styles.metaInfo}>
                        <div className={styles.dataPublicacao}>
                          <Calendar size={13} />
                          <span>{dataFormatada}</span>
                        </div>
                        {post.category && (
                          <span className={styles.badgeCategoria}>{post.category}</span>
                        )}
                      </div>

                      <h2 className={styles.tituloCard}>
                        <Link href={"/blog/" + post.slug}>{post.title}</Link>
                      </h2>

                      {post.excerpt && (
                        <p className={styles.resumoCard}>{post.excerpt}</p>
                      )}

                      <Link href={"/blog/" + post.slug} className={styles.linkLeitura}>
                        <span>Ler publicação</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Rodape />
    </>
  );
}
