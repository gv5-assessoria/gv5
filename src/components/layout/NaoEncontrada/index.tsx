import Link from "next/link";
import Cabecalho from "@/components/layout/Cabecalho";
import Rodape from "@/components/layout/Rodape";
import { linkWhatsApp } from "@/lib/site";
import styles from "./style.module.css";

// Visual da 404 (app/not-found.tsx). Leva de volta para a home, para o blog ou para o WhatsApp.
export default function NaoEncontrada() {
  return (
    <>
      <Cabecalho />
      <main className={styles.secao}>
        <div className={`container ${styles.conteudo}`}>
          <span className={styles.codigo} aria-hidden="true">404</span>
          <h1 className={styles.titulo}>Essa página não existe.</h1>
          <p className={styles.texto}>O endereço que você procurou não existe ou mudou de lugar.</p>
          <div className={styles.acoes}>
            <Link href="/" className={styles.principal}>Voltar para o início</Link>
            <Link href="/blog" className={styles.secundario}>Ver o blog</Link>
            <a
              href={linkWhatsApp("Olá! Vim pelo site da GV5 e gostaria de mais informações.")}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secundario}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Rodape />
    </>
  );
}
