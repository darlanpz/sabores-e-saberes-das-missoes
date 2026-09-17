/**
 * E-mail de notificação de contato — identidade do site traduzida para HTML
 * de e-mail (estilo inline, sem CSS externo, sem grid/flex: nem todo cliente
 * de e-mail suporta, e SVG costuma ser bloqueado, então o logo vira um
 * wordmark em serifa na cor accent em vez do arquivo de logo).
 *
 * Cores replicadas de src/styles/tokens.css — fonte da verdade do site.
 */
const CORES = {
  primary: "#19120d",
  secondary: "#4a3427",
  accent: "#e8c37d",
  text: "#f7ebd8",
  textMuted: "#c9baa5",
};

function escapeHtml(valor = "") {
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function linha(rotulo, valor) {
  if (!valor) return "";
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${CORES.secondary};">
        <p style="margin:0 0 4px;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:${CORES.accent};">
          ${escapeHtml(rotulo)}
        </p>
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:${CORES.text};">
          ${escapeHtml(valor)}
        </p>
      </td>
    </tr>`;
}

/**
 * @param {{nome: string, email: string, tipo: string, cidade?: string, mensagem: string, recebidoEm: string}} dados
 */
export function renderContatoEmail({ nome, email, tipo, cidade, mensagem, recebidoEm }) {
  return `<!doctype html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background-color:${CORES.primary};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${CORES.primary};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:${CORES.secondary};border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 16px;text-align:center;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:22px;letter-spacing:0.02em;color:${CORES.accent};">
                  Sabores e Saberes das Missões
                </p>
                <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${CORES.textMuted};">
                  Nova mensagem recebida pelo formulário de contato do site
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${linha("Tipo", tipo)}
                  ${linha("Nome", nome)}
                  ${linha("E-mail", email)}
                  ${linha("Cidade", cidade)}
                  ${linha("Mensagem", mensagem)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${CORES.textMuted};">
                  Recebido em ${escapeHtml(recebidoEm)}. Responda diretamente a este e-mail para falar com quem enviou —
                  o campo "responder" já está preenchido com o e-mail informado no formulário.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${CORES.textMuted};">
            Enviado pelo formulário de contato do site Sabores e Saberes das Missões.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Versão texto simples — vai como fallback ao lado do HTML. */
export function renderContatoTexto({ nome, email, tipo, cidade, mensagem, recebidoEm }) {
  return [
    "Nova mensagem recebida pelo formulário de contato do site",
    "Sabores e Saberes das Missões",
    "",
    `Tipo: ${tipo}`,
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    cidade ? `Cidade: ${cidade}` : null,
    "",
    "Mensagem:",
    mensagem,
    "",
    `Recebido em ${recebidoEm}.`,
    "Enviado pelo formulário de contato do site Sabores e Saberes das Missões.",
  ]
    .filter((linha) => linha !== null)
    .join("\n");
}
