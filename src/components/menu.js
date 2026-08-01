/**
 * Menu de navegação no mobile.
 *
 * O estado mora no header (`data-menu`), e não no botão, porque quem precisa
 * reagir é o painel — que é irmão anterior do botão no DOM e, por isso, não
 * alcançável por seletor a partir dele.
 *
 * O botão continua sendo a fonte da verdade para tecnologia assistiva, via
 * `aria-expanded`; os dois são atualizados juntos.
 */

/* Os ouvintes de documento são registrados uma vez só. `initMenu` roda de novo
   a cada troca de rota, e sem esta trava eles se acumulariam a cada página. */
let globaisRegistrados = false;

function alternar(header, aberto, devolverFoco = false) {
  const botao = header.querySelector(".menu-button");
  header.dataset.menu = aberto ? "aberto" : "fechado";
  botao?.setAttribute("aria-expanded", String(aberto));
  botao?.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  if (!aberto && devolverFoco) botao?.focus();
}

/** Fecha o que estiver aberto — descoberto pelo DOM, não por estado guardado. */
function fecharAbertos(devolverFoco = false) {
  for (const header of document.querySelectorAll('.header[data-menu="aberto"]')) {
    alternar(header, false, devolverFoco);
  }
}

function registrarGlobais() {
  if (globaisRegistrados) return;
  globaisRegistrados = true;

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fecharAbertos(true); // o foco volta para quem abriu
  });

  // Clique fora fecha, sem prender o usuário dentro do menu.
  document.addEventListener("pointerdown", (evento) => {
    if (!evento.target.closest(".header")) fecharAbertos();
  });
}

export function initMenu(header) {
  const botao = header.querySelector(".menu-button");
  const nav = header.querySelector(".header__nav");
  if (!botao || !nav) return;

  botao.addEventListener("click", () => {
    alternar(header, botao.getAttribute("aria-expanded") !== "true");
  });

  // Navegar fecha o menu — inclusive quando o link aponta para a própria página.
  nav.addEventListener("click", (evento) => {
    if (evento.target.closest("a")) alternar(header, false);
  });

  alternar(header, false);
  registrarGlobais();
}

export function initMenus(scope = document) {
  scope.querySelectorAll(".header").forEach(initMenu);
}
