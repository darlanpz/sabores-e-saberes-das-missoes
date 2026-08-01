import feather from "feather-icons";
import { icon } from "../src/components/icon.js";
import { header, menuItem, menuButton, logo } from "../src/components/navigation.js";
import { button, pillButton } from "../src/components/button.js";
import { sectionHeader, card, panel, textSection, contentList, feedback } from "../src/components/content.js";
import { player, video, modal, timeline } from "../src/components/media.js";
import { flipbook } from "../src/components/flipbook.js";
import { footer } from "../src/components/footer.js";

const USED = [
  "play", "pause", "stop-circle", "repeat", "circle", "fast-forward",
  "file-text", "menu", "x", "search", "video", "message-circle",
  "book-open", "film", "help-circle", "check-circle", "info",
  "alert-triangle", "alert-circle",
];

const missing = USED.filter((n) => !feather.icons[n]);
console.log(missing.length ? `FALHA: ícones inexistentes no Feather -> ${missing.join(", ")}` : "OK  todos os ícones existem no Feather");

const out = [
  header({ items: [{ label: "Início", current: true }, { label: "Banner 1" }] }),
  menuItem({ label: "x" }), menuButton(), logo(),
  button({ label: "Ler dissertação", iconName: "file-text" }),
  button({ label: "Quiz", iconName: "play", iconFill: true, disabled: true }),
  pillButton({ direction: "prev", label: "Anterior" }),
  sectionHeader({ iconName: "search", label: "Pesquisas" }),
  card({ title: "T", meta: "M", action: { label: "Ler", iconName: "file-text" } }),
  card({ title: "T", thumb: { iconName: "help-circle" }, action: { label: "Quiz", iconName: "play", iconFill: true } }),
  panel({ header: { iconName: "search", label: "L" }, children: [card({ title: "T" })] }),
  textSection({ title: "T", body: "B" }),
  textSection({ title: "T", highlight: true }),
  contentList([{ iconName: "video", label: "Vídeos" }]),
  feedback({ variant: "success", text: "ok" }),
  feedback({ variant: "danger", text: "erro" }),
  player({ src: "/audio/audiodescricao-exemplo.wav" }),
  video({ src: "/video/exemplo.mp4", poster: "/video/exemplo-poster.webp" }),
  modal({ pages: [{ src: "/img/quadrinho/pagina-01.webp", alt: "Página 1" }] }),
  timeline([{ year: "1750", title: "T", subtitle: "S", description: "D" }]),
  footer(),
  icon("play", { fill: true }), icon("info", { label: "Informação" }),
].join("\n");

console.log("OK  todos os componentes renderizaram sem lançar");

const undef = (out.match(/undefined/g) || []).length;
console.log(undef ? `FALHA: ${undef} "undefined" vazando para o HTML` : "OK  nenhum undefined no HTML");

const open = (out.match(/<svg/g) || []).length;
const close = (out.match(/<\/svg>/g) || []).length;
console.log(open === close ? `OK  ${open} SVGs balanceados` : `FALHA: ${open} <svg> vs ${close} </svg>`);

const decorativos = (out.match(/aria-hidden="true" focusable="false"/g) || []).length;
const rotulados = (out.match(/role="img" aria-label=/g) || []).length;
console.log(`OK  ${decorativos} ícones decorativos, ${rotulados} rotulados`);

const semLabel = [...out.matchAll(/<button(?![^>]*aria-label)[^>]*>/g)]
  .filter((m) => !/class="button/.test(m[0]));
console.log(semLabel.length ? `FALHA: ${semLabel.length} <button> só de ícone sem aria-label` : "OK  todo botão de ícone tem aria-label");

// --- Player -----------------------------------------------------------------
const p = player({ src: "/audio/audiodescricao-exemplo.wav" });
const playerChecks = [
  ["áudio real no markup", p.includes("<audio") && p.includes('src="/audio/audiodescricao-exemplo.wav"')],
  ["trilha é input[type=range]", /<input[^>]*type="range"[^>]*data-player-range/.test(p)],
  ["play e pause presentes", p.includes("player__icon--play") && p.includes("player__icon--pause")],
  ["parar e repetir começam desabilitados", (p.match(/disabled/g) || []).length === 2],
  ["tooltip nos três controles", (p.match(/data-tooltip=/g) || []).length === 3],
  ["tempo decorrido exibido", p.includes("data-player-time")],
];
for (const [nome, ok] of playerChecks) console.log(`${ok ? "OK  " : "FALHA"} player: ${nome}`);
if (playerChecks.some(([, ok]) => !ok)) process.exitCode = 1;

// --- Player de vídeo --------------------------------------------------------
const v = video({ src: "/video/exemplo.mp4", poster: "/video/exemplo-poster.webp" });
const videoChecks = [
  ["vídeo real no markup", v.includes("<video") && v.includes('src="/video/exemplo.mp4"')],
  ["sem controles nativos", !/<video[^>]*\scontrols/.test(v)],
  ["pôster definido", v.includes('poster="/video/exemplo-poster.webp"')],
  ["playsinline (não abre em tela cheia no iOS)", v.includes("playsinline")],
  ["play central de pôster", v.includes("data-video-poster-play")],
  ["barra de controles", v.includes("data-video-controls")],
  ["trilha compartilhada com o áudio", v.includes("media-range")],
  ["play, mudo e tela cheia", ["data-video-toggle", "data-video-mute", "data-video-fullscreen"].every((d) => v.includes(d))],
  ["tooltip nos controles", (v.match(/data-tooltip=/g) || []).length === 3],
];
for (const [nome, ok] of videoChecks) console.log(`${ok ? "OK  " : "FALHA"} vídeo: ${nome}`);
if (videoChecks.some(([, ok]) => !ok)) process.exitCode = 1;

// --- Flipbook ---------------------------------------------------------------
const paginas = Array.from({ length: 7 }, (_, i) => ({
  src: `/img/quadrinho/pagina-0${i + 1}.webp`,
  alt: `Página ${i + 1}`,
}));
const f = flipbook({ pages: paginas });
let embutidas = [];
try {
  embutidas = JSON.parse(f.match(/data-pages='([^']*)'/)[1]);
} catch {
  embutidas = [];
}

const flipChecks = [
  ["páginas geradas a partir da lista", embutidas.length === 8], // 7 + CTA
  ["CTA acrescentado como última página", embutidas.at(-1)?.type === "cta"],
  [
    "CTA repete texto e botão do card do quiz",
    embutidas.at(-1)?.text === "Já leu a história, responda o desafio!"
      && embutidas.at(-1)?.action?.label === "Responder o quiz",
  ],
  ["folha é decorativa para leitores de tela", /data-flip-leaf[^>]*aria-hidden="true"/.test(f)],
  ["nenhum markup por página escrito à mão", (f.match(/flipbook__page/g) || []).length === 4],
  ["folha com frente e verso", f.includes("data-flip-front") && f.includes("data-flip-back")],
  ["vinco central decorativo", f.includes("flipbook__gutter") && f.includes('aria-hidden="true"')],
  ["spread focável pelo teclado", /data-flip-spread[\s\S]{0,200}tabindex="0"/.test(f)],
  ["status em aria-live", f.includes('aria-live="polite"')],
  ["navegação anterior e próxima", f.includes("data-flip-prev") && f.includes("data-flip-next")],
];
for (const [nome, ok] of flipChecks) console.log(`${ok ? "OK  " : "FALHA"} quadrinho: ${nome}`);
if (flipChecks.some(([, ok]) => !ok)) process.exitCode = 1;

// --- API do quadrinho: quantidade, imagens e CTA são todos parametrizáveis ---
function paginasDe(markup) {
  try {
    return JSON.parse(markup.match(/data-pages='([^']*)'/)[1]);
  } catch {
    return [];
  }
}

const tresPaginas = [
  { src: "/a.webp", alt: "Chegada dos jesuítas" },
  { src: "/b.webp", alt: "O primeiro plantio" },
  { src: "/c.webp", alt: "A colheita" },
];

const custom = paginasDe(
  flipbook({
    pages: tresPaginas,
    cta: {
      text: "Chegou ao fim. Que tal testar o que aprendeu?",
      action: { label: "Fazer o quiz", href: "/quiz" },
    },
  }),
);

// Um modal com 12 páginas, provando que a quantidade também passa por ele.
const doze = paginasDe(
  modal({
    pages: Array.from({ length: 12 }, (_, i) => ({ src: `/p${i}.webp`, alt: `Página ${i + 1}` })),
    cta: { text: "Texto vindo do modal" },
  }),
);

const apiChecks = [
  ["quantidade de páginas vem da lista", custom.length === 4], // 3 + CTA
  ["imagem e alt de cada página preservados", custom[0].src === "/a.webp" && custom[1].alt === "O primeiro plantio"],
  ["texto do CTA parametrizável", custom.at(-1).text === "Chegou ao fim. Que tal testar o que aprendeu?"],
  ["rótulo do botão do CTA parametrizável", custom.at(-1).action.label === "Fazer o quiz"],
  ["destino do CTA parametrizável", custom.at(-1).action.href === "/quiz"],
  ["merge raso mantém o padrão não sobrescrito", custom.at(-1).action.iconName === "play"],
  ["modal repassa a quantidade", doze.length === 13], // 12 + CTA
  ["modal repassa o CTA", doze.at(-1).text === "Texto vindo do modal"],
  ["alt tem valor de reserva", paginasDe(flipbook({ pages: [{ src: "/x.webp" }] })).length === 2],
];
for (const [nome, ok] of apiChecks) console.log(`${ok ? "OK  " : "FALHA"} API quadrinho: ${nome}`);
if (apiChecks.some(([, ok]) => !ok)) process.exitCode = 1;

// --- API da timeline --------------------------------------------------------
const completo = timeline([
  {
    year: "1626 – 1634",
    title: "Jesuítas espanhóis",
    image: { src: "/reducoes.webp", alt: "Ruínas de São Miguel" },
    subtitle: "Fundação das Reduções",
    description: "Organização agrícola e pecuária.",
  },
]);
const semImagem = timeline([{ year: "1750", title: "Portugueses", description: "Novos temperos." }]);
const porObjeto = timeline({ "Século XVIII": { title: "Africanos", subtitle: "Saberes culinários" } });

const timelineChecks = [
  ["ano, título, subtítulo e descrição renderizados", ["1626 – 1634", "Jesuítas espanhóis", "Fundação das Reduções", "Organização agrícola e pecuária."].every((t) => completo.includes(t))],
  ["imagem informada vira <img> com alt", completo.includes('src="/reducoes.webp"') && completo.includes('alt="Ruínas de São Miguel"')],
  ["imagem carrega sob demanda", completo.includes('loading="lazy"')],
  ["sem imagem, o bloco accent continua no lugar", semImagem.includes('class="timeline__image"') && !semImagem.includes("<img")],
  ["campos ausentes não deixam buraco no HTML", !semImagem.includes("timeline__subtitle") && !semImagem.includes("undefined")],
  ["aceita objeto indexado pelo ano", porObjeto.includes("Século XVIII") && porObjeto.includes("Africanos")],
  ["alt tem valor de reserva", timeline([{ year: "1750", title: "P", image: { src: "/x.webp" } }]).includes('alt="1750 — P"')],
  ["um divisor por item", (timeline([{ year: "a" }, { year: "b" }, { year: "c" }]).match(/timeline__divider/g) || []).length === 3],
];
for (const [nome, ok] of timelineChecks) console.log(`${ok ? "OK  " : "FALHA"} timeline: ${nome}`);
if (timelineChecks.some(([, ok]) => !ok)) process.exitCode = 1;

// --- API do rodapé ----------------------------------------------------------
const rodapePadrao = footer();
const rodapeCustom = footer({
  accessibility: { title: "Acesso para todos", text: "Texto próprio de acessibilidade." },
  supporters: {
    title: "Realização",
    logos: [
      { src: "/img/logos/parceiro.webp", alt: "Parceiro Um", width: 140, href: "https://exemplo.org" },
    ],
  },
});
const rodapeSemLogos = footer({ supporters: { logos: [] } });

const footerChecks = [
  ["logos vêm de img, não de texto", (rodapePadrao.match(/<img[^>]*\/img\/logos\//g) || []).length === 7],
  ["toda logo tem alt descritivo", !/<img(?![^>]*alt="[^"]+")[^>]*class="footer__logo"/.test(rodapePadrao)],
  ["título e texto de acessibilidade parametrizáveis", rodapeCustom.includes("Acesso para todos") && rodapeCustom.includes("Texto próprio de acessibilidade.")],
  ["título das logos parametrizável", rodapeCustom.includes("Realização")],
  ["lista de logos parametrizável", rodapeCustom.includes("/img/logos/parceiro.webp") && rodapeCustom.includes('alt="Parceiro Um"')],
  ["logo aceita link", rodapeCustom.includes('href="https://exemplo.org"')],
  ["largura por logo aplicada", rodapeCustom.includes("width:140px")],
  ["sem logos, o bloco inteiro some", !rodapeSemLogos.includes("footer__logos") && rodapeSemLogos.includes("footer__title")],
  ["logos com lazy loading", rodapePadrao.includes('loading="lazy"')],
  ["sem undefined vazando", !rodapeCustom.includes("undefined")],
];
for (const [nome, ok] of footerChecks) console.log(`${ok ? "OK  " : "FALHA"} rodapé: ${nome}`);
if (footerChecks.some(([, ok]) => !ok)) process.exitCode = 1;
