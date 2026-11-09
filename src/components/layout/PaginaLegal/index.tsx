import Link from "next/link";
import Cabecalho from "@/components/layout/Cabecalho";
import Rodape from "@/components/layout/Rodape";
import styles from "./style.module.css";

// Moldura das páginas de texto (privacidade, termos): cabeçalho, título, data e o conteúdo com tipografia de leitura.
export default function PaginaLegal({ titulo, atualizadoEm, children }: { titulo: string; atualizadoEm: string; children: React.ReactNode }) {
  return (
    <>
      <Cabecalho />
      <main className={styles.secao}>
        <div className={`container ${styles.largura}`}>
          <Link href="/" className={styles.voltar}>← Voltar para o início</Link>
          <h1 className={styles.titulo}>{titulo}</h1>
          <p className={styles.data}>Última atualização: {atualizadoEm}</p>
          <div className={styles.texto}>{children}</div>
        </div>
      </main>
      <Rodape />
    </>
  );
}
