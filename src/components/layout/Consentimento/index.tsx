"use client";
import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import { GTM_ID } from "@/lib/site";
import { guardarOrigem, enviarEvento } from "@/lib/origem";
import styles from "./style.module.css";

// GTM só carrega depois do "Aceitar" (Consent Mode v2). Sem GTM_ID (lib/site.ts) não há rastreador, então não há banner.
// O clique no WhatsApp vai para o dataLayer sempre: é só um array na página; quem lê é o GTM, que só existe com aceite.
const CHAVE = "gv5-consentimento";
type Escolha = "aceito" | "recusado" | null;

const ouvintes = new Set<() => void>();
function lerEscolha(): Escolha {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}
function gravarEscolha(v: "aceito" | "recusado") {
  try { localStorage.setItem(CHAVE, v); } catch {}
  ouvintes.forEach((f) => f());
}
const assinar = (f: () => void) => {
  ouvintes.add(f);
  return () => { ouvintes.delete(f); };
};
// No servidor devolve 'recusado' para não piscar o banner antes da hidratação.
const escolhaServidor = (): Escolha => "recusado";

export default function Consentimento() {
  const escolha = useSyncExternalStore(assinar, lerEscolha, escolhaServidor);

  useEffect(() => {
    guardarOrigem();
    const aoClicar = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href*="wa.me/"]');
      if (!link) return;
      enviarEvento("clique_whatsapp", {
        secao:
          link.closest("section[id]")?.id ??
          (link.closest("footer") ? "rodape" : link.closest("header,nav") ? "menu" : "outro"),
        texto_botao: (link.textContent ?? "").trim().slice(0, 80) || link.getAttribute("aria-label") || "",
      });
    };
    document.addEventListener("click", aoClicar, { capture: true });
    return () => document.removeEventListener("click", aoClicar, { capture: true });
  }, []);

  if (!GTM_ID) return null;

  return (
    <>
      {escolha === "aceito" && (
        <Script id="gtm" strategy="afterInteractive">{`
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});
        `}</Script>
      )}
      {escolha === null && (
        <div className={styles.banner} role="region" aria-label="Aviso de cookies">
          <p className={styles.texto}>
            Usamos cookies para medir as visitas e melhorar nossos anúncios. Saiba mais na{" "}
            <Link href="/privacidade#cookies">Política de Privacidade</Link>.
          </p>
          <div className={styles.acoes}>
            <button type="button" className={styles.recusar} onClick={() => gravarEscolha("recusado")}>Recusar</button>
            <button type="button" className={styles.aceitar} onClick={() => gravarEscolha("aceito")}>Aceitar</button>
          </div>
        </div>
      )}
    </>
  );
}
