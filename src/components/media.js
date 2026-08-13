import { icon, audioDescriptionIcon } from "./icon.js";
import { sectionHeader } from "./content.js";
import { flipbook } from "./flipbook.js";
import { medidas } from "./medidas.js";

/**
 * Audiodescription — player fixo na base.
 * O layout responde ao breakpoint md: Small no mobile, Default no desktop.
 *
 * O markup é só a casca; quem liga no <audio> é `initPlayer()` em player.js.
 *
 * @param {object} opts
 * @param {string} opts.src      caminho do áudio
 * @param {string} [opts.label]
 * @param {boolean} [opts.small] trava a variante Small em qualquer largura;
 *                               sem isso, o layout troca sozinho no breakpoint
 */
export function player({ src, label = "Audiodescrição", small = false } = {}) {
  // Ordem do DOM = ordem do mobile: rótulo, trilha, controles com o play no
  // meio. No desktop o play sai da linha de controles via `order` — ver
  // player.css. Não duplicar markup por breakpoint.
  return `
    <div class="player${small ? " player--small" : ""}" data-player data-playing="false">
      <audio data-player-audio src="${src}" preload="metadata"></audio>

      <div class="player__info">
        <p class="player__label">
          ${audioDescriptionIcon()}
          ${label}
          <span class="player__time" data-player-time>0:00 / 0:00</span>
        </p>
        <input
          class="media-range"
          type="range"
          data-player-range
          min="0"
          max="100"
          step="0.1"
          value="0"
          aria-label="Progresso da ${label.toLowerCase()}"
        />
      </div>

      <div class="player__actions">
        <button
          class="player__control"
          type="button"
          data-player-stop
          data-tooltip="Parar"
          aria-label="Parar"
          disabled
        >
          ${icon("stop-circle")}
        </button>

        <button
          class="player__play"
          type="button"
          data-player-toggle
          data-tooltip="Reproduzir"
          aria-label="Reproduzir ${label.toLowerCase()}"
        >
          <span class="player__icon--play">${icon("play", { fill: true })}</span>
          <span class="player__icon--pause">${icon("pause", { fill: true })}</span>
        </button>

        <button
          class="player__control"
          type="button"
          data-player-restart
          data-tooltip="Repetir"
          aria-label="Repetir desde o início"
          disabled
        >
          ${icon("repeat")}
        </button>
      </div>
    </div>`;
}

/**
 * Player de vídeo — frame 16:9 com controles próprios.
 *
 * O <video> não recebe `controls`: a barra é do design system. Quem liga tudo
 * é `initVideos()` em video-player.js.
 *
 * @param {object} opts
 * @param {string} opts.src
 * @param {string} [opts.poster]
 * @param {string} [opts.label]
 * @param {string} [opts.iconName] ícone do cabeçalho; `film` por padrão
 * @param {string} [opts.captions] caminho de um WebVTT de legendas
 */
export function video({
  src,
  poster,
  label = "Vídeo imersivo",
  iconName = "film",
  captions,
} = {}) {
  return `
    <section class="video" data-video data-playing="false" data-started="false" data-muted="true">
      ${sectionHeader({ iconName, label })}

      <div class="video__frame">
        <video
          class="video__media"
          data-video-media
          src="${src}"
          ${poster ? `poster="${poster}"` : ""}
          preload="metadata"
          playsinline
          muted
        >${captions ? `<track kind="captions" srclang="pt-BR" label="Português" src="${captions}" default>` : ""}</video>

        <button
          class="video__poster-play"
          type="button"
          data-video-poster-play
          aria-label="Reproduzir ${label.toLowerCase()}"
        >
          <span>${icon("play", { fill: true })}</span>
        </button>

        <div class="video__controls" data-video-controls>
          <button
            class="video__control"
            type="button"
            data-video-toggle
            data-tooltip="Reproduzir"
            aria-label="Reproduzir ${label.toLowerCase()}"
          >
            <span class="video__icon--play">${icon("play", { fill: true })}</span>
            <span class="video__icon--pause">${icon("pause", { fill: true })}</span>
          </button>

          <span class="video__time" data-video-time>0:00 / 0:00</span>

          <div class="video__range-wrap">
            <input
              class="media-range media-range--slim"
              type="range"
              data-video-range
              min="0"
              max="100"
              step="0.1"
              value="0"
              aria-label="Progresso do vídeo"
            />
          </div>

          <button
            class="video__control"
            type="button"
            data-video-mute
            data-tooltip="Ativar som"
            aria-label="Ativar som"
          >
            <span class="video__icon--unmuted">${icon("volume-2")}</span>
            <span class="video__icon--muted">${icon("volume-x")}</span>
          </button>

          <button
            class="video__control"
            type="button"
            data-video-fullscreen
            data-tooltip="Tela cheia"
            aria-label="Tela cheia"
          >
            ${icon("maximize")}
          </button>
        </div>
      </div>
    </section>`;
}

/**
 * Modal Revista/Quadrinho — leitor de páginas em tela cheia.
 *
 * O convite ao quiz não fica aqui: ele é a última página do próprio quadrinho,
 * acrescentada pelo flipbook. Ver style-guide, seção Flipbook.
 *
 * @param {object} opts
 * @param {Array<{src: string, alt?: string}>} opts.pages  páginas do quadrinho
 * @param {{text?: string, action?: object}} [opts.cta]     chamada do quiz
 * @param {string} [opts.label]
 */
export function modal({
  id = "modal-revista",
  pages = [],
  cta,
  label = "Quadrinho da história",
} = {}) {
  return `
    <div class="modal" id="${id}" role="dialog" aria-modal="true" aria-label="Leitor de ${label.toLowerCase()}" hidden>
      <button class="modal__close" type="button" data-modal-close data-tooltip="Fechar" aria-label="Fechar leitor">
        ${icon("x")}
      </button>

      <div class="modal__reader">
        ${flipbook({ pages, cta, label, id: `${id}-flipbook` })}
      </div>
    </div>`;
}

/** Modal para pré-visualizar um PDF externo, com link de reserva em nova guia. */
export function pdfModal({ id, title, preview, href } = {}) {
  return `
    <div class="modal modal--pdf" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-title" hidden>
      <div class="modal__document">
        <div class="modal__document-header">
          <h2 class="modal__document-title" id="${id}-title">${title}</h2>
          <div class="modal__document-actions">
            <a class="button" href="${href}" target="_blank" rel="noopener noreferrer">
              ${icon("external-link")}
              Abrir em nova guia
            </a>
            <button class="modal__close modal__close--inline" type="button" data-modal-close data-tooltip="Fechar" aria-label="Fechar visualização do PDF">
              ${icon("x")}
            </button>
          </div>
        </div>
        <iframe
          class="modal__pdf"
          data-modal-src="${preview}"
          title="Pré-visualização do PDF: ${title}"
          allow="autoplay"
        ></iframe>
        <p class="modal__document-help">
          Se a pré-visualização não carregar, use “Abrir em nova guia”.
        </p>
      </div>
    </div>`;
}

/**
 * Timeline (Banner 4) — sequência cronológica.
 *
 * A ordem do DOM é a do mobile (o ano dentro do conteúdo, à direita do
 * divisor). No desktop o ano vai para a coluna da esquerda — só CSS, ver
 * timeline.css.
 *
 * Aceita uma lista (recomendado) ou um objeto indexado pelo ano.
 *
 * @example
 * timeline([
 *   {
 *     year: "1626 – 1634",
 *     title: "Jesuítas espanhóis",
 *     image: { src: "/img/timeline/reducoes.webp", alt: "Ruínas de São Miguel" },
 *     subtitle: "Fundação das Reduções",
 *     description: "Organização agrícola e pecuária das Missões.",
 *   },
 *   // sem `image`: o bloco aparece na cor accent
 *   { year: "1750", title: "Portugueses", description: "Novos temperos." },
 * ])
 *
 * @param {Array<{year: string, title: string, image?: {src: string, alt?: string},
 *                subtitle?: string, description?: string}>
 *        | Record<string, object>} items
 */
export function timeline(items) {
  // O objeto indexado é uma conveniência; a lista é a forma canônica porque
  // preserva a ordem com qualquer rótulo (chave numérica seria reordenada).
  const lista = Array.isArray(items)
    ? items
    : Object.entries(items ?? {}).map(([year, item]) => ({ year, ...item }));

  return `
    <ol class="timeline">
      ${lista.map(timelineItem).join("")}
    </ol>`;
}

function timelineItem({ year, title, image, subtitle, description }, i) {
  return `
    <li class="timeline__item">
      <span class="timeline__divider" aria-hidden="true"></span>
      <div class="timeline__content">
        <p class="timeline__year">${year ?? ""}</p>

        <div class="timeline__image">
          ${
            image
              ? `<img src="${image.src}"${medidas(image.src)} alt="${image.alt ?? `${year ?? `Marco ${i + 1}`} — ${title ?? ""}`.trim()}" loading="lazy" decoding="async">`
              : ""
          }
        </div>

        ${title ? `<p class="timeline__title">${title}</p>` : ""}
        ${subtitle ? `<p class="timeline__subtitle">${subtitle}</p>` : ""}
        ${description ? `<p class="timeline__description">${description}</p>` : ""}
      </div>
    </li>`;
}
