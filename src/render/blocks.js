import { panel, card, textSection, contentList, sectionHeader } from "../components/content.js";
import { video, timeline } from "../components/media.js";
// Renomeado: o bloco de vídeo já usa `icon` como nome de campo.
import { icon as glifo } from "../components/icon.js";
import { medidas } from "../components/medidas.js";

/**
 * Tradutores de bloco: cada tipo do JSON vira um componente existente.
 * Nenhum HTML novo nasce aqui — só a ligação entre conteúdo e componente.
 */
const TIPOS = {
  /** Título + parágrafo. */
  text: ({ title, body, level = 2 }) => textSection({ title, body, level }),

  /**
   * Frase de destaque em Cinzel. Com `body`, o parágrafo vem logo abaixo e
   * mais próximo do que dois blocos separados ficariam.
   */
  quote: ({ text, body, level = 2 }) =>
    textSection({ title: text, body, highlight: true, level }),

  /** Lista de tipos de conteúdo (ícone + rótulo). */
  list: ({ items = [] }) =>
    contentList(items.map(({ icon, label }) => ({ iconName: icon, label }))),

  /**
   * Imagem ilustrativa da coluna de texto.
   *
   * `blend: "screen"` é para as artes que ainda vêm com halo claro em volta em
   * vez de transparência — a mesclagem faz esse entorno sumir no fundo.
   * `rounded: true` arredonda os cantos, para as artes que ocupam uma caixa
   * própria em vez de se dissolverem no fundo.
   */
  image: ({ src, alt, blend, rounded }) => {
    const variantes = [blend && `fade-image--${blend}`, rounded && "fade-image--rounded"]
      .filter(Boolean)
      .join(" ");

    return `
    <figure class="fade-image${variantes ? ` ${variantes}` : ""}">
      <img class="fade-image__img" src="${src}"${medidas(src)} alt="${alt ?? ""}" loading="lazy" decoding="async">
    </figure>`;
  },

  /** Painel de conteúdo com cards. */
  panel: ({ header, items = [] }) =>
    panel({
      header: header ? { iconName: header.icon, label: header.label } : null,
      children: items.map((item) =>
        card({
          title: item.title,
          meta: item.meta,
          thumb: item.thumb,
          action: item.action
            ? {
                label: item.action.label,
                iconName: item.action.icon,
                iconFill: item.action.iconFill,
                href: item.action.href,
                opens: item.action.opens,
              }
            : null,
        }),
      ),
    }),

  /** Player de vídeo. */
  video: ({ src, poster, label, icon, captions }) =>
    video({ src, poster, label, iconName: icon, captions }),

  /**
   * Linha do tempo. Com `header`, ela vem dentro de um painel — é como o
   * Banner 4 apresenta as migrações.
   */
  timeline: ({ header, items = [] }) => {
    const lista = timeline(items);
    if (!header) return lista;

    return `
      <section class="panel">
        ${sectionHeader({ iconName: header.icon, label: header.label })}
        <div class="panel__box">${lista}</div>
      </section>`;
  },

  /**
   * Abertura da home: texto à esquerda e, no desktop, uma imagem compondo à
   * direita. No mobile a imagem desce para baixo do texto.
   */
  intro: ({ title, lead, text, image }) => `
    <section class="intro">
      <div class="intro__content">
        <h1 class="intro__title">${title}</h1>
        ${lead ? `<p class="intro__lead">${lead}</p>` : ""}
        ${text ? `<p class="intro__text">${text}</p>` : ""}
      </div>
      ${
        image
          ? `<figure class="intro__figure">
              <img src="${image.src}"${medidas(image.src)} alt="${image.alt ?? ""}" fetchpriority="high">
            </figure>`
          : ""
      }
    </section>`,

  /**
   * Grade de acesso aos banners.
   *
   * A imagem e o destino saem do próprio `pages`, pelo `slug`: assim o card
   * nunca fica apontando para um hero que mudou de nome, e não há caminho de
   * imagem repetido no JSON.
   */
  banners: ({ items = [] }, { pages = {} } = {}) => `
    <ul class="banner-grid">
      ${items.map((item) => cartaoBanner(item, pages[item.slug])).join("")}
    </ul>`,
};

/** Um card da grade da home. */
function cartaoBanner({ slug, title, description, tags = [] }, page) {
  const hero = page?.hero;

  return `
    <li class="banner-grid__item">
      <a class="banner-card" href="/${slug}/">
        <span class="banner-card__media">
          ${
            hero
              ? `<img src="${hero.src}"${medidas(hero.src)} alt="" loading="lazy" decoding="async"${
                  hero.position ? ` style="object-position:${hero.position}"` : ""
                }>`
              : ""
          }
        </span>
        <span class="banner-card__body">
          <span class="banner-card__title">${title}</span>
          <span class="banner-card__text">${description}</span>
          ${
            tags.length
              ? `<span class="banner-card__tags">
                  ${tags
                    .map(
                      (tag) => `
                    <span class="banner-card__tag">
                      ${glifo(tag.icon, { size: 16 })}
                      ${tag.label}
                    </span>`,
                    )
                    .join("")}
                </span>`
              : ""
          }
        </span>
      </a>
    </li>`;
}

/**
 * Converte um bloco do JSON em HTML.
 * Tipo desconhecido falha alto: é erro de conteúdo, não algo para engolir.
 */
export function renderBlock(block, contexto = {}) {
  const tradutor = TIPOS[block.type];
  if (!tradutor) {
    throw new Error(
      `Bloco de tipo "${block.type}" não existe. Tipos válidos: ${Object.keys(TIPOS).join(", ")}`,
    );
  }
  return tradutor(block, contexto);
}

export const TIPOS_DE_BLOCO = Object.keys(TIPOS);
