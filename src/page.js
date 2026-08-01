/**
 * Entrada das páginas de conteúdo.
 *
 * O HTML é gerado a partir de src/content/site.json; o arquivo .html de cada
 * página traz só a casca e o slug em `data-page`.
 */
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
import "./styles/components/page.css";
import "./styles/components/home.css";
import "./styles/components/reveal.css";

import conteudo from "./content/site.json";
import { renderPage } from "./render/page.js";
import { initPlayers } from "./components/player.js";
import { initVideos } from "./components/video-player.js";
import { initFlipbooks } from "./components/flipbook.js";
import { initMenus } from "./components/menu.js";
import { initReveal } from "./components/reveal.js";
import { initModals } from "./components/modal.js";
import { initRouter } from "./components/router.js";

const app = document.querySelector("#app");

/** Monta uma página e liga tudo que ela precisa. */
function montar(slug) {
  const page = conteudo.pages[slug];

  if (!page) {
    throw new Error(
      `Página "${slug}" não existe em site.json. Disponíveis: ${Object.keys(conteudo.pages).join(", ")}`,
    );
  }

  document.title = `${page.title} — ${conteudo.site.nome}`;
  document.body.dataset.page = slug;
  app.innerHTML = renderPage(conteudo.site, page, slug, conteudo.pages);

  initMenus();
  initPlayers();
  initVideos();
  initFlipbooks();
  initModals();
  initReveal();
}

montar(document.body.dataset.page);

// Trocar de página não recarrega: o conteúdo já está aqui, basta remontar.
// Só entram as rotas que existem no JSON — as demais seguem como navegação
// normal do navegador.
initRouter({
  rotas: new Map(
    conteudo.site.nav
      .filter(({ slug }) => conteudo.pages[slug])
      .map(({ href, slug }) => [href.replace(/\/+$/, "") || "/", slug]),
  ),
  montar,
});
