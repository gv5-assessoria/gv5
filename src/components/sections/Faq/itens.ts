// Perguntas do FAQ: usadas na seção (index.tsx) e no schema FAQPage da home (app/page.tsx).
// Ficam fora do index.tsx porque ele é "use client" e o servidor não lê dados de um módulo cliente.
export interface ItemFaq { pergunta: string; resposta: string; }

export const ITENS_FAQ: ItemFaq[] = [
  { pergunta: "Qual é a real diferença entre a GV5 e uma agência de marketing comum?", resposta: "Agências convencionais focam em likes, artes estáticas e posts comemorativos. A GV5 opera como uma assessoria comercial de ponta a ponta: combinamos mídia de performance, testes contínuos de criativos, engenharia de cardápios e reativação via CRM com foco estrito em volume de pedidos e receita líquida." },
  { pergunta: "Em quanto tempo começamos a registrar crescimento consistente?", resposta: "Com a estrutura técnica configurada e os primeiros criativos validados, nossos parceiros começam a captar novos clientes e pedidos já entre a primeira e a segunda semana de operação ativa." },
  { pergunta: "O serviço se aplica tanto a delivery quanto a restaurante com salão?", resposta: "Sim. Criamos esteiras segmentadas de acordo com o modelo de negócio: para salões, desenvolvemos campanhas para atração local e reservas; para delivery, otimizamos o raio de entrega, o ticket médio e as vendas diretas sem comissões excessivas de terceiros." },
  { pergunta: "A produção de vídeos e fotos dos pratos está inclusa?", resposta: "Sim. Acreditamos que a qualidade visual dos pratos define a taxa de clique e de compra. Nossa equipe orienta ou produz criativos profissionais adaptados para as redes sociais que despertam desejo imediato no consumidor." },
];
