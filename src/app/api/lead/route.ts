import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/integrations/supabase/client";

const APP_INTERNAL_SECRET = process.env.LEADS_WEBHOOK_SECRET || "gv5-token-internal-secret-auth-safe";

// Rate limiter em memória por IP
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_SUBMISSIONS_PER_IP = 5;

function verificarRateLimit(ip: string): boolean {
  const agora = Date.now();
  const registro = rateLimitMap.get(ip);

  if (!registro || agora - registro.lastReset > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, lastReset: agora });
    return true;
  }

  if (registro.count >= MAX_SUBMISSIONS_PER_IP) {
    return false;
  }

  registro.count += 1;
  return true;
}

function gerarTokenDesafio(ip: string, timestamp: number): string {
  return crypto
    .createHmac("sha256", APP_INTERNAL_SECRET)
    .update(`${ip}-${timestamp}`)
    .digest("hex");
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
  const timestamp = Date.now();
  const token = gerarTokenDesafio(ip, timestamp);

  return NextResponse.json({ token, timestamp });
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

    if (!verificarRateLimit(ip)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde um momento antes de tentar de novo." },
        { status: 429 }
      );
    }

    const corpo = await req.json();
    const { name, company_name, phone, segment, revenue, honeypot, token, timestamp } = corpo;
    // TODO: o formulário também manda `corpo.origem` (utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid),
    // mas a RPC inserir_lead_seguro e a tabela leads do GV5 Insight só aceitam os 5 campos acima. Para gravar a origem,
    // criar as colunas/parâmetros no banco do painel (fora deste repositório) e repassar aqui.

    // 1. Defesa Honeypot
    if (honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 2. Validação do Token Desafio (se falhar, emite um aviso limpo)
    if (!token || !timestamp) {
      return NextResponse.json({ error: "Sessão expirada. Recarregue a página." }, { status: 403 });
    }

    const tokenEsperado = gerarTokenDesafio(ip, Number(timestamp));
    if (token !== tokenEsperado) {
      return NextResponse.json({ error: "Assinatura inválida. Recarregue a página." }, { status: 403 });
    }

    // 3. Higienização
    const nomeLimpo = typeof name === "string" ? name.trim() : "";
    const empresaLimpa = typeof company_name === "string" ? company_name.trim() : "";
    const telefoneNumeros = typeof phone === "string" ? phone.replace(/\D/g, "") : "";

    if (nomeLimpo.length < 2 || nomeLimpo.length > 80) {
      return NextResponse.json({ error: "Preencha seu nome completo." }, { status: 400 });
    }

    if (empresaLimpa.length < 2 || empresaLimpa.length > 100) {
      return NextResponse.json({ error: "Preencha o nome da empresa." }, { status: 400 });
    }

    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      return NextResponse.json({ error: "Telefone ou WhatsApp incompleto." }, { status: 400 });
    }

    // 4. Inserção via RPC Seguro
    const { data, error: rpcError } = await supabase.rpc("inserir_lead_seguro", {
      p_name: nomeLimpo,
      p_company_name: empresaLimpa,
      p_phone: telefoneNumeros,
      p_segment: segment || "Não informado",
      p_revenue: revenue || "Não informado",
    });

    if (rpcError) {
      console.error("Erro Supabase RPC:", rpcError);
      
      // Fallback: se a RPC não existir ainda, tenta o insert padrão da tabela
      const { error: fallbackError } = await supabase.from("leads").insert([
        {
          name: nomeLimpo,
          company_name: empresaLimpa,
          phone: telefoneNumeros,
          segment: segment || "Não informado",
          revenue: revenue || "Não informado",
        }
      ]);

      if (fallbackError) {
        console.error("Erro Supabase Fallback:", fallbackError);
        return NextResponse.json({ error: "Falha de conexão com o banco. Tente novamente." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err: any) {
    console.error("Erro inesperado na rota:", err);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
