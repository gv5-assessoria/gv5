# GV5 Assessoria — landing page (site próprio)

Site da própria GV5 Assessoria (agência de marketing com foco em tráfego pago para restaurantes e delivery). A ação principal é o formulário de diagnóstico comercial no topo da página; o WhatsApp é o canal secundário. Tem blog alimentado pelo painel GV5 Insight.

> Tipo: **landing page**. As regras gerais e o mapa do Guia já vêm do `CLAUDE.md` global; aqui fica só o que é deste projeto.

## Antes de começar

1. Ler o `DOCUMENTACAO.md` da raiz: é o norte do projeto (público, oferta, seções, integrações e, na 2.8, o que está planejado).
2. Coisa nova? Conversar pelo [[planejar-tarefa-nova]] e escrever o plano na 2.8 antes do código.

**O `DOCUMENTACAO.md` é o único documento.** Toda sprint que muda conteúdo, seção ou integração atualiza ele no mesmo commit, com linha no Histórico de Revisões. Não existe `docs/` nem `progresso.md`.

## Regras deste tipo de projeto

- Antes de dizer "pronto", conferir também no celular.
- Antes de publicar, passar o [[checklist-landing-page]] (SEO, sitemap, robots, 404, LGPD, GTM) e, no blog, o [[paginas-dinamicas-com-seo]].
- Texto de venda não muda sem o Daniel aprovar.

## Projeto

- CTA principal: formulário (`src/components/sections/FormularioInicial`) → `POST /api/lead` (rota deste site) → RPC `inserir_lead_seguro` no Supabase do GV5 Insight (fallback: insert em `leads`). **Não quebrar esse envio**: os nomes dos campos (`name`, `company_name`, `phone`, `segment`, `revenue`) são o contrato com o painel.
- WhatsApp: (11) 98943-7638.
- Domínio: `gv5assessoria.com.br` (tirado do README do repositório `gv5-assessoria`; confirmar). Trocar em `src/lib/site.ts`.
- Dados da empresa (nome, razão social, CNPJ, WhatsApp, Instagram, e-mail, GTM): só em `src/lib/site.ts`.
- Blog: lê `companies` (slug `gv5`) e `posts` publicados do Supabase do GV5 Insight com a chave anônima (`src/integrations/supabase/client.ts`). Não criar tabela nem migration aqui: o banco é do painel.
- Variáveis de ambiente (só nomes): `NEXT_PUBLIC_GTM_ID` (opcional; senão o ID de `lib/site.ts`), `LEADS_WEBHOOK_SECRET` (assinatura do token do formulário).
- Na raiz, `codigo-completo.txt` e `ia.js` são arquivos locais do Daniel: não mexer nem commitar.

## Interface

Feita antes do registro pelo [[indice-ui]]; o que existe no código:

- Sistema de design: variáveis próprias no `:root` de `src/app/global.css` (vermelho `--red`, azul-marinho `--navy*`, cinzas; fonte do sistema). Não usa os tokens de [[tokens]].
- Blocos e efeitos: cabeçalho flutuante que some ao rolar no celular, faíscas no fundo (`effects/Faiscas`), formulário com borda em feixe e spotlight no mouse, carrossel de logos, cases em carrossel com arraste, entrada ao rolar com anime.js (`hooks/useScrollAnimation`), botão flutuante de WhatsApp no rodapé.

## Exceções aos guias

- Tailwind está instalado (`@tailwindcss/postcss`), mas os componentes usam CSS Modules. Mantido como estava.
- O layout raiz não inclui cabeçalho e rodapé: cada página monta os seus (home, blog, legais e 404).
