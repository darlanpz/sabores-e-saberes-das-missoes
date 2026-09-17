/**
 * Cartão de contato — WhatsApp ou Instagram. Usado pelo rodapé e pela seção
 * de contato da Home, sempre a partir dos mesmos dados (`site.footer.contact`).
 *
 * @param {{type: string, label: string, detail?: string, href: string}} item
 */
export function contactCard({ type, label, detail, href }) {
  const icon = type === "whatsapp" ? "/icons/whatsapp-fill.svg" : "/icons/instagram-fill.svg";

  return `
    <a class="footer__contact-card" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label} — abre em uma nova guia">
      <img class="footer__contact-icon" src="${icon}" alt="" width="32" height="32" aria-hidden="true">
      <span class="footer__contact-copy">
        <strong class="footer__contact-label">${label}</strong>
        ${detail ? `<span class="footer__contact-detail">${detail}</span>` : ""}
      </span>
    </a>`;
}
