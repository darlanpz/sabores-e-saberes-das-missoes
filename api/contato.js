import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import { renderContatoEmail, renderContatoTexto } from "../src/emails/contato-template.js";

/**
 * Vercel Function — recebe o formulário de contato e envia por SMTP do Zoho.
 *
 * Credenciais SMTP vêm de variáveis de ambiente (nunca do site.json, que é
 * público): ZOHO_SMTP_HOST, ZOHO_SMTP_PORT, ZOHO_SMTP_SECURE, ZOHO_SMTP_USER,
 * ZOHO_SMTP_PASS. O destinatário e o nome do remetente vêm do site.json
 * (site.email) — não são segredo.
 */

const TIPOS_VALIDOS = new Set(["Elogio", "Dúvida", "Sugestão"]);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEMPO_MINIMO_MS = 3000;

const site = JSON.parse(
  readFileSync(fileURLToPath(new URL("../src/content/site.json", import.meta.url)), "utf8"),
);

/** Remove quebras de linha — evita header injection em campos usados no e-mail. */
function sanitizarLinhaUnica(valor) {
  return String(valor ?? "").replace(/[\r\n]+/g, " ").trim();
}

function validar(payload) {
  const nome = sanitizarLinhaUnica(payload.nome).slice(0, 200);
  const email = sanitizarLinhaUnica(payload.email).slice(0, 200);
  const tipo = sanitizarLinhaUnica(payload.tipo);
  const cidade = sanitizarLinhaUnica(payload.cidade).slice(0, 150);
  const mensagem = String(payload.mensagem ?? "").trim().slice(0, 5000);

  if (nome.length < 2) return { erro: "Nome inválido." };
  if (!EMAIL_REGEX.test(email)) return { erro: "E-mail inválido." };
  if (!TIPOS_VALIDOS.has(tipo)) return { erro: "Tipo de mensagem inválido." };
  if (mensagem.length < 5) return { erro: "Mensagem muito curta." };

  return { dados: { nome, email, tipo, cidade, mensagem } };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Método não permitido." });
    return;
  }

  const payload = req.body ?? {};

  // Honeypot preenchido ou envio rápido demais: sinal de bot. Responde como
  // se tivesse dado certo, sem enviar e-mail nem entregar a regra ao cliente.
  const honeypotPreenchido = Boolean(sanitizarLinhaUnica(payload.website));
  const tempoDecorrido = Date.now() - Number(payload.startedAt || 0);
  if (honeypotPreenchido || !Number.isFinite(tempoDecorrido) || tempoDecorrido < TEMPO_MINIMO_MS) {
    res.status(200).json({ ok: true });
    return;
  }

  const { erro, dados } = validar(payload);
  if (erro) {
    res.status(400).json({ ok: false, error: erro });
    return;
  }

  const recebidoEm = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const contexto = { ...dados, recebidoEm };

  try {
    const transporte = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
      port: Number(process.env.ZOHO_SMTP_PORT || 465),
      secure: (process.env.ZOHO_SMTP_SECURE ?? "true") === "true",
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
      },
    });

    await transporte.sendMail({
      from: `"${site.site.email.fromName}" <${process.env.ZOHO_SMTP_USER}>`,
      to: site.site.email.to,
      replyTo: dados.email,
      subject: `Novo contato pelo site — ${dados.tipo}`,
      text: renderContatoTexto(contexto),
      html: renderContatoEmail(contexto),
    });

    res.status(200).json({ ok: true });
  } catch (erroEnvio) {
    console.error("Falha ao enviar e-mail de contato:", erroEnvio);
    res.status(502).json({
      ok: false,
      error: "Não foi possível enviar sua mensagem agora. Tente novamente em instantes.",
    });
  }
}
