import type { Metadata } from "next";
import Cabecalho from "@/components/layout/Cabecalho";
import Rodape from "@/components/layout/Rodape";
import Faiscas from "@/components/effects/Faiscas";
import FormularioInicial from "@/components/sections/FormularioInicial";
import Hero from "@/components/sections/Hero";
import Clientes from "@/components/sections/Clientes";
import QuemSomos from "@/components/sections/QuemSomos";
import Metodo from "@/components/sections/Metodo";
import Servicos from "@/components/sections/Servicos";
import Planos from "@/components/sections/Planos";
import TimeExclusivo from "@/components/sections/TimeExclusivo";
import BlogDestaque from "@/components/sections/BlogDestaque";
import Faq from "@/components/sections/Faq";
import { ITENS_FAQ } from "@/components/sections/Faq/itens";
import { URL_SITE, NOME, RAZAO_SOCIAL, CNPJ, TELEFONE, LOGO, IMAGEM_COMPARTILHAMENTO, REDES, EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Os artigos em destaque vêm do painel GV5 Insight: post novo aparece em até 5 minutos, sem deploy.
export const revalidate = 300;

// Schema enxuto e igual ao que está visível: empresa (nome, telefone, CNPJ) e as perguntas do FAQ.
const schemaEmpresa = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${URL_SITE}/#empresa`,
  name: NOME,
  legalName: RAZAO_SOCIAL,
  taxID: CNPJ,
  url: URL_SITE,
  logo: `${URL_SITE}${LOGO}`,
  image: `${URL_SITE}${IMAGEM_COMPARTILHAMENTO}`,
  telephone: TELEFONE,
  description: "Assessoria de marketing digital com tráfego pago focado em vendas para restaurantes e delivery.",
  ...(EMAIL ? { email: EMAIL } : {}),
  ...(REDES.length ? { sameAs: REDES } : {}),
};

const schemaFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ITENS_FAQ.map((item) => ({
    "@type": "Question",
    name: item.pergunta,
    acceptedAnswer: { "@type": "Answer", text: item.resposta },
  })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaEmpresa) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }} />
      <Faiscas />
      <Cabecalho />
      <main>
        <FormularioInicial />
        <Hero />
        <Clientes />
        <QuemSomos />
        <Metodo />
        <Servicos />
        <Planos />
        <TimeExclusivo />
        <BlogDestaque />
        <Faq />
      </main>
      <Rodape />
    </>
  );
}
