"use client";
import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import styles from "./style.module.css";
import { ITENS_FAQ } from "./itens";

export default function Faq() {
  const gradeRef = useScrollAnimation<HTMLDivElement>({
    distanciaY: 30,
    atrasoStagger: 120,
    duracao: 1050,
    triggerRatio: 0.40,
  });

  const [itemAberto, setItemAberto] = useState<number | null>(0);
  const alternarItem = (indice: number) => setItemAberto(itemAberto === indice ? null : indice);

  return (
    <section className={styles.secaoFaq} id="faq">
      <div className="container">
        <div className={styles.gradeConteudo} ref={gradeRef}>
          <div className={styles.colunaTextos}>
            <div className={styles.etiquetaDestaque}>Transparência e Parceria</div>
            <h2 className={styles.tituloSecao}>Perguntas Frequentes</h2>
            <p className={styles.descricaoSecao}>
              Tudo o que você precisa saber sobre o modelo de atuação e os impactos da GV5 no seu negócio.
            </p>
          </div>

          <div className={styles.listaAcordeao}>
            {ITENS_FAQ.map((item, index) => {
              const aberto = itemAberto === index;
              return (
                <div key={index} className={styles.itemAcordeao}>
                  <button type="button" className={styles.botaoPergunta} onClick={() => alternarItem(index)}>
                    <div className={styles.blocoIconeTexto}>
                      <span className={styles.iconePergunta}><HelpCircle size={15} /></span>
                      <span className={styles.textoPergunta}>{item.pergunta}</span>
                    </div>
                    <span className={styles.setaAcordeao + " " + (aberto ? styles.setaAberta : "")}>
                      <ChevronDown size={17} />
                    </span>
                  </button>
                  {aberto && (<div className={styles.corpoResposta}><p>{item.resposta}</p></div>)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
