import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components/header.css";
import "./styles/components/menu-item.css";
import "./styles/components/menu-button.css";
import "./styles/components/button.css";
import "./styles/components/card.css";
import "./styles/components/panel.css";
import "./styles/components/media-range.css";
import "./styles/components/player.css";
import "./styles/components/modal.css";
import "./styles/components/flipbook.css";
import "./styles/components/video.css";
import "./styles/components/timeline.css";
import "./styles/components/footer.css";
import "./styles/components/feedback.css";
import "./styles/components/hero.css";
import "./styles/components/tooltip.css";
import "./styles/styleguide.css";

import { icon } from "./components/icon.js";
import { header, menuItem, menuButton, logo } from "./components/navigation.js";
import { button, pillButton } from "./components/button.js";
import {
  sectionHeader,
  card,
  panel,
  textSection,
  contentList,
  feedback,
} from "./components/content.js";
import { player, video, modal, timeline } from "./components/media.js";
import { initPlayers } from "./components/player.js";
import { initVideos } from "./components/video-player.js";
import { initFlipbooks } from "./components/flipbook.js";
import { initMenus } from "./components/menu.js";
import { initModals } from "./components/modal.js";
import { footer } from "./components/footer.js";

const AUDIO_EXEMPLO = "/audio/audiodescricao-exemplo.wav";
const VIDEO_EXEMPLO = "/video/exemplo.mp4";
const VIDEO_POSTER = "/video/exemplo-poster.webp";

// Placeholders — trocar pelas páginas reais quando existirem. O componente
// gera o leitor a partir desta lista e acrescenta o CTA como última página.
// Sete páginas de propósito: número ímpar, para exercitar a folha em branco.
const PAGINAS_QUADRINHO = Array.from({ length: 7 }, (_, i) => ({
  src: `/img/quadrinho/pagina-${String(i + 1).padStart(2, "0")}.webp`,
  alt: `Página ${i + 1} do quadrinho`,
}));

/* --------------------------------------------------------------------------
   Helpers da página de demonstração
   -------------------------------------------------------------------------- */

const SECTIONS = [];

function section({ number, title, note, content }) {
  const id = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  SECTIONS.push({ id, title });

  return `
    <section class="sg-section" id="${id}">
      <div class="sg-section__head">
        <span class="sg-section__number">${number}</span>
        <h2>${title}</h2>
        ${note ? `<p class="sg-section__note">${note}</p>` : ""}
      </div>
      ${content}
    </section>`;
}

function block({ label, spec, stage = "", modifier = "" }) {
  return `
    <div class="sg-block">
      <p class="sg-block__label">
        ${label}
        ${spec ? `<span class="sg-block__spec">${spec}</span>` : ""}
      </p>
      <div class="sg-stage ${modifier}">${stage}</div>
    </div>`;
}

function swatch({ name, value, use, background }) {
  return `
    <div class="sg-swatch">
      <div class="sg-swatch__chip" style="background: ${background ?? `var(${name})`}"></div>
      <span class="sg-swatch__name">${name}</span>
      <span class="sg-swatch__value">${value}</span>
      ${use ? `<span class="sg-swatch__use">${use}</span>` : ""}
    </div>`;
}

/* --------------------------------------------------------------------------
   3. Cores
   -------------------------------------------------------------------------- */

const cores = section({
  number: "3",
  title: "Cores",
  note: "Quatro cores compõem todo o sistema. Derivados e estados semânticos são sempre composições delas — nenhum tom novo entra na paleta.",
  content: `
    ${block({
      label: "Paleta principal",
      spec: "--color-*",
      stage: `<div class="sg-grid" style="width:100%">
        ${swatch({ name: "--color-primary", value: "#19120D", use: "Fundo, cards, ícones" })}
        ${swatch({ name: "--color-secondary", value: "#4A3427", use: "Cards primários, sections" })}
        ${swatch({ name: "--color-accent", value: "#E8C37D", use: "Destaques, botões, títulos" })}
        ${swatch({ name: "--color-text", value: "#F7EBD8", use: "Corpo de texto" })}
      </div>`,
    })}

    ${block({
      label: "Derivados e overlays",
      spec: "opacidade sobre a paleta",
      stage: `<div class="sg-grid" style="width:100%">
        ${swatch({ name: "--color-text-muted", value: "text @ 70%", use: "Autor, legenda" })}
        ${swatch({ name: "--color-border-subtle", value: "text @ 20%", use: "Contorno do botão-pílula" })}
        ${swatch({ name: "--color-overlay", value: "preto @ 40%", use: "Fundo do modal" })}
        ${swatch({ name: "--color-accent-hover", value: "accent 85% + text", use: "Hover do botão" })}
        ${swatch({ name: "--color-accent-active", value: "accent 88% + primary", use: "Botão pressionado" })}
      </div>`,
    })}

    ${block({
      label: "Semânticas",
      spec: "quentes e terrosas, na faixa de claridade do accent",
      stage: `<div class="sg-grid" style="width:100%">
        ${swatch({ name: "--color-danger", value: "#E06552 · hsl(8, 70%, 60%)", use: "Erro — telha/cerâmica" })}
        ${swatch({ name: "--color-warning", value: "#EA9D2A · hsl(36, 82%, 54%)", use: "Atenção — ocre/âmbar" })}
        ${swatch({ name: "--color-success", value: "#9BBF69 · hsl(85, 40%, 58%)", use: "Sucesso — sálvia/oliva" })}
        ${swatch({ name: "--color-accent", value: "#E8C37D · hsl(39, 70%, 70%)", use: "(accent, para comparar)" })}
      </div>`,
    })}

    ${block({
      label: "Feedback",
      spec: "cor no ícone e na borda · superfície e texto não mudam",
      modifier: "sg-stage--stack",
      stage: `
        ${feedback({ variant: "success", text: "Audiodescrição concluída." })}
        ${feedback({ variant: "info", text: "Escaneie o QR Code com a câmera do celular para acessar o conteúdo completo." })}
        ${feedback({ variant: "warning", text: "Este vídeo ainda não possui janela de Libras." })}
        ${feedback({ variant: "danger", text: "Não foi possível carregar a audiodescrição. Tente novamente." })}
        <p class="sg-section__note">
          Informação usa o neutro de propósito — é o estado mais silencioso, e o accent aqui ficaria
          confundível com atenção. O ícone é obrigatório nos quatro casos: cor nunca é o único sinal.
        </p>`,
    })}

    ${block({
      label: "Contraste",
      spec: "todas as combinações passam em AAA",
      modifier: "sg-stage--stack",
      stage: `
        <div class="sg-grid" style="width:100%">
          ${swatch({ name: "text / primary", value: "15,7:1", background: "linear-gradient(var(--color-primary),var(--color-primary))", use: "Texto corrido" })}
          ${swatch({ name: "text / secondary", value: "9,9:1", background: "var(--color-secondary)", use: "Texto no painel" })}
          ${swatch({ name: "accent / primary", value: "11,0:1", background: "var(--color-primary)", use: "Títulos" })}
          ${swatch({ name: "accent / secondary", value: "6,9:1", background: "var(--color-secondary)", use: "Ícones no painel" })}
          ${swatch({ name: "primary / accent", value: "11,0:1", background: "var(--color-accent)", use: "Texto do botão" })}
        </div>`,
    })}`,
});

/* --------------------------------------------------------------------------
   4. Tipografia
   -------------------------------------------------------------------------- */

const TYPE_SCALE = [
  { token: "--text-h1", spec: "Cinzel Bold · 36/24px · 1.1", sample: "Bem-vindo(a)!", style: "font-family:var(--font-heading);font-weight:700;font-size:var(--text-h1);line-height:1.1;color:var(--color-accent)" },
  { token: "--text-h2", spec: "Cinzel Bold · 24/20px · 1.4", sample: "Conhecer a nossa cultura alimentar é reconhecer as raízes que nos unem.", style: "font-family:var(--font-heading);font-weight:700;font-size:var(--text-h2);line-height:1.4;color:var(--color-accent)" },
  { token: "--text-h3", spec: "Cinzel Bold · 20px · 1.1", sample: "ACESSIBILIDADE", style: "font-family:var(--font-heading);font-weight:700;font-size:var(--text-h3);line-height:1.1;color:var(--color-accent)" },
  { token: "--text-body", spec: "Source Sans 3 Regular · 20/16px · 1.5", sample: "Conheça os patrimônios alimentares da região das Missões e sua importância na formação da identidade do povo missioneiro.", style: "font-size:var(--text-body);line-height:1.5" },
  { token: "--text-card-title", spec: "Source Sans 3 Regular · 20/16px · 1.2", sample: "A gastronomia como propulsora do desenvolvimento turístico de lugares", style: "font-size:var(--text-card-title);line-height:1.2" },
  { token: "--text-label", spec: "Source Sans 3 Medium · 20/16px · 1", sample: "Pesquisas e publicações científicas", style: "font-size:var(--text-label);font-weight:500;line-height:1" },
  { token: "--text-action", spec: "Source Sans 3 Regular · 20px · 1 · capitalize", sample: "Ler dissertação", style: "font-size:var(--text-action);line-height:1;text-transform:capitalize" },
  { token: "--text-meta", spec: "Source Sans 3 Regular · 16px · 1.5 · 70%", sample: "Aline Prestes Roque", style: "font-size:var(--text-meta);line-height:1.5;color:var(--color-text-muted)" },
  { token: "--text-small", spec: "Source Sans 3 Regular · 16/14px · 1.5", sample: "Esta exposição conta com audiodescrição dos banners e resumos acessíveis dos conteúdos.", style: "font-size:var(--text-small);line-height:1.5" },
];

const tipografia = section({
  number: "4",
  title: "Tipografia",
  note: "Cinzel é usada apenas em Bold e já é uma fonte de caixa alta por desenho — nunca aplicar uppercase por cima. Os tamanhos mudam no breakpoint md; --text-action não reduz no mobile para preservar a área de toque.",
  content: `
    <div class="sg-type">
      ${TYPE_SCALE.map(
        ({ token, spec, sample, style }) => `
        <div class="sg-type__row">
          <p class="sg-block__label">${token}<span class="sg-block__spec">${spec}</span></p>
          <p class="sg-type__sample" style="${style}">${sample}</p>
        </div>`,
      ).join("")}
    </div>`,
});

/* --------------------------------------------------------------------------
   5 e 6. Espaçamento, layout e bordas
   -------------------------------------------------------------------------- */

const SPACING = [
  ["--space-1", 4], ["--space-2", 8], ["--space-3", 12], ["--space-4", 16],
  ["--space-5", 20], ["--space-6", 24], ["--space-8", 32], ["--space-10", 40],
  ["--space-12", 48], ["--space-15", 60],
];

const RADII = [
  ["--radius-sm", "8px"], ["--radius-md", "12px"],
  ["--radius-lg", "24px"], ["--radius-full", "999px"],
];

const espacamento = section({
  number: "5 · 6",
  title: "Espaçamento e bordas",
  note: "Escala de base 4px, onde o número do token é o multiplicador. A hierarquia vem da cor de fundo, não de elevação — a única sombra do sistema é a das páginas do modal.",
  content: `
    ${block({
      label: "Escala de espaçamento",
      spec: "--space-N = N × 4px",
      modifier: "sg-stage--stack",
      stage: `<div class="sg-space">
        ${SPACING.map(
          ([name, px]) => `
          <div class="sg-space__row">
            <span class="sg-space__name">${name}</span>
            <span class="sg-space__bar" style="width:${px}px"></span>
            <span class="sg-swatch__value">${px}px</span>
          </div>`,
        ).join("")}
      </div>`,
    })}

    ${block({
      label: "Raios",
      spec: "--radius-*",
      stage: `<div class="sg-radius">
        ${RADII.map(
          ([name, value]) =>
            `<div class="sg-radius__box" style="border-radius:${value}">${value}</div>`,
        ).join("")}
      </div>`,
    })}

    ${block({
      label: "Grid do banner",
      spec: "459px + 24px + 711px · conteúdo 1184px",
      modifier: "sg-stage--stack",
      stage: `<div class="sg-columns">
        <div class="sg-radius__box" style="width:100%;height:80px;border-radius:var(--radius-lg);place-items:center">coluna de texto</div>
        <div class="sg-radius__box" style="width:100%;height:80px;border-radius:var(--radius-lg);place-items:center">painel de conteúdo</div>
      </div>`,
    })}`,
});

/* --------------------------------------------------------------------------
   7. Ícones
   -------------------------------------------------------------------------- */

const ICON_SET = [
  { name: "play", fill: true }, { name: "pause", fill: true },
  { name: "stop-circle" }, { name: "repeat" }, { name: "circle", fill: true },
  { name: "fast-forward", fill: true }, { name: "file-text" }, { name: "menu" },
  { name: "x" }, { name: "search" }, { name: "video" }, { name: "message-circle" },
  { name: "book-open" }, { name: "film" }, { name: "help-circle" },
  { name: "check-circle" }, { name: "info" }, { name: "alert-triangle" },
  { name: "alert-circle" },
];

const icones = section({
  number: "7",
  title: "Ícones",
  note: "Feather é a única biblioteca. Traço 1.5, cor herdada de currentColor. Feather é outline por natureza — as variantes fill sobrescrevem fill e stroke. O selo de audiodescrição não tem equivalente no Feather e é asset próprio.",
  content: `
    ${block({
      label: "Conjunto em uso",
      spec: "24px · stroke 1.5 · • = fill",
      stage: `<div class="sg-icons" style="width:100%">
        ${ICON_SET.map(
          ({ name, fill }) => `
          <div class="sg-icons__item">
            ${icon(name, { fill })}
            <span class="sg-icons__name">${name}${fill ? " •" : ""}</span>
          </div>`,
        ).join("")}
        <div class="sg-icons__item">
          <img src="/icons/audio-description.svg" alt="" width="24" height="24" />
          <span class="sg-icons__name">audio-description</span>
        </div>
      </div>`,
    })}

    ${block({
      label: "Tamanhos",
      spec: "--icon-sm 24 · --icon-md 48 · --icon-lg 72",
      stage: `
        <span style="color:var(--color-accent)">${icon("book-open", { size: 24 })}</span>
        <span style="color:var(--color-accent)">${icon("book-open", { size: 48 })}</span>
        <span style="color:var(--color-accent)">${icon("book-open", { size: 72 })}</span>`,
    })}`,
});

/* --------------------------------------------------------------------------
   10. Componentes
   -------------------------------------------------------------------------- */

const NAV_ITEMS = [
  { label: "Início", href: "#", current: true },
  { label: "Banner 1", href: "#" },
  { label: "Banner 2", href: "#" },
  { label: "Banner 3", href: "#" },
  { label: "Banner 4", href: "#" },
  { label: "Banner 5", href: "#" },
];

const navegacao = section({
  number: "10.1",
  title: "Navegação",
  note: "O sublinhado do menu-item é a pincelada “Detalhes linha” exportada do Figma, não um border-bottom. Como ele também marca o hover, o foco precisa de indicador próprio — o anel de foco global.",
  content: `
    ${block({
      label: "Header",
      spec: "padding 24/48px desktop · 16px mobile",
      modifier: "sg-stage--flush",
      stage: header({ items: NAV_ITEMS }),
    })}

    ${block({
      label: "menu-item",
      spec: "padding 16px 20px · Source Sans 3 20/1 capitalize",
      stage: `
        ${menuItem({ label: "Default" })}
        ${menuItem({ label: "Active", current: true })}`,
    })}

    ${block({
      label: "Menu-button",
      spec: "48 × 48px · aria-expanded alterna menu ↔ x",
      stage: `<div style="display:flex;gap:var(--space-6)">
        ${menuButton()}
        ${menuButton({ expanded: true })}
      </div>`,
    })}

    ${block({
      label: "Logo",
      spec: "162 × 69px desktop · 99 × 42px mobile",
      stage: `<div style="width:162px;height:69px">${logo({ className: "" })}</div>`,
    })}`,
});

const botoes = section({
  number: "10.2",
  title: "Botões",
  note: "O botão primário é o único botão do sistema. Altura resultante de 48px, dentro da área mínima de toque. Hover e active derivam do accent misturado com text e primary.",
  content: `
    ${block({
      label: "Botão primário",
      spec: "padding 12/16px · radius 8px · gap 12px",
      stage: `
        ${button({ label: "Ler dissertação", iconName: "file-text" })}
        ${button({ label: "Ler quadrinho", iconName: "book-open" })}
        ${button({ label: "Responder o quiz", iconName: "play", iconFill: true })}
        ${button({ label: "Indisponível", iconName: "file-text", disabled: true })}`,
    })}

    ${block({
      label: "Botão-pílula",
      spec: "contorno 1px @ 20% · miolo accent · padding assimétrico",
      stage: `
        ${pillButton({ direction: "prev", label: "Página anterior" })}
        ${pillButton({ direction: "next", label: "Próxima página" })}`,
    })}`,
});

const conteudo = section({
  number: "10.3",
  title: "Conteúdo",
  note: "O painel usa --color-secondary e os cards dentro dele usam --color-primary. É essa troca que cria a hierarquia, já que o sistema não tem sombras.",
  content: `
    ${block({
      label: "Cabeçalho de seção",
      spec: "ícone 24px + rótulo Medium · gap 12px",
      stage: sectionHeader({ iconName: "search", label: "Pesquisas e publicações científicas" }),
    })}

    ${block({
      label: "Card de item",
      spec: "fundo primary · padding 24/16px · radius 12px",
      modifier: "sg-stage--stack sg-stage--narrow",
      stage: card({
        title:
          "A gastronomia como propulsora do desenvolvimento turístico de lugares: estudo em três municípios missioneiros",
        meta: "Aline Prestes Roque",
        action: { label: "Ler dissertação", iconName: "file-text" },
      }),
    })}

    ${block({
      label: "Card com miniatura",
      spec: "thumb 72 × 72px · radius 7.2px",
      modifier: "sg-stage--stack",
      stage: card({
        title: "Já leu a história, responda o desafio!",
        thumb: { iconName: "help-circle" },
        action: { label: "Responder o quiz", iconName: "play", iconFill: true },
      }),
    })}

    ${block({
      label: "Painel de conteúdo",
      spec: "fundo secondary · padding 24/16px · radius 24px",
      modifier: "sg-stage--stack",
      stage: panel({
        header: { iconName: "search", label: "Pesquisas e publicações científicas" },
        children: [
          card({
            title: "A gastronomia como propulsora do desenvolvimento turístico de lugares",
            meta: "Aline Prestes Roque",
            action: { label: "Ler dissertação", iconName: "file-text" },
          }),
          card({
            title: "Patrimônio alimentar e identidade missioneira",
            meta: "Aline Prestes Roque",
            action: { label: "Ler dissertação", iconName: "file-text" },
          }),
        ],
      }),
    })}

    ${block({
      label: "Text-section",
      spec: "gap 16px · título accent · corpo text",
      modifier: "sg-stage--stack",
      stage: `
        ${textSection({
          title: "Bem-vindo(a)!",
          body: "Conheça os patrimônios alimentares da região das Missões e sua importância na formação da identidade do povo missioneiro.",
        })}
        ${textSection({
          title: "Conhecer a nossa cultura alimentar é reconhecer as raízes que nos unem e as memórias que alimentam nossa identidade.",
          highlight: true,
        })}`,
    })}

    ${block({
      label: "Lista de tipos de conteúdo",
      spec: "ícone + rótulo Medium · padding 12px",
      modifier: "sg-stage--stack",
      stage: contentList([
        { iconName: "search", label: "Pesquisas científicas" },
        { iconName: "video", label: "Vídeos" },
        { iconName: "message-circle", label: "Entrevistas" },
        { iconName: "file-text", label: "Receitas" },
        { iconName: "book-open", label: "Materiais educativos" },
      ]),
    })}`,
});

const midia = section({
  number: "10.4",
  title: "Mídia",
  note: "O player de audiodescrição fica fixo na base da viewport e sua altura determina o padding inferior do rodapé — se um mudar, o outro muda junto (--player-height). Os dois players abaixo são funcionais e tocam um arquivo de exemplo (42s de silêncio): dê play, arraste a trilha, use as setas do teclado.",
  content: `
    ${block({
      label: "Audiodescription — Default",
      spec: "desktop · uma linha · play 72px à esquerda · padding 24px",
      modifier: "sg-stage--bottom",
      stage: player({ src: AUDIO_EXEMPLO }),
    })}

    ${block({
      label: "Audiodescription — Small",
      spec: "mobile · rótulo, trilha e controles empilhados · play 48px ao centro · padding 16px",
      modifier: "sg-stage--bottom sg-stage--bottom-mobile",
      stage: player({ src: AUDIO_EXEMPLO, small: true }),
    })}

    ${block({
      label: "Player de vídeo",
      spec: "frame travado em 16:9 · controles próprios, que aparecem no play",
      modifier: "sg-stage--stack",
      stage: video({ src: VIDEO_EXEMPLO, poster: VIDEO_POSTER }),
    })}

    ${block({
      label: "Hero",
      spec: "720px desktop · 226px mobile · vinheta radial + blend screen",
      modifier: "sg-stage--flush",
      stage: `<div class="hero"><img class="hero__image" src="/img/hero-banner1.webp" alt="Ruínas de São Miguel das Missões ao anoitecer" /></div>`,
    })}

    ${block({
      label: "Timeline",
      spec: "ol · período troca de lado no breakpoint · imagem 180px reservada",
      modifier: "sg-stage--stack",
      stage: timeline([
        {
          year: "Muito antes de 1626",
          title: "Povos Guarani",
          image: { src: "/img/quadrinho/pagina-01.webp", alt: "Roça guarani às margens do rio" },
          subtitle: "Primeiros sistemas alimentares",
          description: "Caça, pesca, coleta e o cultivo que deram origem a práticas vivas até hoje.",
        },
        {
          year: "1626 – 1634",
          title: "Jesuítas espanhóis",
          subtitle: "Fundação das Reduções",
          description: "Organização agrícola e pecuária das Missões. Sem imagem informada — o bloco fica na cor accent.",
        },
        {
          year: "1750",
          title: "Portugueses",
          image: { src: "/img/quadrinho/pagina-03.webp", alt: "Doces e conservas em vidros" },
          subtitle: "Conservação e confeitaria",
          description: "Novos temperos e técnicas que mudaram a despensa missioneira.",
        },
        {
          year: "Século XVIII",
          title: "Africanos",
          subtitle: "Saberes culinários",
          description: "Novos temperos e formas de preparo dos alimentos.",
        },
      ]),
    })}

    ${block({
      label: "Modal Revista/Quadrinho",
      spec: "páginas geradas da lista de imagens · vire arrastando o mouse · uma página por vez no mobile",
      modifier: "sg-stage--stack",
      stage: `
        ${button({ label: "Abrir o quadrinho", iconName: "book-open", opens: "modal-revista" })}
        <p class="sg-section__note">
          Arraste da direita para a esquerda sobre a página para avançar, e ao contrário para voltar.
          As setas do teclado e os botões laterais fazem o mesmo. Abaixo de 768px o leitor passa a
          mostrar uma página por vez.
        </p>`,
    })}`,
});

const rodape = section({
  number: "10.5",
  title: "Rodapé",
  note: "Fundo sólido — é o único bloco que cobre o pattern. O padding inferior reserva o espaço do player fixo.",
  content: block({
    label: "Footer",
    spec: "padding-bottom = altura do player + 24px",
    modifier: "sg-stage--flush",
    stage: footer(),
  }),
});

/* --------------------------------------------------------------------------
   Montagem
   -------------------------------------------------------------------------- */

const body = [
  cores,
  tipografia,
  espacamento,
  icones,
  navegacao,
  botoes,
  conteudo,
  midia,
  rodape,
].join("");

document.querySelector("#app").innerHTML = `
  <div class="sg">
    <div class="sg__intro">
      <span class="sg__eyebrow">Sabores e Saberes das Missões</span>
      <h1 class="sg__title">Style guide</h1>
      <p>
        Biblioteca viva dos componentes e fundações do site. Cada peça abaixo é o componente real,
        não uma reprodução — o que estiver aqui é o que roda em produção.
      </p>
      <ul class="sg__toc">
        ${SECTIONS.map(({ id, title }) => `<li><a href="#${id}">${title}</a></li>`).join("")}
      </ul>
    </div>
    ${body}
  </div>
  ${modal({ pages: PAGINAS_QUADRINHO })}`;

/* --------------------------------------------------------------------------
   Comportamento — apenas o necessário para demonstrar os estados
   -------------------------------------------------------------------------- */

initMenus();
initPlayers();
initVideos();
initFlipbooks();
initModals();

// Na biblioteca, o Menu-button aparece isolado, fora de um header. Aqui ele só
// alterna o próprio estado para demonstrar os dois ícones.
document.querySelectorAll(".sg-stage .menu-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const aberto = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!aberto));
    btn.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
  });
});

