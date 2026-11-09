import sanitizeHtml from "sanitize-html";

// O conteúdo dos artigos vem do painel GV5 Insight em HTML. Mesmo que o painel limpe, o site limpa de novo antes de exibir
// (script, evento onclick, iframe e estilo inline saem). Mantém títulos, listas, links, imagens, tabelas e ícones SVG simples.
// O título do artigo já é o único h1 da página: um <h1> que venha do conteúdo vira <h2>.
const SVG = ["svg", "path", "circle", "rect", "line", "polyline", "polygon", "g"];
const ATRIBUTOS_SVG = ["viewbox", "viewBox", "width", "height", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "d", "cx", "cy", "r", "x", "y", "x1", "y1", "x2", "y2", "points", "xmlns", "class", "aria-hidden"];

export function sanitizarHtml(html: string): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "h1", "h2", "figure", "figcaption", "span", ...SVG],
    allowedAttributes: {
      a: ["href", "target", "rel", "title"],
      img: ["src", "alt", "width", "height", "loading", "title"],
      span: ["class"],
      div: ["class"],
      p: ["class"],
      ...Object.fromEntries(SVG.map((tag) => [tag, ATRIBUTOS_SVG])),
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https", "data"] },
    transformTags: {
      h1: "h2",
      a: (tagName, attribs) => {
        const externo = /^https?:\/\//i.test(attribs.href ?? "");
        return {
          tagName,
          attribs: externo ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs,
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", alt: attribs.alt ?? "" } }),
    },
  });
}
