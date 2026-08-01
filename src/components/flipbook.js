import { pillButton, button } from "./button.js";

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
 * @param {{text?: string, action?: object}} [opts.cta]    última página
 * @param {string} [opts.label]  nome do leitor para leitores de tela
 * @param {string} [opts.id]
 */
export function flipbook({ pages = [], cta, label = "Quadrinho", id = "flipbook" } = {}) {
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

  spread.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || arrasto || virando) return;
    // Botões (navegação e o CTA da última página) ficam com o clique deles.
    if (event.target.closest("button")) return;

    const rect = spread.getBoundingClientRect();
    const naDireita = porVista === 1 || event.clientX - rect.left > rect.width / 2;
    const sentido = naDireita ? 1 : -1;

    if (!armar(sentido)) return;

    arrasto = {
      sentido,
      x0: event.clientX,
      largura: porVista === 2 ? rect.width / 2 : rect.width,
      progresso: 0,
    };
    spread.setPointerCapture(event.pointerId);
  });

  spread.addEventListener("pointermove", (event) => {
    if (!arrasto) return;
    const dx = event.clientX - arrasto.x0;
    // Adiante puxa para a esquerda; atrás, para a direita.
    const bruto = (arrasto.sentido === 1 ? -dx : dx) / arrasto.largura;
    arrasto.progresso = Math.min(Math.max(bruto, 0), 1);
    aplicar(arrasto.sentido === 1 ? arrasto.progresso * 180 : 180 - arrasto.progresso * 180);
  });

  function soltar(event) {
    if (!arrasto) return;
    const { sentido, progresso } = arrasto;
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

export function initFlipbooks(scope = document) {
  scope.querySelectorAll("[data-flipbook]").forEach(initFlipbook);
}
