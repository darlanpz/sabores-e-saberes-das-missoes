import { icon } from "./icon.js";

/** Logo — SVG exportado do Figma, nunca reconstruído em texto. */
export function logo({ className = "header__logo" } = {}) {
  return `
    <a class="${className}" href="/" aria-label="Sabores e Saberes das Missões — início">
      <img class="logo" src="/icons/logo.svg" alt="">
    </a>`;
}

/**
 * menu-item — item de navegação.
 * @param {object} item
 * @param {string} item.label
 * @param {string} item.href
 * @param {boolean} [item.current]  marca o item ativo com aria-current="page"
 */
export function menuItem({ label, href = "#", current = false }) {
  return `<a class="menu-item" href="${href}"${current ? ' aria-current="page"' : ""}>${label}</a>`;
}

/** Menu-button — hambúrguer do mobile. Alterna para X quando expandido. */
export function menuButton({ expanded = false, controls = "menu-principal" } = {}) {
  return `
    <button
      class="menu-button header__menu-button"
      type="button"
      aria-expanded="${expanded}"
      aria-controls="${controls}"
      aria-label="Abrir menu"
    >
      <span class="menu-button__icon--open">${icon("menu")}</span>
      <span class="menu-button__icon--close">${icon("x")}</span>
    </button>`;
}

/** Header — logo + navegação (desktop) ou botão de menu (mobile). */
export function header({ items = [] } = {}) {
  return `
    <header class="header">
      ${logo()}
      <nav class="header__nav" id="menu-principal" aria-label="Principal">
        ${items.map(menuItem).join("")}
      </nav>
      ${menuButton()}
    </header>`;
}
