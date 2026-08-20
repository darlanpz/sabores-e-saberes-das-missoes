import { medidas } from "./medidas.js";

/**
 * Footer — acessibilidade, contato e apoiadores.
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
 *   contact: {
 *     title: "Contato",
 *     text: "Para mais informações sobre a exposição…",
 *     items: [
 *       { type: "whatsapp", label: "Fale conosco pelo WhatsApp", href: "https://wa.me/…" },
 *       { type: "instagram", label: "Siga nosso Instagram", detail: "@gastro_iffar", href: "https://instagram.com/…" },
 *     ],
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
 * @param {{title?: string, text?: string}} [opts.accessibility]
 * @param {{title?: string, text?: string, items?: Array<{type: string, label: string, detail?: string, href: string}>}} [opts.contact]
 * @param {{title?: string, logos?: Array<{src: string, alt: string, width?: number, href?: string}>}} [opts.supporters]
 * @param {string} [opts.aiNote] nota de transparência sobre uso de IA, exibida abaixo das logos
 * @param {{text?: string, href?: string}} [opts.credit]
 */
export function footer({ accessibility, contact, supporters, aiNote, credit } = {}) {
  const acessibilidade = { ...ACESSIBILIDADE_PADRAO, ...accessibility };
  const contato = {
    ...CONTATO_PADRAO,
    ...contact,
    items: contact?.items ?? CONTATO_PADRAO.items,
  };
  const apoiadores = { ...APOIADORES_PADRAO, ...supporters };
  const credito = { ...CREDITO_PADRAO, ...credit };

  return `
    <footer class="footer">
      <div class="footer__top">
        <section class="footer__block">
          <h2 class="footer__title">${contato.title}</h2>
          <p class="footer__text">${contato.text}</p>
          <div class="footer__contact-list">
            ${contato.items.map(itemContato).join("")}
          </div>
        </section>

        <section class="footer__block">
          <h2 class="footer__title">${acessibilidade.title}</h2>
          <p class="footer__text">${acessibilidade.text}</p>
        </section>
      </div>

      ${apoiadores.logos.length ? blocoApoiadores(apoiadores) : ""}

      ${aiNote ? `<p class="footer__ai-note">${aiNote}</p>` : ""}

      <a class="footer__credit" href="${credito.href}" target="_blank" rel="noopener noreferrer">${credito.text}</a>
    </footer>`;
}

function itemContato({ type, label, detail, href }) {
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

const CONTATO_PADRAO = {
  title: "Contato",
  text: "Para mais informações sobre a exposição, entre em contato com a equipe do projeto.",
  items: [
    {
      type: "whatsapp",
      label: "Fale conosco pelo WhatsApp",
      href: "https://wa.me/5555996747793",
    },
    {
      type: "instagram",
      label: "Siga o Instagram do projeto",
      detail: "@gastro_iffar",
      href: "https://www.instagram.com/gastro_iffar",
    },
  ],
};

const CREDITO_PADRAO = {
  text: "Desenvolvido por gapz visual.",
  href: "https://www.gapzvisual.com.br",
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
