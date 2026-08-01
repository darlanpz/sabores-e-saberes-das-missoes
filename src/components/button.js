import { icon } from "./icon.js";

/**
 * Botão primário — o único botão do sistema.
 *
 * @param {object} opts
 * @param {string} opts.label
 * @param {string} [opts.iconName]  ícone Feather à esquerda
 * @param {boolean} [opts.iconFill]
 * @param {string} [opts.href]       renderiza como <a> quando presente
 * @param {string} [opts.opens]      id de um diálogo que este botão abre
 * @param {boolean} [opts.disabled]
 */
export function button({ label, iconName, iconFill = false, href, opens, disabled = false }) {
  const glyph = iconName
    ? `<span class="button__icon">${icon(iconName, { fill: iconFill })}</span>`
    : "";

  // Abrir um diálogo é ação, não navegação: vira <button>, mesmo com href.
  if (opens) {
    return `
      <button class="button" type="button" data-abre="${opens}" aria-haspopup="dialog"${disabled ? " disabled" : ""}>
        ${glyph}${label}
      </button>`;
  }

  if (href && !disabled) {
    return `<a class="button" href="${href}">${glyph}${label}</a>`;
  }

  return `
    <button class="button" type="button"${disabled ? " disabled" : ""}>
      ${glyph}${label}
    </button>`;
}

/**
 * Botão-pílula — navegação de páginas do modal.
 * @param {"prev"|"next"} direction
 */
export function pillButton({ direction = "next", label } = {}) {
  return `
    <button class="pill-button pill-button--${direction}" type="button" aria-label="${label}">
      <span class="pill-button__inner">${icon("fast-forward", { fill: true })}</span>
    </button>`;
}
