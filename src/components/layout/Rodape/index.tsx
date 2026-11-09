"use client";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import Link from "next/link";
import { CNPJ, INSTAGRAM, RAZAO_SOCIAL, WHATSAPP_EXIBICAO, linkWhatsApp } from "@/lib/site";
import styles from "./style.module.css";

const MENSAGEM_WHATSAPP = "Olá! Vim pelo site da GV5 e quero falar sobre o marketing do meu negócio.";

export default function Rodape() {
  return (
    <footer className={styles.rodape}>
      <div className="container">
        <div className={styles.gradePrincipal}>
          <div className={styles.colunaInstitucional}>
            <Image
              src="/logo.png"
              alt="GV5 Assessoria"
              width={90}
              height={32}
              className={styles.logoRodape}
            />
            <p className={styles.descricaoInstitucional}>
              Engenharia estratégica, tráfego de alta precisão e criatividade direcionada à geração de lucro e autoridade duradoura.
            </p>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconeInstagram}
              aria-label="Instagram da GV5"
            >
              <FaInstagram size={18} />
            </a>
          </div>

          <div className={styles.colunaLinks}>
            <div className={styles.tituloColuna}>Navegação</div>
            <a href="/#inicio" className={styles.linkItem}>Início</a>
            <a href="/#clientes" className={styles.linkItem}>Cases de Sucesso</a>
            <a href="/#metodo" className={styles.linkItem}>Nossa Metodologia</a>
            <a href="/#sobre" className={styles.linkItem}>Sobre a GV5</a>
          </div>

          <div className={styles.colunaLinks}>
            <div className={styles.tituloColuna}>Soluções</div>
            <a href="/#servicos" className={styles.linkItem}>Serviços Integrados</a>
            <a href="/#faq" className={styles.linkItem}>Dúvidas Frequentes</a>
            <a href="/#inicio" className={styles.linkItem}>Diagnóstico Comercial</a>
          </div>

          <div className={styles.colunaContato}>
            <div className={styles.tituloColuna}>Canal Executivo</div>
            <p className={styles.textoContato}>
              Fale agora com nosso time e avalie a prontidão da sua empresa para acelerar no mercado.
            </p>
            <a
              href={linkWhatsApp(MENSAGEM_WHATSAPP)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkWhatsapp}
            >
              <span>{WHATSAPP_EXIBICAO}</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <div className={styles.faixaInferior}>
          <div className={styles.selosParceiros}>
            <div className={styles.cardSelo}>
              <Image
                src="/google-Partner.png"
                alt="Google Partner"
                width={100}
                height={30}
                className={styles.imagemSelo}
              />
            </div>
            <div className={styles.cardSelo}>
              <Image
                src="/meta-Business.png"
                alt="Meta Business Partner"
                width={100}
                height={30}
                className={styles.imagemSelo}
              />
            </div>
          </div>
          <div className={styles.textoCopyright}>
            {new Date().getFullYear()} © {RAZAO_SOCIAL}. CNPJ: <span className={styles.cnpjDestaque}>{CNPJ}</span>. Todos os direitos reservados.
            <nav className={styles.linksLegais} aria-label="Links legais">
              <Link href="/privacidade">Política de Privacidade</Link>
              <Link href="/termos">Termos de Uso</Link>
            </nav>
          </div>
        </div>
      </div>

      <a
        href={linkWhatsApp(MENSAGEM_WHATSAPP)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.botaoWhatsappFlutuante}
        aria-label="Falar no WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>
    </footer>
  );
}
