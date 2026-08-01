/**
 * Navegação sem recarregar.
 *
 * Como todo o conteúdo do site vive no JSON, que já vem no bundle, trocar de
 * página é só remontar o `#app` — não há requisição nenhuma. As URLs continuam
 * reais: cada página tem seu HTML, e quem chega direto nela é servido por ele.
 * Este roteador só evita o recarregamento quando a navegação parte de um link
 * de dentro do site.
 *
 * @param {object} opts
 * @param {Map<string, string>} opts.rotas   caminho → slug
 * @param {(slug: string) => void} opts.montar
 */
export function initRouter({ rotas, montar }) {
  const normalizar = (caminho) => caminho.replace(/\/+$/, "") || "/";
  const slugDe = (caminho) => rotas.get(normalizar(caminho));

  function trocar(slug) {
    const aplicar = () => {
      montar(slug);
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    // View Transitions faz o cruzamento entre as duas páginas. Onde não houver,
    // a troca é direta — nada quebra.
    if (document.startViewTransition) document.startViewTransition(aplicar);
    else aplicar();
  }

  document.addEventListener("click", (evento) => {
    if (evento.defaultPrevented) return;
    // Deixa passar cliques que o usuário quer em outra aba ou janela.
    if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) {
      return;
    }

    const link = evento.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const href = link.getAttribute("href");

    // Destino provisório: não navega nem escreve "#" na URL.
    if (href === "#") {
      evento.preventDefault();
      return;
    }

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;

    const slug = slugDe(url.pathname);
    if (!slug) return; // rota fora do JSON (ex.: a biblioteca de componentes)

    evento.preventDefault();
    if (normalizar(url.pathname) === normalizar(location.pathname)) return;

    history.pushState({ slug }, "", url.pathname);
    trocar(slug);
  });

  window.addEventListener("popstate", () => {
    const slug = slugDe(location.pathname);
    // Sem slug, o histórico levou para fora do conjunto de páginas do JSON —
    // aí é caso de deixar o navegador carregar de verdade.
    if (slug) trocar(slug);
    else location.reload();
  });
}
