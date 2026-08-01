import { header } from "../components/navigation.js";
import { player, modal } from "../components/media.js";
import { footer } from "../components/footer.js";
import { renderBlock } from "./blocks.js";

/**
 * Hero — faixa de topo.
 *
 * `position` é o enquadramento vertical da arte dentro da faixa, que sempre
 * recorta. Aproximar de `top` mostra mais do alto da imagem e, com isso,
 * empurra o assunto para baixo — útil quando ele encosta no header.
 */
function hero({ src, alt, position }) {
  const enquadramento = position ? ` style="object-position:${position}"` : "";
  return `
    <div class="hero">
      <img class="hero__image" src="${src}" alt="${alt ?? ""}"${enquadramento} fetchpriority="high">
    </div>`;
}

/**
 * Cada bloco vai numa casca própria. Ela carrega a ordem de leitura do mobile
 * e é o alvo da revelação ao rolar.
 */
function bloco(item, ordem, contexto) {
  return `<div class="bloco" style="--ordem:${ordem}">${renderBlock(item, contexto)}</div>`;
}

/**
 * Monta uma página inteira a partir do conteúdo.
 *
 * O campo `column` de cada bloco decide **só o desktop**: `aside` é a coluna de
 * texto (esquerda), `main` a de painéis (direita) e `full` atravessa as duas.
 *
 * **A ordem no JSON é a ordem do mobile**, onde tudo vira uma coluna só. Por
 * isso um painel que deve abrir a página no celular vem antes no arquivo,
 * mesmo que no desktop apareça à direita.
 *
 * @param {object} site   bloco `site` do JSON
 * @param {object} page   entrada de `pages`
 * @param {string} slug   qual item da navegação marcar como atual
 * @param {object} [pages] todas as páginas — a grade da home lê os heros daqui
 */
export function renderPage(site, page, slug, pages = {}) {
  const contexto = { pages };
  const blocos = (page.blocks ?? []).map((item, ordem) => ({ item, ordem }));

  const cheios = blocos.filter(({ item }) => item.column === "full");
  const aside = blocos.filter(({ item }) => (item.column ?? "aside") === "aside");
  const main = blocos.filter(({ item }) => item.column === "main");

  const nav = site.nav.map(({ label, href, slug: item }) => ({
    label,
    href,
    current: item === slug,
  }));

  // Qual coluna acompanha a rolagem. Só funciona na coluna mais BAIXA das duas
  // — ver style-guide, seção 5.2.
  const colar = page.sticky ? ` page__columns--cola-${page.sticky}` : "";

  const montar = ({ item, ordem }) => bloco(item, ordem, contexto);

  return `
    <a class="pular-para-conteudo" href="#conteudo">Pular para o conteúdo</a>

    <div class="page__top${page.hero ? "" : " page__top--sem-hero"}">
      ${header({ items: nav })}
      ${page.hero ? hero(page.hero) : ""}
    </div>

    <main class="page" id="conteudo">
      ${cheios.length ? `<div class="page__full">${cheios.map(montar).join("")}</div>` : ""}

      <div class="page__columns${colar}">
        ${aside.length ? `<div class="page__aside">${aside.map(montar).join("")}</div>` : ""}
        ${main.length ? `<div class="page__main">${main.map(montar).join("")}</div>` : ""}
      </div>
    </main>

    ${footer(site.footer)}

    ${page.audio ? `<div class="page__player">${player(page.audio)}</div>` : ""}

    ${page.comic ? modal({ id: "modal-quadrinho", ...page.comic }) : ""}`;
}
