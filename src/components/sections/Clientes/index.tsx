"use client";
import{
useEffect,useRef,useState,TouchEvent
}
from "react";
import Image from "next/image";
import { linkWhatsApp } from "@/lib/site";
import{
animate,cubicBezier
}
from "animejs";
import{
ChevronLeft,ChevronRight,Hand
}
from "lucide-react";
import styles from "./style.module.css";
interface CasoCliente{
tipo:"cliente";
nome:string;
imagem:string;
investido:string;
retornado:string;
roi:string;
notaExtra?:string;
}
interface CasoCTA{
tipo:"cta";
linha1:string;
linha2:string;
subtitulo:string;
whatsappUrl:string;
}
type CardLeque=CasoCliente|CasoCTA;
const CARDS_INICIAIS:CardLeque[]=[{
tipo:"cliente",nome:"LM Pastéis",imagem:"/clientes/lmPasteis.png",investido:"R$ 5.257,00",retornado:"R$ 52.673,00",roi:"ROAS: 10,0",
}
,{
tipo:"cliente",nome:"Pizzaria San Felix",imagem:"/clientes/san-felix.png",investido:"R$ 178,95",retornado:"R$ 2.914,72",roi:"ROAS: 16,29",notaExtra:"Primeiro final de semana de anúncios rodando",
}
,{
tipo:"cta",linha1:"seja você o",linha2:"próximo case",subtitulo:"Sua empresa pode estar aqui. Vamos conversar?",whatsappUrl:linkWhatsApp("Olá! Vi os cases no site da GV5 e quero conversar sobre a minha empresa."),
}
,{
tipo:"cliente",nome:"Empório Coisa de Minas",imagem:"/clientes/CoisadeMinas.png",investido:"R$ 1.565,00",retornado:"R$ 21.910,00",roi:"ROAS: 14,0",
}
,{
tipo:"cliente",nome:"Lig Lig",imagem:"/clientes/LigLig.png",investido:"R$ 1.250,00",retornado:"R$ 18.750,00",roi:"ROAS: 15,0",
}
,];
const INDICE_CENTRAL=2;
export default function Clientes(){
const secaoRef=useRef<HTMLElement>(null);
const deckRef=useRef<HTMLDivElement>(null);
const animacaoAtiva=useRef(false);
const[indiceAtivo,setIndiceAtivo]=useState(INDICE_CENTRAL);
const[jaInteragiu,setJaInteragiu]=useState(false);
const touchStartX=useRef(0);
const touchEndX=useRef(0);
const calcularPosicao=()=>{
const isMobile=window.innerWidth<768;
const cardW=isMobile ? 220:235;
const spacing=isMobile ? 52:cardW*0.85;
const rotBase=isMobile ? 6.5:9;
const transYBase=isMobile ? 8:18;
const escalaLateral=isMobile ? 0.9:0.93;
return{
spacing,rotBase,transYBase,escalaLateral
}
;
}
;
const animarLinhasCTA=()=>{
const elDeck=deckRef.current;
if(!elDeck)return;
const linhas=Array.from(elDeck.querySelectorAll<HTMLElement>("."+styles.linhaTexto));
if(linhas.length===0)return;
linhas.forEach((linha,i)=>{
animate(linha,{
translateY:["120%","0%"],duration:1100,ease:cubicBezier(0.16,1,0.3,1),delay:i*180,
}
);
}
);
}
;
const empilharCartas=()=>{
const elDeck=deckRef.current;
if(!elDeck)return;
const cards=Array.from(elDeck.querySelectorAll<HTMLElement>("."+styles.cardLeque));
cards.forEach((card,index)=>{
const diff=index-INDICE_CENTRAL;
const absDiff=Math.abs(diff);
card.style.zIndex=String(20-absDiff);
card.style.opacity="0";
card.style.transform=`translateX(${
diff*4
}
px) translateY(24px) rotate(${
diff*1.5
}
deg) scale(0.94)`;
}
);
}
;
const abrirLeque=()=>{
const elDeck=deckRef.current;
if(!elDeck)return;
const cards=Array.from(elDeck.querySelectorAll<HTMLElement>("."+styles.cardLeque));
if(cards.length===0)return;
const{
spacing,rotBase,transYBase,escalaLateral
}
=calcularPosicao();
cards.forEach((card,index)=>{
const diff=index-INDICE_CENTRAL;
const absDiff=Math.abs(diff);
card.style.zIndex=String(20-absDiff);
const finalX=diff*spacing;
const finalY=absDiff*transYBase;
const finalRot=diff*rotBase;
const finalScale=diff===0 ? 1.04:Math.max(0.82,escalaLateral-absDiff*0.03);
animate(card,{
translateX:[diff*4,finalX],translateY:[24,finalY],rotate:[diff*1.5,finalRot],scale:[0.94,finalScale],opacity:[0,1],duration:2400,ease:cubicBezier(0.16,1,0.3,1),delay:(2-absDiff)*200,
}
);
}
);
window.setTimeout(animarLinhasCTA,900);
}
;
const animarCardsParaIndice=(novoAtivo:number,duracao:number=850)=>{
const elDeck=deckRef.current;
if(!elDeck)return;
const cards=Array.from(elDeck.querySelectorAll<HTMLElement>("."+styles.cardLeque));
if(cards.length===0)return;
const{
spacing,rotBase,transYBase,escalaLateral
}
=calcularPosicao();
cards.forEach((card,index)=>{
const diff=index-novoAtivo;
const absDiff=Math.abs(diff);
card.style.zIndex=String(20-absDiff);
const finalX=diff*spacing;
const finalY=absDiff*transYBase;
const finalRot=diff*rotBase;
const finalScale=diff===0 ? 1.04:Math.max(0.82,escalaLateral-absDiff*0.03);
animate(card,{
translateX:finalX,translateY:finalY,rotate:finalRot,scale:finalScale,opacity:1,duration:duracao,ease:cubicBezier(0.16,1,0.3,1),
}
);
}
);
}
;
const selecionarCard=(index:number)=>{
setJaInteragiu(true);
setIndiceAtivo(index);
animarCardsParaIndice(index,900);
}
;
const proximoCard=()=>{
setJaInteragiu(true);
const prox=Math.min(CARDS_INICIAIS.length-1,indiceAtivo+1);
setIndiceAtivo(prox);
animarCardsParaIndice(prox,900);
}
;
const anteriorCard=()=>{
setJaInteragiu(true);
const ant=Math.max(0,indiceAtivo-1);
setIndiceAtivo(ant);
animarCardsParaIndice(ant,900);
}
;
const lidarTouchStart=(e:TouchEvent)=>{
touchStartX.current=e.targetTouches[0].clientX;
}
;
const lidarTouchMove=(e:TouchEvent)=>{
touchEndX.current=e.targetTouches[0].clientX;
}
;
const lidarTouchEnd=()=>{
const diferenca=touchStartX.current-touchEndX.current;
if(Math.abs(diferenca)>45){
if(diferenca>0)proximoCard();
else anteriorCard();
}
}
;
useEffect(()=>{
const secao=secaoRef.current;
if(!secao)return;
empilharCartas();
const observador=new IntersectionObserver((entradas)=>{
entradas.forEach((entrada)=>{
if(entrada.isIntersecting){
if(animacaoAtiva.current)return;
animacaoAtiva.current=true;
requestAnimationFrame(()=>{
setIndiceAtivo(INDICE_CENTRAL);
abrirLeque();
}
);
}
else{
if(!animacaoAtiva.current)return;
animacaoAtiva.current=false;
empilharCartas();
}
}
);
}
,{
threshold:0.25,rootMargin:"-10% 0px -12% 0px",
}
);
observador.observe(secao);
return()=>observador.disconnect();
}
,[]);
return(<section className={
styles.secaoClientes
}
id="clientes" ref={
secaoRef
}
><div className="container"><div className={
styles.cabecalhoSecao
}
><div className={
styles.etiquetaSecao
}
>Resultados Reais Auditados</div><h2 className={
styles.tituloSecao
}
>Métricas que comprovam a solidez da metodologia GV5</h2><p className={
styles.descricaoSecao
}
>Investimento estratégico gera faturamento previsível. Acompanhe a performance de parceiros que confiam em nossa gestão:</p></div>{
!jaInteragiu&&(<div className={
styles.dicaInteracao
}
><Hand size={
14
}
className={
styles.iconeMaoDica
}
/><span>Toque ou deslize nas cartas para folhear os cases</span></div>)
}
<div className={
styles.palco3D
}
><div className={
styles.deckCentral
}
ref={
deckRef
}
onTouchStart={
lidarTouchStart
}
onTouchMove={
lidarTouchMove
}
onTouchEnd={
lidarTouchEnd
}
>{
CARDS_INICIAIS.map((card,index)=>{
const isAtivo=index===indiceAtivo;
return(<article key={
index
}
className={
[styles.cardLeque,isAtivo ? styles.cardDestaque:"",card.tipo==="cta" ? styles.cardCTA:"",].filter(Boolean).join(" ")
}
onClick={
()=>selecionarCard(index)
}
style={
{
opacity:0
}
}
>{
card.tipo==="cliente" ?(<><div className={
styles.areaLogoDireta
}
><Image src={
card.imagem
}
alt={
card.nome
}
width={
140
}
height={
80
}
className={
styles.imagemLogo
}
/></div><h3 className={
styles.nomeCliente
}
>{
card.nome
}
</h3><div className={
styles.blocoMetricas
}
><div className={
styles.linhaMetrica
}
><span className={
styles.rotuloMetrica
}
>INVESTIDO:</span><strong className={
styles.valorMetrica
}
>{
card.investido
}
</strong></div><div className={
styles.linhaMetrica
}
><span className={
styles.rotuloMetrica
}
>RETORNADO:</span><strong className={
styles.valorMetrica
}
>{
card.retornado
}
</strong></div></div><div className={
styles.blocoInferior
}
><div className={
isAtivo ? styles.badgeRoiDestaque:styles.badgeRoi
}
><span>{
card.roi
}
</span></div>{
card.notaExtra&&(<div className={
styles.notaExtraCard
}
>{
card.notaExtra
}
</div>)
}
</div></>):(<><div className={
styles.glowAtras
}
aria-hidden="true"/><div className={
styles.ctaConteudo
}
><h3 className={
styles.ctaTitulo
}
><span className={
styles.linhaMascara
}
><span className={
styles.linhaTexto
}
>{
card.linha1
}
</span></span><span className={
styles.linhaMascara
}
><span className={
styles.linhaTexto
}
>{
card.linha2
}
</span></span></h3><p className={
styles.ctaSubtitulo
}
>{
card.subtitulo
}
</p><a href={
card.whatsappUrl
}
target="_blank" rel="noopener noreferrer" className={
styles.botaoWhatsApp
}
onClick={
(e)=>e.stopPropagation()
}
><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0.16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg><span>Falar no WhatsApp</span></a></div></>)
}
</article>);
}
)
}
</div></div><div className={
styles.barraControlesMobile
}
><button type="button" className={
styles.botaoNavegacao
}
onClick={
anteriorCard
}
disabled={
indiceAtivo===0
}
aria-label="Case anterior"><ChevronLeft size={
18
}
/></button><div className={
styles.trilhoDots
}
>{
CARDS_INICIAIS.map((_,i)=>(<button key={
i
}
type="button" className={
[styles.dotItem,i===indiceAtivo ? styles.dotAtivo:""].filter(Boolean).join(" ")
}
onClick={
()=>selecionarCard(i)
}
aria-label={
"Ir para o case "+(i+1)
}
/>))
}
</div><button type="button" className={
styles.botaoNavegacao
}
onClick={
proximoCard
}
disabled={
indiceAtivo===CARDS_INICIAIS.length-1
}
aria-label="Próximo case"><ChevronRight size={
18
}
/></button></div></div></section>);
}
