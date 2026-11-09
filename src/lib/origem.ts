// Origem da visita (UTM, gclid, fbclid): lida na primeira página, guardada na sessão do navegador
// e mandada junto com o clique no WhatsApp e com o envio do formulário. Só roda no navegador.
const CHAVE_ORIGEM = "gv5-origem";
const PARAMETROS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

export type Origem = Record<string, string>;
type Janela = Window & { dataLayer?: Record<string, unknown>[] };

// Grava só quando a URL traz parâmetros: navegar entre páginas do site não apaga a origem da visita.
export function guardarOrigem() {
  const busca = new URLSearchParams(window.location.search);
  const origem: Origem = {};
  PARAMETROS.forEach((p) => {
    const v = busca.get(p);
    if (v) origem[p] = v.slice(0, 150);
  });
  if (Object.keys(origem).length) {
    try { sessionStorage.setItem(CHAVE_ORIGEM, JSON.stringify(origem)); } catch {}
  }
}

export function lerOrigem(): Origem {
  try { return JSON.parse(sessionStorage.getItem(CHAVE_ORIGEM) ?? "{}"); } catch { return {}; }
}

// O dataLayer é só um array na página: quem lê é o GTM, que só carrega depois do "Aceitar".
export function enviarEvento(evento: string, dados: Record<string, unknown> = {}) {
  const w = window as Janela;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: evento, pagina: window.location.pathname, ...dados, ...lerOrigem() });
}
