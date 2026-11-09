import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buscarPostPorSlug, buscarPostsEmpresa } from "@/integrations/supabase/client";
import Cabecalho from "@/components/layout/Cabecalho";
import Rodape from "@/components/layout/Rodape";
import Faiscas from "@/components/effects/Faiscas";
import { sanitizarHtml } from "@/lib/sanitizarHtml";
import { URL_SITE, NOME, LOGO, IMAGEM_COMPARTILHAMENTO } from "@/lib/site";
import { Calendar, ArrowLeft, ArrowUpRight } from "lucide-react";
import styles from "./style.module.css";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Post publicado ou editado no painel aparece em até 5 minutos. Slug novo é gerado na primeira visita (dynamicParams padrão).
export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await buscarPostsEmpresa();
  return posts.map((post) => ({ slug: post.slug }));
}

// Capa em Base64 não serve para compartilhar (WhatsApp e redes exigem URL): nesse caso usa a imagem padrão do site.
function imagemPublica(capa?: string) {
  return capa && /^https?:\/\//i.test(capa) ? capa : IMAGEM_COMPARTILHAMENTO;
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await buscarPostPorSlug(slug);

  if (!post) {
    return { title: "Artigo não encontrado | GV5 Assessoria", robots: { index: false } };
  }

  const descricao = post.excerpt || "Leia o artigo completo na GV5 Assessoria.";
  const caminho = `/blog/${post.slug}`;
  return {
    title: post.title + " | GV5 Assessoria",
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      type: "article",
      title: post.title,
      description: descricao,
      url: caminho,
      siteName: NOME,
      locale: "pt_BR",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      images: [{ url: imagemPublica(post.cover_image), alt: post.title }],
    },
  };
}

export default async function ArtigoIndividualPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await buscarPostPorSlug(slug);

  if (!post) {
    notFound();
  }

  const dataFormatada = post.published_at ? formatarData(post.published_at) : "Data recente";
  // Mostra "Atualizado em" só quando a edição foi em outro dia que a publicação.
  const dataAtualizacao =
    post.updated_at && post.published_at && formatarData(post.updated_at) !== dataFormatada
      ? formatarData(post.updated_at)
      : null;

  const url = `${URL_SITE}/blog/${post.slug}`;
  const imagem = imagemPublica(post.cover_image);
  const schemaArtigo = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    image: imagem.startsWith("http") ? imagem : `${URL_SITE}${imagem}`,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: NOME, url: URL_SITE },
    publisher: { "@type": "Organization", name: NOME, logo: { "@type": "ImageObject", url: `${URL_SITE}${LOGO}` } },
  };
  const schemaTrilha = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: URL_SITE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${URL_SITE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  // "Leia também": até 3 outros artigos (link interno).
  const outros = (await buscarPostsEmpresa()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArtigo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaTrilha) }} />
      <Faiscas />
      <Cabecalho />
      <main className={styles.paginaArtigo}>
        <div className="container">
          <Link href="/blog" className={styles.botaoVoltar}>
            <ArrowLeft size={16} />
            <span>Voltar para todos os artigos</span>
          </Link>

          <article className={styles.artigoCompleto}>
            <header className={styles.cabecalhoArtigo}>
              <div className={styles.metaSuperior}>
                <span className={styles.itemData}>
                  <Calendar size={14} />
                  {post.published_at ? (
                    <time dateTime={post.published_at}>{dataFormatada}</time>
                  ) : (
                    <span>{dataFormatada}</span>
                  )}
                </span>
                {dataAtualizacao && post.updated_at && (
                  <span className={styles.itemData}>
                    Atualizado em <time dateTime={post.updated_at}>{dataAtualizacao}</time>
                  </span>
                )}
                {post.category && (
                  <span className={styles.categoriaBadge}>{post.category}</span>
                )}
              </div>

              <h1 className={styles.tituloPrincipal}>{post.title}</h1>

              {post.excerpt && (
                <p className={styles.subtituloArtigo}>{post.excerpt}</p>
              )}
            </header>

            {post.cover_image && (
              <div className={styles.envolturaCapa}>
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className={styles.imagemCapa}
                />
              </div>
            )}

            {/* HTML do painel passa pelo sanitizador antes de ir para a página (lib/sanitizarHtml.ts) */}
            <div
              className={styles.conteudoRico}
              dangerouslySetInnerHTML={{ __html: sanitizarHtml(post.content) }}
            />

            {/* CTA Final de Conversão do Artigo */}
            <div className={styles.caixaCtaConversao}>
              <div className={styles.textosCta}>
                <h2 className={styles.tituloCta}>
                  Pronto para transformar seu restaurante em uma máquina de vendas?
                </h2>
                <p className={styles.descricaoCta}>
                  Agende um diagnóstico comercial gratuito com um assessor sênior da GV5 e descubra os pontos cegos de lucro da sua operação.
                </p>
              </div>
              <a href="/#inicio" className={styles.botaoAcaoCta}>
                <span>Solicitar Diagnóstico Comercial</span>
                <ArrowUpRight size={18} />
              </a>
            </div>
          </article>

          {outros.length > 0 && (
            <nav className={styles.leiaTambem} aria-label="Leia também">
              <h2 className={styles.tituloLeiaTambem}>Leia também</h2>
              <ul className={styles.listaLeiaTambem}>
                {outros.map((p) => (
                  <li key={p.id}>
                    <Link href={"/blog/" + p.slug}>{p.title}</Link>
                  </li>
                ))}
              </ul>
              <Link href="/blog" className={styles.botaoVoltar}>Ver todos os artigos</Link>
            </nav>
          )}
        </div>
      </main>
      <Rodape />
    </>
  );
}
