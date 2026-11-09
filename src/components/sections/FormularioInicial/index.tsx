"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Check, ArrowUpRight, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { enviarEvento, lerOrigem } from "@/lib/origem";
import styles from "./style.module.css";

function aplicarMascaraTelefone(valor: string) {
  const nums = valor.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 2) return nums;
  if (nums.length <= 6) return "(" + nums.slice(0, 2) + ") " + nums.slice(2);
  if (nums.length <= 10) {
    return "(" + nums.slice(0, 2) + ") " + nums.slice(2, 6) + "-" + nums.slice(6);
  }
  return "(" + nums.slice(0, 2) + ") " + nums.slice(2, 7) + "-" + nums.slice(7, 11);
}

const OPCOES_SEGMENTO = [
  "Pizzarias", "Hamburguerias", "Restaurante comida brasileira", "Churrascaria steakhouse",
  "Restaurante japonês", "Restaurante massas italiano", "Restaurante comida árabe",
  "Açaí / sorveteria", "Cafeteria", "Doceria", "Gastrobar", "Outros",
];

const OPCOES_FATURAMENTO = [
  "Até 30 mil", "30 mil até 50 mil", "50 mil até 80 mil", "80 mil até 100 mil",
  "100 mil até 150 mil", "150 mil até 250 mil", "250 mil até 400 mil",
  "400 mil até 600 mil", "600 mil até 1 milhão", "Mais de 1 milhão",
];

const LOGOS_CLIENTES = [
  { nome: "Fresh Sandwich", src: "/clientes/fresh.png" },
  { nome: "LarShop", src: "/clientes/LarShop.png" },
  { nome: "Lig Lig", src: "/clientes/LigLig.png" },
  { nome: "Marques Araújo", src: "/clientes/marques-araujo.png" },
  { nome: "Press Metrologia", src: "/clientes/press-metrologia.png" },
  { nome: "Real Motos", src: "/clientes/real-motos.png" },
];

export default function FormularioInicial() {
  const colunaFormularioRef = useScrollAnimation<HTMLDivElement>({
    distanciaY: 40,
    atrasoStagger: 150,
    duracao: 1400,
    triggerRatio: 0.65,
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Gatilho de animação de entrada garantido após a montagem do React
  const [animar, setAnimar] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimar(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [segmento, setSegmento] = useState("");
  const [faturamento, setFaturamento] = useState("");

  const [abertoSegmento, setAbertoSegmento] = useState(false);
  const [abertoFaturamento, setAbertoFaturamento] = useState(false);

  const refDropdownSegmento = useRef<HTMLDivElement>(null);
  const refDropdownFaturamento = useRef<HTMLDivElement>(null);

  const [honeypot, setHoneypot] = useState("");
  const [tokenSeguranca, setTokenSeguranca] = useState<{ token: string; timestamp: number } | null>(null);

  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const lidarMovimentoMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  useEffect(() => {
    const escutarCliqueFora = (e: MouseEvent) => {
      if (refDropdownSegmento.current && !refDropdownSegmento.current.contains(e.target as Node)) {
        setAbertoSegmento(false);
      }
      if (refDropdownFaturamento.current && !refDropdownFaturamento.current.contains(e.target as Node)) {
        setAbertoFaturamento(false);
      }
    };
    document.addEventListener("mousedown", escutarCliqueFora);
    return () => document.removeEventListener("mousedown", escutarCliqueFora);
  }, []);

  const carregarDesafio = async () => {
    try {
      const res = await fetch("/api/lead", { method: "GET", cache: "no-store" });
      if (res.ok) {
        const dados = await res.json();
        setTokenSeguranca(dados);
      }
    } catch {}
  };

  useEffect(() => { carregarDesafio(); }, []);

  const lidarComEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro("");
    if (!segmento) { setMensagemErro("Por favor, selecione um segmento."); return; }
    if (!faturamento) { setMensagemErro("Por favor, selecione a faixa de faturamento."); return; }
    setEnviando(true);
    try {
      const resposta = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nome, company_name: empresa, phone: telefone,
          segment: segmento, revenue: faturamento, honeypot: honeypot,
          token: tokenSeguranca?.token, timestamp: tokenSeguranca?.timestamp,
          // Origem da visita (UTM, gclid, fbclid). A rota ainda não grava: ver TODO em app/api/lead/route.ts.
          origem: lerOrigem(),
        }),
      });
      const resultado = await resposta.json();
      if (!resposta.ok) throw new Error(resultado.error || "Ocorreu um erro ao enviar.");
      setSucesso(true);
      // Conversão do formulário para o GTM (sem dado pessoal: só segmento e faixa de faturamento).
      enviarEvento("envio_formulario", { segmento, faturamento });
      setNome(""); setTelefone(""); setEmpresa(""); setSegmento(""); setFaturamento(""); setHoneypot("");
    } catch (err: any) {
      setMensagemErro(err.message || "Ocorreu um erro ao enviar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className={styles.secao} id="inicio">
      <div className="container">
        <div className={styles.gradePrincipal}>
          <div className={`${styles.colunaTextos} ${animar ? styles.colunaTextosAtiva : ""}`}>
            <h1 className={styles.tituloPrincipal}>
              <span className={styles.linhaAnimada1}>
                FAZEMOS O SEU RESTAURANTE VENDER
              </span>
              <span className={styles.linhaAnimadaDestaque}>
                <span className={styles.destaqueVermelho}>
                  R$ 15 A CADA R$ 1 INVESTIDO
                </span>
              </span>
              <span className={styles.linhaAnimada2}>
                EM TRÁFEGO PAGO
              </span>
            </h1>

            <p className={styles.descricao}>
              Agende uma chamada gratuita e descubra como podemos transformar seu marketing em uma máquina de vendas e novos pedidos.
            </p>

            <ul className={styles.listaBeneficios}>
              <li className={styles.itemBeneficio}>
                <span className={styles.molduraIcone}><Check size={14} strokeWidth={3} /></span>
                <span>Marketing focado em VENDAS</span>
              </li>
              <li className={styles.itemBeneficio}>
                <span className={styles.molduraIcone}><Check size={14} strokeWidth={3} /></span>
                <span>Especialistas no ramo de food</span>
              </li>
            </ul>

            <a href="#clientes" className={styles.botaoResultados}>
              <span>Quero resultados como esse</span>
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className={styles.colunaFormularioWrapper} ref={colunaFormularioRef}>
            <div className={styles.auraFormulario} aria-hidden="true" />

            <div
              className={styles.colunaFormulario}
              ref={cardRef}
              onMouseMove={lidarMovimentoMouse}
            >
              <div className={styles.feixeBorda} aria-hidden="true" />
              <div className={styles.spotlightMouse} aria-hidden="true" />

              {sucesso ? (
                <div className={styles.caixaSucesso}>
                  <CheckCircle2 size={54} className={styles.iconeSucesso} />
                  <h3 className={styles.tituloSucesso}>Solicitação Recebida!</h3>
                  <p className={styles.textoSucesso}>
                    Em instantes um assessor executivo da GV5 entrará em contato pelo seu WhatsApp.
                  </p>
                  <button type="button" className={styles.botaoNovoEnvio}
                    onClick={() => { setSucesso(false); carregarDesafio(); }}>
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form className={styles.formulario} onSubmit={lidarComEnvio}>
                  <div style={{ display: "none", opacity: 0, position: "absolute", left: "-9999px" }} aria-hidden="true">
                    <input type="text" name="contact_check_field" tabIndex={-1}
                      value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" />
                  </div>

                  <div className={styles.cabecalhoFormulario}>
                    <span className={styles.rotuloFormulario}>Diagnóstico Comercial</span>
                    <p className={styles.chamadaFormulario}>Receba a consultoria inicial da nossa equipe</p>
                  </div>

                  <input type="text" placeholder="Seu nome completo" aria-label="Seu nome completo" autoComplete="name" value={nome}
                    onChange={(e) => setNome(e.target.value)} required maxLength={80} className={styles.campoTexto} />
                  <input type="tel" placeholder="(DDD) 99999-9999" aria-label="Telefone ou WhatsApp com DDD" autoComplete="tel-national" value={telefone}
                    onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))} required className={styles.campoTexto} />
                  <input type="text" placeholder="Nome do seu restaurante / delivery" aria-label="Nome do seu restaurante ou delivery" autoComplete="organization" value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)} required maxLength={100} className={styles.campoTexto} />

                  <div className={styles.envolturaDropdown} ref={refDropdownSegmento}>
                    <button type="button"
                      className={[styles.gatilhoDropdown, abertoSegmento ? styles.gatilhoAberto : "", !segmento ? styles.placeholderCor : ""].filter(Boolean).join(" ")}
                      onClick={() => { setAbertoSegmento(!abertoSegmento); setAbertoFaturamento(false); }}>
                      <span>{segmento || "Selecionar segmento"}</span>
                      <ChevronDown size={17} className={[styles.iconeSeta, abertoSegmento ? styles.iconeSetaGiro : ""].filter(Boolean).join(" ")} />
                    </button>
                    {abertoSegmento && (
                      <div className={styles.menuOpcoesGlass}>
                        {OPCOES_SEGMENTO.map((item) => (
                          <div key={item}
                            className={[styles.itemOpcao, segmento === item ? styles.opcaoAtiva : ""].filter(Boolean).join(" ")}
                            onClick={() => { setSegmento(item); setAbertoSegmento(false); }}>
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.envolturaDropdown} ref={refDropdownFaturamento}>
                    <button type="button"
                      className={[styles.gatilhoDropdown, abertoFaturamento ? styles.gatilhoAberto : "", !faturamento ? styles.placeholderCor : ""].filter(Boolean).join(" ")}
                      onClick={() => { setAbertoFaturamento(!abertoFaturamento); setAbertoSegmento(false); }}>
                      <span>{faturamento || "Faturamento mensal aproximado"}</span>
                      <ChevronDown size={17} className={[styles.iconeSeta, abertoFaturamento ? styles.iconeSetaGiro : ""].filter(Boolean).join(" ")} />
                    </button>
                    {abertoFaturamento && (
                      <div className={styles.menuOpcoesGlass}>
                        {OPCOES_FATURAMENTO.map((item) => (
                          <div key={item}
                            className={[styles.itemOpcao, faturamento === item ? styles.opcaoAtiva : ""].filter(Boolean).join(" ")}
                            onClick={() => { setFaturamento(item); setAbertoFaturamento(false); }}>
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {mensagemErro && (<span className={styles.textoErro}>{mensagemErro}</span>)}

                  <button type="submit" disabled={enviando} className={styles.botaoSubmissao}>
                    <span className={styles.brilhoVarreduraBotao} aria-hidden="true" />
                    {enviando ? (
                      <span className={styles.spinnnerBotao}>
                        <Loader2 size={20} className={styles.iconeGirando} />
                        Enviando...
                      </span>
                    ) : (
                      "Quero vender mais investindo menos"
                    )}
                  </button>

                  <p className={styles.avisoPrivacidade}>
                    Ao enviar, você concorda com a <Link href="/privacidade">Política de Privacidade</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className={styles.faixaCarrosselLogos}>
          <div className={styles.trilhoLogos}>
            {[...LOGOS_CLIENTES, ...LOGOS_CLIENTES, ...LOGOS_CLIENTES].map((cliente, idx) => (
              <div key={idx} className={styles.itemLogoCliente} tabIndex={0}>
                <Image src={cliente.src} alt={cliente.nome} width={110} height={50} className={styles.imagemClienteLogo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
