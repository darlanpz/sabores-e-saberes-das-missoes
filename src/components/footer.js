import { medidas } from "./medidas.js";

/**
 * Footer — bloco de acessibilidade + apoiadores.
 *
 * Todo o conteúdo entra por parâmetro: os dois títulos, o texto de
 * acessibilidade e a lista de logos.
 *
 * @example
 * footer({
 *   accessibility: {
 *     title: "ACESSIBILIDADE",
 *     text: "Esta exposição conta com audiodescrição…",
 *   },
 *   supporters: {
 *     title: "Apoiadores",
 *     logos: [
 *       { src: "/img/logos/logo-01.webp", alt: "Instituto Federal Farroupilha", width: 177 },
 *       { src: "/img/logos/logo-04.webp", alt: "PGDTTG", width: 135, href: "https://…" },
 *     ],
 *   },
 * })
 *
 * @param {object} [opts]
 * @param {{title?: string, text?: string, email?: string}} [opts.about]
 * @param {{title?: string, text?: string}} [opts.accessibility]
 * @param {{title?: string, logos?: Array<{src: string, alt: string, width?: number, href?: string}>}} [opts.supporters]
 */
export function footer({ about, accessibility, supporters } = {}) {
  const sobre = { ...about };
  const acessibilidade = { ...ACESSIBILIDADE_PADRAO, ...accessibility };
  const apoiadores = { ...APOIADORES_PADRAO, ...supporters };

  return `
    <footer class="footer">

      ${
        sobre.title || sobre.text || sobre.email
          ? `<section class="footer__block">
              ${sobre.title ? `<h2 class="footer__title">${sobre.title}</h2>` : ""}
              ${sobre.text ? `<p class="footer__text">${sobre.text}</p>` : ""}
              ${sobre.email ? `<a href="mailto:${sobre.email}" class="footer__link">${sobre.email}</a>` : ""}
            </section>`
          : ""
      }

      <section class="footer__block">
        <h2 class="footer__title">${acessibilidade.title}</h2>
        <p class="footer__text">${acessibilidade.text}</p>
      </section>

      ${apoiadores.logos.length ? blocoApoiadores(apoiadores) : ""}
    </footer>`;
}

function blocoApoiadores({ title, logos }) {
  return `
    <section class="footer__block footer__block--supporters">
      <h2 class="footer__title">${title}</h2>
      <ul class="footer__logos">
        ${logos.map(itemLogo).join("")}
      </ul>
    </section>`;
}

function itemLogo({ src, alt, width, href }) {
  // A largura vem do Figma e varia por logo; a altura é sempre 48px.
  const estilo = width ? ` style="width:${width}px"` : "";
  const img = `<img class="footer__logo" src="${src}"${medidas(src)} alt="${alt}"${estilo} loading="lazy" decoding="async">`;

  return `
    <li class="footer__logo-item">
      ${href ? `<a href="${href}" rel="noopener">${img}</a>` : img}
    </li>`;
}

/* -------------------------------------------------------------------------- */

const ACESSIBILIDADE_PADRAO = {
  title: "ACESSIBILIDADE",
  text: "Esta exposição conta com audiodescrição dos banners e resumos acessíveis dos conteúdos disponíveis nos QR Codes, legendas e janelas de Libras nos vídeos e apostila com descrição dos textos em Braille, promovendo uma experiência inclusiva para todos os públicos.",
};

const APOIADORES_PADRAO = {
  title: "Apoiadores",
  logos: [
    { src: "/img/logos/logo-01.webp", alt: "Instituto Federal Farroupilha", width: 177 },
    { src: "/img/logos/logo-02.webp", alt: "Tecnologia em Gastronomia — curso superior", width: 160 },
    { src: "/img/logos/logo-03.webp", alt: "Gestão de Turismo", width: 148 },
    { src: "/img/logos/logo-04.webp", alt: "PGDTTG — Pós-graduação em Desenvolvimento Territorial, Turismo e Gastronomia", width: 135 },
    { src: "/img/logos/logo-05.webp", alt: "Unijuí — Universidade Regional", width: 153 },
    { src: "/img/logos/logo-06.webp", alt: "Desenvolvimento Regional Unijuí — Mestrado e Doutorado", width: 120 },
    { src: "/img/logos/logo-07.webp", alt: "Educação nas Ciências — Mestrado e Doutorado", width: 153 },
    { src: "/img/logos/logo-08.webp", alt: "400 anos Missões Jesuíticas Guaranis — Secretaria da Cultura do Governo do Estado do Rio Grande do Sul", width: 148 },
  ],
};
