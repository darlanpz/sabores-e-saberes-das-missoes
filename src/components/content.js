import { icon } from "./icon.js";
import { button } from "./button.js";
import { medidas } from "./medidas.js";

/** Cabeçalho de seção — ícone + rótulo, abre todo painel. */
export function sectionHeader({ iconName, label }) {
  return `
    <div class="section-header">
      ${icon(iconName)}
      <p class="section-header__label">${label}</p>
    </div>`;
}

/** Card de item — título, autor e ação. */
export function card({ title, meta, action, thumb }) {
  const body = `
    <div class="card__body">
      <p class="card__title">${title}</p>
      ${meta ? `<p class="card__meta">${meta}</p>` : ""}
    </div>`;

  if (!thumb) {
    return `<article class="card">${body}${action ? button(action) : ""}</article>`;
  }

  // A miniatura tem tamanho próprio por card: 120 × 180 no quadrinho, 120 × 120
  // no quiz, 72 × 72 no padrão.
  const medida = [
    thumb.width && `--thumb-w:${thumb.width}px`,
    thumb.height && `--thumb-h:${thumb.height}px`,
  ]
    .filter(Boolean)
    .join(";");

  const conteudoThumb = thumb.iconName
    ? icon(thumb.iconName, { size: 32 })
    : `<img src="${thumb.src}"${medidas(thumb.src)} alt="${thumb.alt ?? ""}" loading="lazy" decoding="async">`;

  return `
    <article class="card card--with-thumb">
      <div class="card__thumb"${medida ? ` style="${medida}"` : ""}>${conteudoThumb}</div>
      <div class="card__content">
        ${body}
        ${action ? button(action) : ""}
      </div>
    </article>`;
}

/** Painel de conteúdo — cabeçalho de seção + cards. */
export function panel({ header, children = [] }) {
  return `
    <section class="panel">
      ${header ? sectionHeader(header) : ""}
      ${children.join("")}
    </section>`;
}

/**
 * Text-section — título + parágrafo.
 * Os dois são opcionais: dá um título de destaque sozinho, ou um parágrafo
 * solto que continua o bloco anterior.
 */
export function textSection({ title, body, highlight = false, level = 2 }) {
  const Tag = `h${level}`;
  return `
    <div class="text-section${highlight ? " text-section--highlight" : ""}">
      ${title ? `<${Tag} class="text-section__title">${title}</${Tag}>` : ""}
      ${body ? `<p class="text-section__body">${body}</p>` : ""}
    </div>`;
}

/** Lista de tipos de conteúdo — explica os QR Codes no Banner 1. */
export function contentList(items) {
  return `
    <ul class="content-list">
      ${items
        .map(
          ({ iconName, label }) => `
        <li class="content-list__item">
          ${icon(iconName)}
          <span class="content-list__label">${label}</span>
        </li>`,
        )
        .join("")}
    </ul>`;
}

/** Feedback — mensagem de estado. Ver style-guide 3.3. */
const FEEDBACK_ICONS = {
  success: "check-circle",
  info: "info",
  warning: "alert-triangle",
  danger: "alert-circle",
};

const FEEDBACK_LABELS = {
  success: "Sucesso",
  info: "Informação",
  warning: "Atenção",
  danger: "Erro",
};

export function feedback({ variant = "info", text }) {
  return `
    <div class="feedback feedback--${variant}" role="${variant === "danger" ? "alert" : "status"}">
      <span class="feedback__icon">${icon(FEEDBACK_ICONS[variant], { label: FEEDBACK_LABELS[variant] })}</span>
      <p class="feedback__text">${text}</p>
    </div>`;
}
