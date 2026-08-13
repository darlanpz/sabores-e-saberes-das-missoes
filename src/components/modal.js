/**
 * Diálogos.
 *
 * Um botão com `data-abre="<id>"` abre o diálogo daquele id. Enquanto ele está
 * aberto, o foco fica preso dentro e a página atrás não rola; ao fechar, o foco
 * volta para quem abriu — sem isso, quem navega por teclado é jogado de volta
 * ao começo do documento.
 */

const FOCAVEIS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/* Estado no módulo, e não por chamada: `initModals` roda de novo a cada troca
   de rota, e um ouvinte por página guardaria referências a elementos que já
   saíram do DOM. */
let aberto = null;
let anterior = null;
let pilha = [];
let travaPagina = null;
let globaisRegistrados = false;

function focaveis(raiz) {
  return [...raiz.querySelectorAll(FOCAVEIS)].filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

/** Bloqueia a página no ponto atual, inclusive em navegadores móveis. */
function travarPagina() {
  if (travaPagina) return;

  const body = document.body;
  const html = document.documentElement;
  const scrollY = window.scrollY;
  const scrollbar = Math.max(0, window.innerWidth - html.clientWidth);
  const propriedades = ["position", "top", "left", "right", "width", "overflow", "paddingRight"];

  travaPagina = {
    scrollY,
    htmlOverflow: html.style.overflow,
    body: Object.fromEntries(propriedades.map((propriedade) => [propriedade, body.style[propriedade]])),
  };

  html.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${scrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.overflow = "hidden";
  if (scrollbar) body.style.paddingRight = `${scrollbar}px`;
}

/** Restaura os estilos e a posição exata em que a página estava. */
function destravarPagina() {
  if (!travaPagina) return;

  const { scrollY, htmlOverflow, body: estilosBody } = travaPagina;
  document.documentElement.style.overflow = htmlOverflow;
  for (const [propriedade, valor] of Object.entries(estilosBody)) {
    document.body.style[propriedade] = valor;
  }
  travaPagina = null;
  window.scrollTo(0, scrollY);
}

function abrir(dialogo, gatilho) {
  if (aberto && aberto !== dialogo) {
    pilha.push({ dialogo: aberto, gatilho: anterior });
    aberto.setAttribute("aria-hidden", "true");
  }

  anterior = gatilho;
  aberto = dialogo;
  aberto.removeAttribute("aria-hidden");
  const documento = dialogo.querySelector("iframe[data-modal-src]");
  if (documento && !documento.hasAttribute("src")) documento.src = documento.dataset.modalSrc;
  dialogo.hidden = false;
  travarPagina();
  focaveis(dialogo)[0]?.focus();
}

function fechar() {
  if (!aberto) return;
  const retorno = anterior;
  aberto.hidden = true;

  const anteriorModal = pilha.pop();
  if (anteriorModal) {
    aberto = anteriorModal.dialogo;
    anterior = anteriorModal.gatilho;
    aberto.removeAttribute("aria-hidden");
    retorno?.focus();
    return;
  }

  aberto = null;
  anterior = null;
  destravarPagina();
  retorno?.focus();
}

function registrarGlobais() {
  if (globaisRegistrados) return;
  globaisRegistrados = true;

  // Delegação permite abrir modais a partir de botões criados depois, como o
  // CTA que só aparece ao chegar à última página do quadrinho.
  document.addEventListener("click", (evento) => {
    const gatilho = evento.target.closest?.("[data-abre]");
    if (!gatilho) return;
    const dialogo = document.getElementById(gatilho.dataset.abre);
    if (dialogo) abrir(dialogo, gatilho);
  });

  document.addEventListener("keydown", (evento) => {
    if (!aberto) return;

    if (evento.key === "Escape") {
      fechar();
      return;
    }

    if (evento.key !== "Tab") return;

    // Prende o foco: do último volta ao primeiro, e vice-versa.
    const alvos = focaveis(aberto);
    if (!alvos.length) return;
    const primeiro = alvos[0];
    const ultimo = alvos.at(-1);

    if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  });
}

export function initModals(scope = document) {
  // Um diálogo aberto não sobrevive a uma troca de rota: o elemento dele sai
  // do DOM junto com a página.
  destravarPagina();
  aberto = null;
  anterior = null;
  pilha = [];

  for (const dialogo of scope.querySelectorAll(".modal")) {
    dialogo.querySelector("[data-modal-close]")?.addEventListener("click", fechar);

    // Clique no overlay, fora do conteúdo.
    dialogo.addEventListener("click", (evento) => {
      if (evento.target === dialogo) fechar();
    });
  }

  registrarGlobais();
}
