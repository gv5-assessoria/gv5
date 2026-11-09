// Dados da empresa usados no SEO, no schema, nas páginas legais e no rodapé. Um lugar só para não divergir.
// TODO: confirmar o domínio. Tirado do README do repositório gv5-assessoria (links para gv5assessoria.com.br); trocar aqui se o endereço final for outro.
export const URL_SITE = "https://gv5assessoria.com.br";
export const NOME = "GV5 Assessoria";
// Nome que aparece hoje no rodapé. TODO: confirmar a razão social exata do CNPJ abaixo (o site só mostra o nome fantasia).
export const RAZAO_SOCIAL = "GV5 Assessoria de Marketing Digital";
export const CNPJ = "64.530.042/0001-17";
export const ATUALIZADO_EM = "09/11/2026";
export const WHATSAPP = "5511989437638";
export const WHATSAPP_EXIBICAO = "(11) 98943-7638";
export const TELEFONE = "+55-11-98943-7638";
// TODO: perfil do Instagram (o rodapé linka só "instagram.com", sem o @ da GV5).
export const INSTAGRAM = "https://instagram.com";
// TODO: e-mail de contato para pedidos de LGPD (não informado).
export const EMAIL = "";
// TODO: endereço da sede e cidade/região atendida, se forem aparecer (o texto da seção Quem Somos cita "o ABC").
export const ENDERECO = "";
// TODO: ID do contêiner do Google Tag Manager (GTM-XXXXXXX). Vazio = não carrega GTM nem mostra o banner de cookies.
// A variável de ambiente NEXT_PUBLIC_GTM_ID, se existir, tem prioridade.
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";
// Imagem padrão de compartilhamento (WhatsApp, redes) e logo usada no schema.
export const IMAGEM_COMPARTILHAMENTO = "/essenciais/compartilhamento.jpg";
export const LOGO = "/logo.png";
// Open Graph de cada página: o Next troca o objeto openGraph inteiro (não mescla com o do layout), por isso cada página repete a imagem.
export const OG_IMAGENS = [{ url: IMAGEM_COMPARTILHAMENTO, width: 1200, height: 630, alt: "Fundadores da GV5 Assessoria comemorando resultados" }];
export const ogPagina = (titulo: string, descricao: string, url: string) => ({
  title: titulo, description: descricao, url, siteName: NOME, locale: "pt_BR", type: "website" as const, images: OG_IMAGENS,
});

export const linkWhatsApp = (mensagem: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

// Redes que entram no "sameAs" do schema: só as que têm perfil de verdade (não o link genérico).
export const REDES = [INSTAGRAM].filter((url) => /instagram\.com\/[^/]+/.test(url));
