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
let globaisRegistrados = false;

function focaveis(raiz) {
  return [...raiz.querySelectorAll(FOCAVEIS)].filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

function abrir(dialogo, gatilho) {
  anterior = gatilho;
  aberto = dialogo;
  dialogo.hidden = false;
  document.body.style.overflow = "hidden";
  focaveis(dialogo)[0]?.focus();
}

function fechar() {
  if (!aberto) return;
  aberto.hidden = true;
  aberto = null;
  document.body.style.overflow = "";
  anterior?.focus();
}

function registrarGlobais() {
  if (globaisRegistrados) return;
  globaisRegistrados = true;

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
  aberto = null;
  anterior = null;
  document.body.style.overflow = "";

  for (const gatilho of scope.querySelectorAll("[data-abre]")) {
    const dialogo = document.getElementById(gatilho.dataset.abre);
    if (!dialogo) continue;

    gatilho.addEventListener("click", () => abrir(dialogo, gatilho));
    dialogo.querySelector("[data-modal-close]")?.addEventListener("click", fechar);

    // Clique no overlay, fora do conteúdo.
    dialogo.addEventListener("click", (evento) => {
      if (evento.target === dialogo) fechar();
    });
  }

  registrarGlobais();
}
