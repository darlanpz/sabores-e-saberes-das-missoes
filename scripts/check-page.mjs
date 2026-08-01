/**
 * Executa o bundle de produção contra um DOM mínimo, só para provar que a
 * montagem da página não lança e que o HTML e o CSS gerados têm o que deveriam.
 * Rode `npm run build` antes.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ASSETS = join(import.meta.dirname, "..", "dist", "assets");

let html = "";
const noop = () => {};

const stubEl = {
  focus: noop,
  addEventListener: noop,
  setAttribute: noop,
  getAttribute: () => "false",
  querySelector: () => stubEl,
  textContent: "",
  style: {},
  hidden: true,
};

globalThis.MutationObserver = class {
  observe() {}
};

globalThis.document = {
  createElement: () => ({ relList: { supports: () => true } }),
  querySelector(sel) {
    if (sel === "#app") {
      return {
        set innerHTML(value) {
          html = value;
        },
      };
    }
    return stubEl;
  },
  querySelectorAll: () => [],
  addEventListener: noop,
  body: { style: {} },
};

// A biblioteca de componentes é uma das entradas do build multi-página.
const bundleName = readdirSync(ASSETS).find((f) => f.startsWith("styleguide") && f.endsWith(".js"));
// O CSS dos componentes vai para o chunk compartilhado.
const cssName = readdirSync(ASSETS)
  .filter((f) => f.endsWith(".css"))
  .sort((a, b) => statSync(join(ASSETS, b)).size - statSync(join(ASSETS, a)).size)[0];

await import(pathToFileURL(join(ASSETS, bundleName)).href);

const js = readFileSync(join(ASSETS, bundleName), "utf8");
const css = readFileSync(join(ASSETS, cssName), "utf8");

const checks = [
  ["página montou", html.length > 10000],
  ["9 seções", (html.match(/class="sg-section"/g) || []).length === 9],
  ["sumário preenchido", html.includes('class="sg__toc"') && html.includes('href="#cores"')],
  ["ids sem acento", !/id="[^"]*[áàâãéêíóôõúç]/i.test(html)],
  ["sem undefined vazando", !html.includes("undefined")],
  ["sem [object Object]", !html.includes("[object Object]")],
  ["SVGs balanceados", (html.match(/<svg/g) || []).length === (html.match(/<\/svg>/g) || []).length],
  ["modal presente", html.includes('role="dialog"')],
  ["dois players de áudio funcionais", (html.match(/data-player-audio/g) || []).length === 2],
  ["player de vídeo funcional", (html.match(/data-video-media/g) || []).length === 1],
  ["um deles é a variante Small", (html.match(/player player--small/g) || []).length === 1],
  ["play entre parar e repetir no DOM", playEntreControles(html)],
  ["rodapé presente", html.includes('class="footer"')],
  ["timeline com divisor decorativo", (html.match(/timeline__divider/g) || []).length === 4],
  ["timeline com espaço reservado de imagem", (html.match(/timeline__image/g) || []).length === 4],
  ["ano dentro do conteúdo no DOM", timelineAnoNoConteudo(html)],
  ["hero em webp", js.includes("hero-banner1.webp")],
  ["pattern em webp", css.includes("pattern-missoes.webp")],
  // O pattern é um pseudo-elemento com z-index negativo: um fundo opaco no
  // body pinta por cima dele e o esconde em todas as páginas.
  ["fundo no html, não no body", /html\{[^}]*background-color:var\(--color-primary\)/.test(css)],
  ["body sem fundo próprio", !/[^-]body\{[^}]*background-color/.test(css)],
  // O screen deixou de ser regra e virou exceção declarada por imagem no JSON.
  ["blend só na variante declarada", !/[^-]fade-image__img\{[^}]*mix-blend/.test(css)],
  ["anel de foco definido", css.includes(":focus-visible")],
  // O tooltip só oferece um contexto de posicionamento padrão; sem `:where()`
  // ele empata em especificidade e rouba o posicionamento de quem o usa.
  ["tooltip não sequestra o posicionamento", css.includes(":where([data-tooltip])")],
  ["prefers-reduced-motion respeitado", css.includes("prefers-reduced-motion")],
  ["nenhuma cor fora da paleta", coresForaDaPaleta(css).length === 0],
];

let falhou = false;
for (const [nome, ok] of checks) {
  console.log(`${ok ? "OK  " : "FALHA"} ${nome}`);
  if (!ok) falhou = true;
}

if (falhou) {
  const fora = coresForaDaPaleta(css);
  if (fora.length) console.log(`\nCores fora da paleta: ${fora.join(", ")}`);
}

process.exit(falhou ? 1 : 0);

/**
 * A ordem do DOM é a do mobile: parar → play → repetir, tudo dentro da linha de
 * controles. O desktop só reordena via CSS, então essa ordem não pode mudar.
 */
function playEntreControles(markup) {
  const acoes = markup.indexOf("player__actions");
  const parar = markup.indexOf("data-player-stop");
  const play = markup.indexOf("data-player-toggle");
  const repetir = markup.indexOf("data-player-restart");

  return [acoes, parar, play, repetir].every((i) => i !== -1)
    && acoes < parar && parar < play && play < repetir;
}

/**
 * A ordem do DOM da timeline é a do mobile: divisor, depois o conteúdo com o
 * ano na frente. O desktop só reposiciona por grid, então essa ordem precisa
 * se manter.
 */
function timelineAnoNoConteudo(markup) {
  const item = markup.slice(markup.indexOf("timeline__item"));
  const divisor = item.indexOf("timeline__divider");
  const conteudo = item.indexOf("timeline__content");
  const ano = item.indexOf("timeline__year");
  const imagem = item.indexOf("timeline__image");

  return [divisor, conteudo, ano, imagem].every((i) => i !== -1)
    && divisor < conteudo && conteudo < ano && ano < imagem;
}

/**
 * Cores permitidas no CSS final: as quatro da paleta, as três semânticas
 * (que só deveriam aparecer em tokens.css) e preto/branco puros, que o style
 * guide usa em overlays, vinhetas e nas páginas do modal.
 */
function coresForaDaPaleta(cssText) {
  const PALETA = [
    "19120d", "4a3427", "e8c37d", "f7ebd8", // paleta da marca
    "e06552", "ea9d2a", "9bbf69",           // semânticas
    "000000", "ffffff",                     // overlays, vinhetas, páginas do modal
  ];
  const hexes = cssText.match(/#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi) || [];

  return [...new Set(hexes)].filter((hex) => {
    const corpo = hex.slice(1).toLowerCase();
    // 3/4 dígitos: cada dígito duplica. 6/8: os 6 primeiros são o RGB.
    // O alfa é ignorado — opacidade sobre uma cor da paleta continua na paleta.
    const rgb =
      corpo.length <= 4
        ? corpo.slice(0, 3).split("").map((d) => d + d).join("")
        : corpo.slice(0, 6);
    return !PALETA.includes(rgb);
  });
}
