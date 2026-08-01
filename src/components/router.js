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

  /*
   * Restauração de scroll.
   *
   * O navegador tenta restaurar sozinho, mas erra: quando ele age, o `#app`
   * ainda está vazio e o documento não tem altura. Assumimos o controle.
   *
   * As posições ficam num Map em memória, indexado por uma chave que viaja no
   * estado do histórico. Guardar em `history.replaceState` a cada rolagem
   * seria a alternativa, mas os navegadores limitam a frequência dessas
   * chamadas — e aqui não precisamos que sobrevivam a um recarregamento.
   */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const posicoes = new Map();
  let chaveAtual = history.state?.chave ?? criarChave();

  function criarChave() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  /** Anota onde a página atual estava, antes de sair dela. */
  function lembrarPosicao() {
    posicoes.set(chaveAtual, window.scrollY);
  }

  // A primeira entrada também precisa de chave, senão voltar até ela se perde.
  if (!history.state?.chave) {
    history.replaceState({ slug: slugDe(location.pathname), chave: chaveAtual }, "");
  }

  function trocar(slug, topo) {
    const aplicar = () => {
      montar(slug);
      window.scrollTo({ top: topo, behavior: "instant" });
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

    lembrarPosicao();

    chaveAtual = criarChave();
    history.pushState({ slug, chave: chaveAtual }, "", url.pathname);

    // Seguir um link começa do topo — quem clica espera o início da página.
    trocar(slug, 0);
  });

  window.addEventListener("popstate", (evento) => {
    const slug = slugDe(location.pathname);

    // Sem slug, o histórico levou para fora do conjunto de páginas do JSON —
    // aí é caso de deixar o navegador carregar de verdade.
    if (!slug) {
      location.reload();
      return;
    }

    // A rolagem ainda não mudou: dá tempo de anotar de onde estamos saindo,
    // para o botão Avançar também voltar ao lugar certo.
    lembrarPosicao();

    chaveAtual = evento.state?.chave ?? criarChave();
    trocar(slug, posicoes.get(chaveAtual) ?? 0);
  });
}
