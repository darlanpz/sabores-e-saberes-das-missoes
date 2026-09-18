import { pillButton, button } from "./button.js";
import { icon } from "./icon.js";

const CTA_PADRAO = {
  text: "Já leu a história, responda o desafio!",
  action: { label: "Responder o quiz", iconName: "play", iconFill: true },
};

/**
 * Flipbook — leitor de quadrinho/revista.
 *
 * Tudo que varia entra por parâmetro: a quantidade de páginas é o tamanho da
 * lista, cada página é uma imagem com seu texto alternativo, e o convite ao
 * quiz vem em `cta`. Não há markup por página escrito à mão — trocar o
 * conteúdo é trocar o array.
 *
 * @example
 * flipbook({
 *   pages: [
 *     { src: "/img/quadrinho/pagina-01.webp", alt: "Chegada dos jesuítas" },
 *     { src: "/img/quadrinho/pagina-02.webp", alt: "O primeiro plantio" },
 *   ],
 *   cta: {
 *     text: "Chegou ao fim. Que tal testar o que aprendeu?",
 *     action: { label: "Fazer o quiz", iconName: "play", iconFill: true, href: "/quiz" },
 *   },
 * })
 *
 * @param {object} opts
 * @param {Array<{src: string, alt?: string}>} opts.pages  quantas quiser
 * @param {{text?: string, action?: object, note?: string}} [opts.cta]  última página
 * @param {string} [opts.label]  nome do leitor para leitores de tela
 * @param {string} [opts.id]
 * @param {string} [opts.zoomId]  id do modal de ampliação (ver `zoomModal`)
 */
export function flipbook({
  pages = [],
  cta,
  label = "Quadrinho",
  id = "flipbook",
  zoomId,
} = {}) {
  // Merge raso: dá para trocar só o texto e manter o botão padrão, ou o
  // contrário, sem precisar redeclarar o objeto inteiro.
  const chamada = {
    ...CTA_PADRAO,
    ...cta,
    action: { ...CTA_PADRAO.action, ...cta?.action },
  };

  const todas = [...pages, { type: "cta", ...chamada }];

  return `
    <div
      class="flipbook"
      data-flipbook
      data-pages='${JSON.stringify(todas).replace(/'/g, "&apos;")}'
      ${zoomId ? `data-zoom-id="${zoomId}"` : ""}
      id="${id}"
    >
      <div
        class="flipbook__spread"
        data-flip-spread
        role="group"
        aria-roledescription="leitor de páginas"
        aria-label="${label}"
        tabindex="0"
      >
        <div class="flipbook__page flipbook__page--left" data-flip-left></div>
        <div class="flipbook__page flipbook__page--right" data-flip-right></div>

        <!-- A folha é só a transição visual; o conteúdo real vive nos slots. -->
        <div class="flipbook__leaf" data-flip-leaf aria-hidden="true" hidden>
          <div class="flipbook__face flipbook__face--front" data-flip-front></div>
          <div class="flipbook__face flipbook__face--back" data-flip-back></div>
        </div>

        <span class="flipbook__gutter" aria-hidden="true"></span>

        ${
          zoomId
            ? `
        <button
          class="flipbook__zoom-trigger flipbook__zoom-trigger--left"
          type="button"
          data-flip-zoom-trigger="esq"
          data-abre="${zoomId}"
          aria-haspopup="dialog"
          data-tooltip="Ampliar página"
          aria-label="Ampliar página à esquerda"
        >${icon("zoom-in")}</button>
        <button
          class="flipbook__zoom-trigger flipbook__zoom-trigger--right"
          type="button"
          data-flip-zoom-trigger="dir"
          data-abre="${zoomId}"
          aria-haspopup="dialog"
          data-tooltip="Ampliar página"
          aria-label="Ampliar página"
        >${icon("zoom-in")}</button>`
            : ""
        }
      </div>

      <div class="flipbook__bar">
        <span class="flipbook__nav flipbook__nav--prev" data-flip-prev>
          ${pillButton({ direction: "prev", label: "Página anterior" })}
        </span>
        <p class="flipbook__status" data-flip-status aria-live="polite"></p>
        <span class="flipbook__nav flipbook__nav--next" data-flip-next>
          ${pillButton({ direction: "next", label: "Próxima página" })}
        </span>
      </div>
    </div>`;
}

/** Página de encerramento — mesmo texto e botão do card do quiz. */
function ctaHTML(page) {
  return `
    <div class="flipbook__cta">
      <p class="flipbook__cta-text">${page.text}</p>
      ${button(page.action)}
      ${page.note ? `<p class="flipbook__cta-note">${page.note}</p>` : ""}
    </div>`;
}

/**
 * Modal de ampliação — abre por cima do leitor (mesma pilha do quiz), com a
 * imagem da página tocada. `initFlipbookZoom` liga o zoom/arrasto/pinça;
 * quem seta a imagem de cada abertura é `initFlipbook`, via evento
 * `flipbook-zoom:abrir`.
 *
 * @param {object} opts
 * @param {string} opts.id
 */
export function zoomModal({ id = "modal-zoom" } = {}) {
  return `
    <div class="modal modal--zoom" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-title" hidden>
      <div class="flipbook-zoom" data-flip-zoom>
        <div class="flipbook-zoom__bar">
          <h2 class="visually-hidden" id="${id}-title">Página ampliada</h2>
          <button class="flipbook-zoom__control" type="button" data-flip-zoom-out data-tooltip="Diminuir zoom" aria-label="Diminuir zoom">
            ${icon("zoom-out")}
          </button>
          <span class="flipbook-zoom__level" data-flip-zoom-level>100%</span>
          <button class="flipbook-zoom__control" type="button" data-flip-zoom-in data-tooltip="Aumentar zoom" aria-label="Aumentar zoom">
            ${icon("zoom-in")}
          </button>
          <button class="flipbook-zoom__control" type="button" data-flip-zoom-reset data-tooltip="Redefinir zoom" aria-label="Redefinir zoom">
            ${icon("maximize")}
          </button>
          <button class="modal__close modal__close--inline" type="button" data-modal-close data-tooltip="Fechar" aria-label="Fechar ampliação">
            ${icon("x")}
          </button>
        </div>
        <div
          class="flipbook-zoom__viewport"
          data-flip-zoom-viewport
          tabindex="0"
          aria-label="Página ampliada. Arraste para mover, use + e - para o zoom e as setas para navegar quando ampliado."
        >
          <!-- width/height fixos e inertes: a imagem real muda de página para
               página, então o tamanho de verdade vem só do CSS (width/height:
               auto). Os atributos existem só para satisfazer a checagem de
               "toda imagem reserva espaço" — aqui não há o que reservar, o
               modal começa fechado. -->
          <img class="flipbook-zoom__img" data-flip-zoom-img src="" alt="" width="1" height="1" draggable="false">
        </div>
        <p class="flipbook-zoom__hint">Arraste para mover • Duplo toque ou duplo clique para ampliar • Pinça ou roda do mouse para dar zoom</p>
      </div>
    </div>`;
}

/* -------------------------------------------------------------------------- */

const LIMIAR = 0.35; // fração do arrasto que confirma a virada
const REDE = 600; // ms — rede de segurança caso transitionend não dispare

export function initFlipbook(root) {
  const spread = root.querySelector("[data-flip-spread]");
  const left = root.querySelector("[data-flip-left]");
  const right = root.querySelector("[data-flip-right]");
  const leaf = root.querySelector("[data-flip-leaf]");
  const front = root.querySelector("[data-flip-front]");
  const back = root.querySelector("[data-flip-back]");
  const status = root.querySelector("[data-flip-status]");
  const prevNav = root.querySelector("[data-flip-prev]");
  const nextNav = root.querySelector("[data-flip-next]");
  const zoomTriggerEsq = root.querySelector('[data-flip-zoom-trigger="esq"]');
  const zoomTriggerDir = root.querySelector('[data-flip-zoom-trigger="dir"]');

  if (!spread || !leaf) return;

  let paginas = [];
  try {
    paginas = JSON.parse(root.dataset.pages || "[]");
  } catch {
    paginas = [];
  }
  if (!paginas.length) return;

  const duplaQuery = window.matchMedia("(min-width: 768px)");
  let porVista = duplaQuery.matches ? 2 : 1;
  let vista = 0;
  let arrasto = null;
  let virando = false;

  /**
   * Paginação de livro: a capa fica sozinha à direita da lombada, como um
   * livro fechado. Só a partir da segunda vista existem duas páginas lado a
   * lado, e a última também pode ficar sozinha — à esquerda, como contracapa.
   *
   *   vista 0 → [    | 1 ]
   *   vista 1 → [ 2  | 3 ]
   *   vista 2 → [ 4  | 5 ]
   *   vista 3 → [ 6  | 7 ]
   *   vista 4 → [ 8  |   ]
   */
  function vistaPaginas(v) {
    if (porVista === 1) return { esq: null, dir: v };
    if (v === 0) return { esq: null, dir: 0 };
    return { esq: 2 * v - 1, dir: 2 * v };
  }

  const totalVistas = () =>
    porVista === 1 ? paginas.length : 1 + Math.ceil((paginas.length - 1) / 2);

  /** Vista que contém uma página, ao trocar de layout. */
  function vistaDaPagina(p) {
    if (porVista === 1) return p;
    return p === 0 ? 0 : Math.floor((p + 1) / 2);
  }

  /** Conteúdo de uma página: imagem, CTA, ou vazio quando passa do fim. */
  function conteudo(i) {
    const page = paginas[i];
    if (!page) return "";
    if (page.type === "cta") return ctaHTML(page);
    // draggable=false: o arrasto nativo de imagem brigaria com o nosso.
    const alt = page.alt ?? `Página ${i + 1}`;
    return `<img class="flipbook__img" src="${page.src}" alt="${alt}" draggable="false">`;
  }

  function pintar(el, i) {
    if (!el) return;
    el.innerHTML = conteudo(i);
    // Folha ausente fica transparente: como o spread usa `drop-shadow`, que
    // segue o canal alfa, a sombra passa a abraçar só a página que existe.
    el.classList.toggle("flipbook__blank", i === null || !paginas[i]);
  }

  /**
   * Como a vista se apresenta: `capa` e `contracapa` têm uma página só, e o
   * CSS as centraliza na tela deslocando o spread meia página. `duplo` é o
   * livro aberto, único caso com lombada à vista.
   */
  function estadoSpread(v) {
    if (porVista === 1) return "unico";
    const { esq, dir } = vistaPaginas(v);
    const temEsq = esq !== null && Boolean(paginas[esq]);
    const temDir = dir !== null && Boolean(paginas[dir]);
    if (temEsq && temDir) return "duplo";
    return temDir ? "capa" : "contracapa";
  }

  /** Só páginas de verdade (imagem) podem ser ampliadas — não a de CTA. */
  function paginaZoomavel(i) {
    const page = i !== null ? paginas[i] : null;
    return page && page.type !== "cta" ? page : null;
  }

  function render() {
    const { esq, dir } = vistaPaginas(vista);
    if (porVista === 2) pintar(left, esq);
    pintar(right, dir);

    root.dataset.spread = estadoSpread(vista);

    const numeros = [esq, dir]
      .filter((i) => i !== null && paginas[i])
      .map((i) => i + 1);

    if (status) {
      status.textContent =
        numeros.length === 1
          ? `Página ${numeros[0]} de ${paginas.length}`
          : `Páginas ${numeros[0]}–${numeros[1]} de ${paginas.length}`;
    }

    if (prevNav) prevNav.hidden = vista === 0;
    if (nextNav) nextNav.hidden = vista >= totalVistas() - 1;

    if (zoomTriggerEsq) zoomTriggerEsq.hidden = porVista === 1 || !paginaZoomavel(esq);
    if (zoomTriggerDir) zoomTriggerDir.hidden = !paginaZoomavel(dir);
  }

  /**
   * Prepara a folha para virar.
   * Adiante: começa deitada à direita (0°) mostrando a página atual, e por
   * baixo já entra a que será revelada.
   * Atrás: começa deitada à esquerda (180°) mostrando a esquerda atual, e por
   * baixo entra a anterior.
   */
  function armar(sentido) {
    const atual = vistaPaginas(vista);

    if (sentido === 1) {
      if (vista >= totalVistas() - 1) return false;
      const prox = vistaPaginas(vista + 1);
      pintar(front, atual.dir); // a direita de agora é a frente da folha
      pintar(back, porVista === 2 ? prox.esq : prox.dir);
      pintar(right, prox.dir); // por baixo, o que será revelado
    } else {
      if (vista === 0) return false;
      const ant = vistaPaginas(vista - 1);
      pintar(front, ant.dir);
      pintar(back, porVista === 2 ? atual.esq : atual.dir);
      if (porVista === 2) pintar(left, ant.esq);
    }

    // O spread já assume a posição de destino: assim o livro desliza para o
    // centro enquanto a folha vira, em vez de saltar no fim.
    root.dataset.spread = estadoSpread(vista + sentido);

    leaf.hidden = false;
    leaf.classList.remove("flipbook__leaf--settling");
    aplicar(sentido === 1 ? 0 : 180);
    return true;
  }

  function aplicar(angulo) {
    leaf.style.setProperty("--angle", String(angulo));
    // A sombra da dobra é mais forte no meio do movimento.
    const dobra = Math.sin((angulo / 180) * Math.PI) * 0.6;
    front.style.setProperty("--fold", String(dobra));
    back.style.setProperty("--fold", String(dobra));
  }

  /**
   * Conclui ou desfaz a virada.
   *
   * `finalizar` precisa rodar UMA vez só: transitionend e a rede de segurança
   * podem disparar os dois, e sem a trava a vista avançaria em dobro — era
   * isso que fazia o leitor pular de 1-2 direto para 5-6.
   */
  function assentar(sentido, confirmar) {
    const alvo = confirmar ? (sentido === 1 ? 180 : 0) : sentido === 1 ? 0 : 180;
    const atual = Number(leaf.style.getPropertyValue("--angle")) || 0;

    let feito = false;
    let rede;

    function finalizar() {
      if (feito) return;
      feito = true;
      clearTimeout(rede);
      leaf.removeEventListener("transitionend", finalizar);
      leaf.classList.remove("flipbook__leaf--settling");
      leaf.hidden = true;
      if (confirmar) vista += sentido;
      virando = false;
      render();
    }

    // Sem distância a percorrer não há transitionend — encerra na hora.
    if (atual === alvo) {
      finalizar();
      return;
    }

    leaf.addEventListener("transitionend", finalizar);
    rede = setTimeout(finalizar, REDE);

    leaf.classList.add("flipbook__leaf--settling");
    requestAnimationFrame(() => aplicar(alvo));
  }

  function virar(sentido) {
    if (arrasto || virando) return;
    if (!armar(sentido)) return;
    virando = true;
    // Um quadro para o ângulo inicial pegar antes de iniciar a transição.
    requestAnimationFrame(() => assentar(sentido, true));
  }

  /* --- Arrasto ------------------------------------------------------------ */

  const LIMIAR_DIRECAO = 4; // px — abaixo disso ainda não sabemos o sentido do arrasto

  spread.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || arrasto || virando) return;
    // Botões (navegação e o CTA da última página) ficam com o clique deles.
    if (event.target.closest("button")) return;

    const rect = spread.getBoundingClientRect();

    if (porVista === 2) {
      // Duas páginas: o lado tocado já diz o sentido, mesmo sem arrastar.
      const sentido = event.clientX - rect.left > rect.width / 2 ? 1 : -1;
      if (!armar(sentido)) return;
      arrasto = { sentido, x0: event.clientX, largura: rect.width / 2, progresso: 0 };
    } else {
      // Página única: não tem "lado direito" — o sentido só existe quando o
      // dedo de fato se move. Decidir isso antes fazia todo arrasto virar
      // "avançar", e puxar para a direita nunca voltava a página.
      arrasto = { sentido: null, x0: event.clientX, largura: rect.width, progresso: 0 };
    }
    spread.setPointerCapture(event.pointerId);
  });

  spread.addEventListener("pointermove", (event) => {
    if (!arrasto) return;
    const dx = event.clientX - arrasto.x0;

    if (arrasto.sentido === null) {
      if (Math.abs(dx) < LIMIAR_DIRECAO) return;
      // Arrasta para a esquerda → avança; para a direita → volta.
      const sentido = dx < 0 ? 1 : -1;
      if (!armar(sentido)) {
        arrasto = null;
        return;
      }
      arrasto.sentido = sentido;
    }

    // Adiante puxa para a esquerda; atrás, para a direita.
    const bruto = (arrasto.sentido === 1 ? -dx : dx) / arrasto.largura;
    arrasto.progresso = Math.min(Math.max(bruto, 0), 1);
    aplicar(arrasto.sentido === 1 ? arrasto.progresso * 180 : 180 - arrasto.progresso * 180);
  });

  function soltar(event) {
    if (!arrasto) return;
    const { sentido, progresso } = arrasto;
    // Nunca chegou a se mover o bastante para escolher um sentido: não havia
    // folha armada, então não há o que assentar.
    if (sentido === null) {
      arrasto = null;
      spread.releasePointerCapture?.(event.pointerId);
      return;
    }
    arrasto = null;
    virando = true;
    spread.releasePointerCapture?.(event.pointerId);
    assentar(sentido, progresso > LIMIAR);
  }

  spread.addEventListener("pointerup", soltar);
  spread.addEventListener("pointercancel", soltar);

  /* --- Botões e teclado --------------------------------------------------- */

  nextNav?.querySelector("button")?.addEventListener("click", () => virar(1));
  prevNav?.querySelector("button")?.addEventListener("click", () => virar(-1));

  /**
   * Ampliar página. O clique no gatilho roda ANTES do listener global do
   * `modal.js` (que abre o modal de zoom via `data-abre`, na fase de bubble
   * até o document): dá tempo de trocar a imagem antes do diálogo aparecer.
   */
  function abrirZoom(indice) {
    const page = paginaZoomavel(indice);
    const zoomId = root.dataset.zoomId;
    if (!page || !zoomId) return;
    const modal = document.getElementById(zoomId);
    const img = modal?.querySelector("[data-flip-zoom-img]");
    if (img) {
      img.src = page.src;
      img.alt = page.alt ?? "";
    }
    modal?.dispatchEvent(new CustomEvent("flipbook-zoom:abrir"));
  }

  zoomTriggerEsq?.addEventListener("click", () => abrirZoom(vistaPaginas(vista).esq));
  zoomTriggerDir?.addEventListener("click", () => abrirZoom(vistaPaginas(vista).dir));

  spread.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") virar(1);
    else if (event.key === "ArrowLeft") virar(-1);
    else return;
    event.preventDefault();
  });

  /* --- Responsivo --------------------------------------------------------- */

  duplaQuery.addEventListener("change", (event) => {
    // Mantém a página que estava à vista ao trocar de layout.
    const { esq, dir } = vistaPaginas(vista);
    const paginaAtual = dir ?? esq ?? 0;
    porVista = event.matches ? 2 : 1;
    vista = Math.min(vistaDaPagina(paginaAtual), totalVistas() - 1);
    leaf.hidden = true;
    virando = false;
    render();
  });

  render();
}

/* -------------------------------------------------------------------------- */

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_PASSO = 0.6;
const ZOOM_TOQUE = 2.5; // escala do duplo toque/clique
const DUPLO_TOQUE_MS = 300;
const DUPLO_TOQUE_DIST = 24; // px — acima disso já foi arrasto, não toque

/**
 * Zoom/arrasto/pinça do modal de ampliação. Roda à parte de `initFlipbook`:
 * o modal é um `.modal` irmão, não aninhado no leitor, então zoom e virada
 * de página nunca disputam o mesmo gesto.
 */
export function initFlipbookZoom(root) {
  const viewport = root.querySelector("[data-flip-zoom-viewport]");
  const img = root.querySelector("[data-flip-zoom-img]");
  const nivel = root.querySelector("[data-flip-zoom-level]");
  const btnIn = root.querySelector("[data-flip-zoom-in]");
  const btnOut = root.querySelector("[data-flip-zoom-out]");
  const btnReset = root.querySelector("[data-flip-zoom-reset]");
  if (!viewport || !img) return;

  let escala = 1;
  let x = 0;
  let y = 0;

  function limitarPan() {
    // O quanto dá para arrastar sem a imagem sumir da tela — baseado no
    // tamanho de layout dela (ignora o `transform`, que não altera isso).
    const limiteX = Math.max(0, (img.offsetWidth * escala - viewport.clientWidth) / 2);
    const limiteY = Math.max(0, (img.offsetHeight * escala - viewport.clientHeight) / 2);
    x = Math.min(Math.max(x, -limiteX), limiteX);
    y = Math.min(Math.max(y, -limiteY), limiteY);
  }

  function aplicar(animar) {
    // Instantâneo durante arrasto/pinça (senão o dedo "atrasa" da imagem);
    // com transição só nos saltos discretos — botão, roda, duplo toque.
    img.style.transitionDuration = animar ? "" : "0s";
    img.style.setProperty("--zoom-scale", String(escala));
    img.style.setProperty("--zoom-x", `${x}px`);
    img.style.setProperty("--zoom-y", `${y}px`);
    viewport.classList.toggle("flipbook-zoom__viewport--ativo", escala > 1);
    if (nivel) nivel.textContent = `${Math.round(escala * 100)}%`;
    if (btnOut) btnOut.disabled = escala <= ZOOM_MIN + 0.01;
    if (btnIn) btnIn.disabled = escala >= ZOOM_MAX - 0.01;
  }

  /** @param {{x: number, y: number}} [foco] ponto (relativo ao centro do viewport) que deve ficar parado ao mudar a escala */
  function definirEscala(nova, foco, animar = true) {
    const alvo = Math.min(Math.max(nova, ZOOM_MIN), ZOOM_MAX);
    if (foco && alvo !== escala) {
      const fator = alvo / escala;
      x = foco.x - (foco.x - x) * fator;
      y = foco.y - (foco.y - y) * fator;
    }
    escala = alvo;
    if (escala <= ZOOM_MIN) {
      escala = ZOOM_MIN;
      x = 0;
      y = 0;
    }
    limitarPan();
    aplicar(animar);
  }

  function mover(novoX, novoY) {
    x = novoX;
    y = novoY;
    limitarPan();
    aplicar(false);
  }

  function alternar(foco) {
    definirEscala(escala > 1 ? 1 : ZOOM_TOQUE, foco, true);
  }

  root.addEventListener("flipbook-zoom:abrir", () => definirEscala(1, null, false));

  btnIn?.addEventListener("click", () => definirEscala(escala + ZOOM_PASSO, null, true));
  btnOut?.addEventListener("click", () => definirEscala(escala - ZOOM_PASSO, null, true));
  btnReset?.addEventListener("click", () => definirEscala(1, null, true));

  viewport.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const foco = { x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 };
      definirEscala(escala + (event.deltaY < 0 ? ZOOM_PASSO : -ZOOM_PASSO), foco, false);
    },
    { passive: false },
  );

  viewport.addEventListener("keydown", (event) => {
    const passo = 40;
    if (event.key === "+" || event.key === "=") definirEscala(escala + ZOOM_PASSO, null, true);
    else if (event.key === "-") definirEscala(escala - ZOOM_PASSO, null, true);
    else if (event.key === "0") definirEscala(1, null, true);
    else if (escala > 1 && event.key === "ArrowLeft") mover(x + passo, y);
    else if (escala > 1 && event.key === "ArrowRight") mover(x - passo, y);
    else if (escala > 1 && event.key === "ArrowUp") mover(x, y + passo);
    else if (escala > 1 && event.key === "ArrowDown") mover(x, y - passo);
    else return;
    event.preventDefault();
  });

  /* --- Arrasto e pinça (Pointer Events) ------------------------------------ */

  const ponteiros = new Map(); // pointerId → {x, y}
  let arrastoInicio = null; // {x0, y0, panX0, panY0}
  let pinca = null; // {distancia0, escala0}
  let ultimoToque = 0;

  const distancia = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  viewport.addEventListener("pointerdown", (event) => {
    viewport.setPointerCapture(event.pointerId);
    ponteiros.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (ponteiros.size === 2) {
      const [a, b] = [...ponteiros.values()];
      pinca = { distancia0: distancia(a, b), escala0: escala };
      arrastoInicio = null;
    } else if (ponteiros.size === 1) {
      arrastoInicio = { x0: event.clientX, y0: event.clientY, panX0: x, panY0: y, tipo: event.pointerType };
    }
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!ponteiros.has(event.pointerId)) return;
    ponteiros.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (ponteiros.size === 2 && pinca) {
      const [a, b] = [...ponteiros.values()];
      const rect = viewport.getBoundingClientRect();
      const foco = {
        x: (a.x + b.x) / 2 - rect.left - rect.width / 2,
        y: (a.y + b.y) / 2 - rect.top - rect.height / 2,
      };
      definirEscala(pinca.escala0 * (distancia(a, b) / pinca.distancia0), foco, false);
    } else if (ponteiros.size === 1 && arrastoInicio && escala > 1) {
      mover(
        arrastoInicio.panX0 + (event.clientX - arrastoInicio.x0),
        arrastoInicio.panY0 + (event.clientY - arrastoInicio.y0),
      );
    }
  });

  function soltarPonteiro(event) {
    const inicio = arrastoInicio;
    ponteiros.delete(event.pointerId);
    viewport.releasePointerCapture?.(event.pointerId);
    if (ponteiros.size < 2) pinca = null;

    // Duplo toque: só em touch/caneta — no mouse quem cuida disso é o
    // `dblclick` nativo, mais confiável do que medir tempo entre cliques.
    if (ponteiros.size === 0 && inicio && inicio.tipo !== "mouse") {
      const moveu = Math.hypot(event.clientX - inicio.x0, event.clientY - inicio.y0) > DUPLO_TOQUE_DIST;
      const agora = Date.now();
      if (!moveu) {
        if (agora - ultimoToque < DUPLO_TOQUE_MS) {
          const rect = viewport.getBoundingClientRect();
          alternar({ x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 });
          ultimoToque = 0;
        } else {
          ultimoToque = agora;
        }
      }
    }
    if (ponteiros.size === 0) arrastoInicio = null;
  }

  viewport.addEventListener("pointerup", soltarPonteiro);
  viewport.addEventListener("pointercancel", soltarPonteiro);

  viewport.addEventListener("dblclick", (event) => {
    const rect = viewport.getBoundingClientRect();
    alternar({ x: event.clientX - rect.left - rect.width / 2, y: event.clientY - rect.top - rect.height / 2 });
  });

  aplicar(false);
}

export function initFlipbooks(scope = document) {
  scope.querySelectorAll("[data-flipbook]").forEach(initFlipbook);
  scope.querySelectorAll("[data-flip-zoom]").forEach(initFlipbookZoom);
}
