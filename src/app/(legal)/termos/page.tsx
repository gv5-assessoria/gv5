import type { Metadata } from "next";
import Link from "next/link";
import PaginaLegal from "@/components/layout/PaginaLegal";
import { NOME, RAZAO_SOCIAL, CNPJ, ENDERECO, ATUALIZADO_EM, WHATSAPP_EXIBICAO, linkWhatsApp, ogPagina } from "@/lib/site";

const TITULO = "Termos de Uso | GV5 Assessoria";
const DESCRICAO = "Termos de uso do site da GV5 Assessoria: quem oferece os serviços, como funcionam proposta e contratação, uso do conteúdo e responsabilidades.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/termos" },
  openGraph: ogPagina(TITULO, DESCRICAO, "/termos"),
};

// Texto base montado pelo checklist (CDC + Decreto 7.962/2013). O site não vende: a contratação é feita depois do diagnóstico, com contrato próprio.
export default function Termos() {
  return (
    <PaginaLegal titulo="Termos de Uso" atualizadoEm={ATUALIZADO_EM}>
      <p>Ao usar este site, você concorda com estes termos. Se não concordar, não use o site.</p>

      <h2>Quem oferece os serviços</h2>
      <p>
        <strong>{RAZAO_SOCIAL}</strong>, CNPJ {CNPJ}{ENDERECO ? `, ${ENDERECO}` : ""}. Contato: WhatsApp{" "}
        <a href={linkWhatsApp("Olá! Tenho uma dúvida sobre os termos do site.")} target="_blank" rel="noopener noreferrer">{WHATSAPP_EXIBICAO}</a>.
      </p>

      <h2>O que é este site</h2>
      <p>Este site apresenta a {NOME}, o método de trabalho, os serviços, os planos e artigos sobre marketing. Não fazemos venda nem pagamento pelo site: o formulário só pede um contato para o diagnóstico comercial, e a contratação acontece depois, com proposta e contrato próprios.</p>

      <h2>Resultados e condições</h2>
      <ul>
        <li>Resultados, números e cases mostrados no site servem de referência. Cada negócio tem um resultado diferente, que depende do mercado, do produto, do investimento e da operação. Não garantimos um resultado específico.</li>
        <li>Valores, escopo e prazos dos serviços são definidos na proposta e no contrato, e valem sobre qualquer informação do site.</li>
      </ul>

      <h2>Uso do conteúdo</h2>
      <p>A marca, os textos, as fotos, os vídeos e os artigos deste site pertencem à {NOME} ou são usados com autorização (incluindo as marcas dos clientes mostradas nos cases). Não é permitido copiar ou usar esse conteúdo sem autorização por escrito. Citar um artigo com link para a página original é permitido.</p>

      <h2>Responsabilidades</h2>
      <ul>
        <li>Fazemos o possível para manter as informações certas e atualizadas, mas o site pode ter erros ou ficar fora do ar por um tempo.</li>
        <li>Os artigos do blog são informativos e não substituem uma análise do seu caso.</li>
        <li>Os links para sites de terceiros (WhatsApp, Instagram) seguem as regras desses sites.</li>
        <li>O tratamento dos seus dados está na <Link href="/privacidade">Política de Privacidade</Link>.</li>
      </ul>

      <h2>Foro</h2>
      {/* TODO: trocar pela comarca da sede quando o endereço for informado (ENDERECO em lib/site.ts). */}
      <p>Fica eleito o foro da comarca da sede da {NOME}, ressalvado o direito do consumidor de escolher o foro do próprio domicílio.</p>
    </PaginaLegal>
  );
}
