import type { Metadata } from "next";
import PaginaLegal from "@/components/layout/PaginaLegal";
import { NOME, RAZAO_SOCIAL, CNPJ, ENDERECO, ATUALIZADO_EM, WHATSAPP_EXIBICAO, EMAIL, linkWhatsApp, ogPagina } from "@/lib/site";

const TITULO = "Política de Privacidade | GV5 Assessoria";
const DESCRICAO = "Como a GV5 Assessoria trata os dados do formulário de diagnóstico e da navegação no site: o que coletamos, para quê, com quem compartilhamos e como pedir exclusão.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRICAO,
  alternates: { canonical: "/privacidade" },
  openGraph: ogPagina(TITULO, DESCRICAO, "/privacidade"),
};

// Texto base montado pelo checklist da LGPD (art. 9). Revisar com o jurídico antes de publicar.
export default function Privacidade() {
  return (
    <PaginaLegal titulo="Política de Privacidade" atualizadoEm={ATUALIZADO_EM}>
      <p>Esta política explica como a {NOME} trata os dados pessoais de quem visita este site e de quem fala com a gente, seguindo a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>

      <h2>Quem é o responsável pelos seus dados</h2>
      <p>
        <strong>{RAZAO_SOCIAL}</strong>, CNPJ {CNPJ}{ENDERECO ? `, ${ENDERECO}` : ""}. Contato: WhatsApp{" "}
        <a href={linkWhatsApp("Olá! Tenho uma dúvida sobre os meus dados pessoais (LGPD).")} target="_blank" rel="noopener noreferrer">{WHATSAPP_EXIBICAO}</a>
        {EMAIL && <> ou e-mail <a href={`mailto:${EMAIL}`}>{EMAIL}</a></>}.
      </p>

      <h2>Que dados coletamos e para quê</h2>
      <ul>
        <li><strong>Formulário de diagnóstico comercial:</strong> nome, telefone/WhatsApp, nome da empresa, segmento e faixa de faturamento mensal. Usamos para entrar em contato, entender o seu negócio e preparar a proposta.</li>
        <li><strong>Origem da visita:</strong> se você chegou por um link de anúncio, guardamos durante a visita os parâmetros do link (como utm_source e gclid) para saber qual campanha trouxe o seu contato.</li>
        <li><strong>Conversa pelo WhatsApp:</strong> o que você nos enviar, para responder e atender.</li>
        <li><strong>Navegação no site:</strong> páginas visitadas, cliques nos botões de contato, tipo de aparelho e a origem da visita. Só coletamos com cookies de medição depois que você clica em &quot;Aceitar&quot;. Usamos para medir os anúncios e melhorar o site.</li>
        <li><strong>Segurança do formulário:</strong> o endereço IP é usado na hora do envio para limitar tentativas repetidas e bloquear robôs. Ele não é guardado junto com o seu contato.</li>
      </ul>
      <p>Não vendemos seus dados e não pedimos mais do que o necessário para cada finalidade.</p>

      <h2>Com quem compartilhamos</h2>
      <ul>
        <li><strong>Supabase:</strong> serviço de banco de dados onde os contatos do formulário ficam guardados, acessados só pela nossa equipe comercial.</li>
        <li><strong>Meta (WhatsApp):</strong> é por onde acontece o atendimento.</li>
        <li><strong>Google e Meta (anúncios):</strong> com o seu aceite, Google Tag Manager, Google Analytics, Google Ads e as ferramentas de medição da Meta, para medir visitas e anúncios.</li>
        <li><strong>Provedor de hospedagem do site</strong>, que processa as visitas para entregar as páginas.</li>
        <li><strong>Autoridades</strong>, quando a lei exigir.</li>
      </ul>

      <h2>Por quanto tempo guardamos</h2>
      <p>Os dados do formulário ficam guardados pelo tempo necessário para o atendimento comercial. Se você virar cliente, ficam enquanto durar o contrato e depois pelo prazo exigido por lei (por exemplo, fiscal). Você pode pedir a exclusão a qualquer momento. Os dados de navegação seguem o prazo da ferramenta de medição, de até 14 meses.</p>

      <h2 id="cookies">Cookies</h2>
      <p>Cookies são pequenos arquivos que o site guarda no seu navegador.</p>
      <ul>
        <li><strong>Necessários:</strong> guardam a sua escolha sobre cookies. Não identificam você.</li>
        <li><strong>De medição e publicidade (Google e Meta):</strong> só são ativados se você clicar em &quot;Aceitar&quot; no aviso. Se você recusar, o site funciona normalmente.</li>
      </ul>
      <p>Para mudar a sua escolha, apague os dados deste site nas configurações do navegador: o aviso aparece de novo na próxima visita.</p>

      <h2>Seus direitos</h2>
      <p>Você pode, a qualquer momento, pedir para confirmar se tratamos seus dados, ver uma cópia, corrigir, apagar, saber com quem compartilhamos e retirar o seu consentimento (art. 18 da LGPD).</p>

      <h2>Como falar com a gente</h2>
      <p>
        Pedidos sobre seus dados: WhatsApp{" "}
        <a href={linkWhatsApp("Olá! Quero fazer um pedido sobre os meus dados pessoais (LGPD).")} target="_blank" rel="noopener noreferrer">{WHATSAPP_EXIBICAO}</a>
        {EMAIL && <> ou e-mail <a href={`mailto:${EMAIL}`}>{EMAIL}</a></>}. Respondemos em até 15 dias.
      </p>

      <h2>Mudanças nesta política</h2>
      <p>Quando esta política mudar, a data no topo da página é atualizada.</p>
    </PaginaLegal>
  );
}
