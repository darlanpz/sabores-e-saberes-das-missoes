/**
 * Verifica que as páginas saem inteiras do JSON de conteúdo.
 *
 * `renderPage` é função pura de string — dá para rodar sem DOM nenhum, o que
 * torna esta a checagem mais direta do projeto.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { renderPage } from "../src/render/page.js";
import { TIPOS_DE_BLOCO, renderBlock } from "../src/render/blocks.js";

const RAIZ = join(import.meta.dirname, "..");
const conteudo = JSON.parse(readFileSync(join(RAIZ, "src/content/site.json"), "utf8"));

let falhou = false;
function verificar(grupo, checagens) {
  for (const [nome, ok] of checagens) {
    console.log(`${ok ? "OK  " : "FALHA"} ${grupo}: ${nome}`);
    if (!ok) falhou = true;
  }
}

/* --- Estrutura do JSON ----------------------------------------------------- */

const { site, pages } = conteudo;
const slugs = Object.keys(pages);

verificar("conteúdo", [
  ["site e pages existem", Boolean(site) && Boolean(pages)],
  ["navegação declarada", Array.isArray(site.nav) && site.nav.length > 0],
  ["todo item de navegação tem slug", site.nav.every((i) => i.slug && i.href && i.label)],
  ["rodapé declarado", Boolean(site.footer?.accessibility?.text) && site.footer.supporters.logos.length > 0],
  ["ao menos uma página", slugs.length > 0],
  // O roteador monta as rotas a partir do href da navegação; se ele não bater
  // com o slug, o clique vira recarregamento de página em vez de troca.
  [
    "href da navegação bate com o slug",
    site.nav
      .filter(({ slug }) => pages[slug])
      // A home é a exceção: mora na raiz, não em /home.
      .every(({ href, slug }) =>
        slug === "home" ? href === "/" : href.replace(/\/+$/, "") === `/${slug}`,
      ),
  ],
  [
    "toda página do JSON está na navegação",
    slugs.every((s) => site.nav.some((i) => i.slug === s)),
  ],
]);

/* --- Blocos ---------------------------------------------------------------- */

const todosBlocos = slugs.flatMap((s) => pages[s].blocks ?? []);
const tiposUsados = [...new Set(todosBlocos.map((b) => b.type))];
const tiposInvalidos = tiposUsados.filter((t) => !TIPOS_DE_BLOCO.includes(t));

verificar("blocos", [
  ["todo tipo usado existe no renderizador", tiposInvalidos.length === 0],
  ["todo bloco renderiza sem lançar", todosBlocos.every((b) => typeof renderBlock(b) === "string")],
  ["tipo desconhecido falha alto", (() => {
    try {
      renderBlock({ type: "inexistente" });
      return false;
    } catch {
      return true;
    }
  })()],
]);
if (tiposInvalidos.length) console.log(`  tipos inválidos: ${tiposInvalidos.join(", ")}`);

/* --- Assets referenciados existem em public -------------------------------- */

const caminhos = new Set();
function coletar(valor) {
  if (typeof valor === "string" && valor.startsWith("/") && /\.(webp|svg|png|jpg|mp4|wav)$/.test(valor)) {
    caminhos.add(valor);
  } else if (Array.isArray(valor)) {
    valor.forEach(coletar);
  } else if (valor && typeof valor === "object") {
    Object.values(valor).forEach(coletar);
  }
}
coletar(conteudo);

const ausentes = [...caminhos].filter((p) => !existsSync(join(RAIZ, "public", p)));
verificar("assets", [
  [`${caminhos.size} arquivos referenciados existem em public/`, ausentes.length === 0],
]);
if (ausentes.length) console.log(`  faltando: ${ausentes.join(", ")}`);

/* --- Banner 2 -------------------------------------------------------------- */

const html2 = renderPage(site, pages.banner2, "banner2");
const b2 = pages.banner2;

verificar("banner2", [
  ["hero com imagem e alt", html2.includes(b2.hero.src) && html2.includes(b2.hero.alt)],
  ["vídeo em bloco de largura total", html2.includes("page__full") && html2.includes("data-video-media")],
  ["coluna direita cola na rolagem", html2.includes("page__columns--cola-main")],
  ["dois cards com miniatura", (html2.match(/card--with-thumb/g) || []).length === 2],
  ["miniatura do quadrinho é imagem, não bloco vazio", html2.includes("/img/quadrinho/pagina-01.webp")],
  ["miniaturas com tamanho próprio", html2.includes("--thumb-w:120px") && html2.includes("--thumb-h:180px")],
  ["ordem de leitura do mobile declarada", (html2.match(/--ordem:/g) || []).length === b2.blocks.length],
  ["vídeo antes do texto no DOM", html2.indexOf("data-video-media") < html2.indexOf("Das tradições Guarani")],
  ["sem undefined vazando", !html2.includes("undefined")],
  ["leitor de quadrinho na página", html2.includes('id="modal-quadrinho"') && html2.includes("data-flipbook")],
  ["botão abre o leitor, não navega", html2.includes('data-abre="modal-quadrinho"') && html2.includes('aria-haspopup="dialog"')],
  ["7 páginas + CTA no leitor", (JSON.parse(html2.match(/data-pages='([^']*)'/)[1]) || []).length === 8],
  ["quiz com quatro perguntas", b2.quiz.questions.length === 4],
  ["cada pergunta tem exatamente uma resposta correta", b2.quiz.questions.every((question) => question.options.filter((option) => option.correct).length === 1)],
  ["ids das perguntas são únicos", new Set(b2.quiz.questions.map((question) => question.id)).size === b2.quiz.questions.length],
  ["quiz renderiza todos os campos obrigatórios", (html2.match(/type="radio"/g) || []).length === 13 && (html2.match(/required/g) || []).length === 13],
  ["número e título ficam dentro do cartão da pergunta", (html2.match(/fieldset class="quiz-question"[\s\S]{0,180}<div class="quiz-question__legend"/g) || []).length === 4],
  ["painel abre o quiz", html2.includes('data-abre="modal-quiz"')],
  ["fim do quadrinho aponta para o mesmo quiz", html2.includes('"opens":"modal-quiz"')],
  ["modal do quiz está presente", html2.includes('class="modal modal--quiz"') && html2.includes("data-quiz-form")],
  ["resultados cobrem todas as faixas", b2.quiz.results.some((result) => result.minRatio === 1) && b2.quiz.results.some((result) => result.minRatio === 0)],
]);

/* --- Banner 3 -------------------------------------------------------------- */

const html3 = renderPage(site, pages.banner3, "banner3");

verificar("banner3", [
  ["hero com imagem e alt", html3.includes(pages.banner3.hero.src)],
  ["vídeo na coluna direita, não em largura total", html3.includes("data-video-media") && !html3.includes("page__full")],
  ["cabeçalho do vídeo usa o ícone da entrevista", /message-circle|<svg[^>]*>[\s\S]{0,400}Acesse a entrevista/.test(html3)],
  ["parágrafo sem título não deixa heading vazio", !/<h2[^>]*><\/h2>/.test(html3)],
  ["três imagens ilustrativas", (html3.match(/fade-image__img/g) || []).length === 3],
  ["nenhuma imagem com blend (todas já vêm transparentes)", !html3.includes("fade-image--screen")],
  ["coluna direita cola na rolagem", html3.includes("page__columns--cola-main")],
  ["sem undefined vazando", !html3.includes("undefined")],
]);

/* --- Banner 4 -------------------------------------------------------------- */

const html4 = renderPage(site, pages.banner4, "banner4");

verificar("banner4", [
  ["hero com imagem e alt", html4.includes(pages.banner4.hero.src)],
  ["coluna ESQUERDA cola na rolagem", html4.includes("page__columns--cola-aside")],
  ["linha do tempo dentro de um painel", html4.includes("panel__box") && html4.includes("class=\"timeline\"")],
  ["oito marcos", (html4.match(/timeline__item/g) || []).length === 8],
  ["todo marco tem espaço reservado de imagem", (html4.match(/timeline__image/g) || []).length === 8],
  // O campo fica declarado em todo marco, mesmo vazio: é ele que mostra onde
  // entra a arte quando ela existir.
  [
    "todo marco declara o campo image",
    pages.banner4.blocks
      .filter((b) => b.type === "timeline")
      .flatMap((b) => b.items)
      .every((item) => "image" in item),
  ],
  ["image nulo não vira <img> quebrada", !html4.includes('src="null"') && !html4.includes("<img src=\"\"")],
  ["dois parágrafos sem título", (html4.match(/<div class="text-section">\s*<p/g) || []).length === 2],
  ["catálogo aparece depois da linha do tempo", html4.indexOf("recipe-catalog") > html4.indexOf("timeline")],
  ["treze receitas no catálogo", (html4.match(/class="recipe-card"/g) || []).length === 13],
  ["treze leitores de receita", (html4.match(/class="modal modal--recipe"/g) || []).length === 13],
  ["cada receita tem identificador único", (() => {
    const recipes = pages.banner4.blocks.find((block) => block.type === "recipes")?.items ?? [];
    return recipes.length === new Set(recipes.map((recipe) => recipe.id)).size;
  })()],
  ["todas as receitas têm ingredientes e preparo", pages.banner4.blocks.find((block) => block.type === "recipes").items.every((recipe) => recipe.ingredients?.length && recipe.preparation?.length)],
  ["sem undefined vazando", !html4.includes("undefined")],
]);

/* --- Espaço reservado das imagens ------------------------------------------ */

const paginasHtml = slugs.map((s) => renderPage(site, pages[s], s, pages)).join("");
const imgs = [...paginasHtml.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
const semMedida = imgs.filter((tag) => !/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag));

verificar("imagens", [
  [
    `as ${imgs.length} <img> reservam espaço com width e height`,
    semMedida.length === 0,
  ],
]);
if (semMedida.length) {
  console.log(`  sem medida:\n    ${semMedida.slice(0, 5).join("\n    ")}`);
  console.log("  rode: npm run dimensoes");
}

/* --- Home ------------------------------------------------------------------ */

const htmlHome = renderPage(site, pages.home, "home", pages);
const grade = pages.home.blocks.find((b) => b.type === "banners");

verificar("home", [
  ["abertura com título e apresentação", htmlHome.includes("intro__title") && htmlHome.includes("intro__lead")],
  ["abertura compõe com a Cruz de Lorena", htmlHome.includes("intro__figure") && htmlHome.includes("banner-1-1.webp")],
  ["um card por banner", (htmlHome.match(/banner-grid__item/g) || []).length === grade.items.length],
  ["cinco banners na grade", grade.items.length === 5],
  ["todo card aponta para uma página existente", grade.items.every((i) => pages[i.slug])],
  [
    "card mostra o hero do próprio banner",
    grade.items.every((i) => htmlHome.includes(pages[i.slug].hero.src)),
  ],
  ["conteúdos de cada banner listados", htmlHome.includes("banner-card__tag")],
  ["sem hero, o header não flutua", htmlHome.includes("page__top--sem-hero")],
  ["sem player de audiodescrição", !htmlHome.includes("data-player-audio")],
  ["sem undefined vazando", !htmlHome.includes("undefined")],
]);

/* --- Banner 5 -------------------------------------------------------------- */

const html5 = renderPage(site, pages.banner5, "banner5");

verificar("banner5", [
  ["hero com imagem e alt", html5.includes(pages.banner5.hero.src)],
  ["onze pratos dos alunos no painel", (html5.match(/class="card card--with-thumb"/g) || []).length === 11],
  ["todo prato leva botão de leitura", (html5.match(/Ver prato/g) || []).length === 11],
  ["onze leitores completos", (html5.match(/class="modal modal--recipe modal--student-recipe"/g) || []).length === 11],
  ["nomes dos alunos presentes", ["Vinícius Ribeiro Regazzon", "Andressa Gay Machado", "Gabrielle Lago Vieira"].every((nome) => html5.includes(nome))],
  ["todo prato tem imagem e descrição", pages.banner5.blocks.find((bloco) => bloco.type === "studentRecipes").items.every((item) => item.images?.length && item.description?.length)],
  ["duas imagens ilustrativas", (html5.match(/fade-image__img/g) || []).length === 2],
  ["citação com parágrafo junto", /text-section--highlight[\s\S]{0,400}text-section__body/.test(html5)],
  ["coluna direita cola na rolagem", html5.includes("page__columns--cola-main")],
  ["sem undefined vazando", !html5.includes("undefined")],
]);

/* --- Página renderizada ---------------------------------------------------- */

const html = renderPage(site, pages.banner1, "banner1");
const b1 = pages.banner1;

verificar("banner1", [
  ["hero com imagem e alt", html.includes(b1.hero.src) && html.includes(b1.hero.alt)],
  ["item de navegação atual marcado", (html.match(/aria-current="page"/g) || []).length === 1],
  ["texto de boas-vindas presente", html.includes("Bem-vindo(a)!")],
  ["lista de tipos de conteúdo com 5 itens", (html.match(/content-list__item/g) || []).length === 5],
  ["frase de destaque presente", html.includes("as raízes que nos unem")],
  ["painel com 5 cards", (html.match(/class="card"/g) || []).length === 5],
  ["cinco projetos reais", ["Livro Sabores e Saberes de São Borja", "Aline Prestes Roque", "Camila Nemitz de Oliveira Saraiva", "Paula de Oliveira Sant’Ana", "Rut Friederich Marquetto"].every((texto) => html.includes(texto))],
  ["botões abrem os leitores", (html.match(/data-abre="modal-pdf-projeto-/g) || []).length === 5],
  ["cinco leitores de PDF", (html.match(/class="modal modal--pdf"/g) || []).length === 5],
  ["pré-visualizações usam o Drive", (html.match(/drive\.google\.com\/file\/d\/[^\"]+\/preview/g) || []).length === 5],
  ["links de reserva abrem em nova guia", (html.match(/target="_blank"/g) || []).length === 5],
  ["imagem ilustrativa com fade", html.includes("fade-image__img")],
  ["player de audiodescrição presente", html.includes("data-player-audio")],
  [
    "rodapé mostra todas as logos declaradas",
    (html.match(/class="footer__logo"/g) || []).length === site.footer.supporters.logos.length,
  ],
  ["blocos nas colunas certas", html.indexOf("page__aside") < html.indexOf("page__main")],
  ["sem undefined vazando", !html.includes("undefined")],
  ["sem [object Object]", !html.includes("[object Object]")],
]);

/* --- Cada página tem um HTML de entrada ------------------------------------ */

// A home mora na raiz; as demais, numa pasta com o nome do slug.
const entradaDe = (slug) => (slug === "home" ? "index.html" : join(slug, "index.html"));

verificar("entradas", [
  ...slugs.map((s) => [
    `${entradaDe(s)} existe e aponta para o slug`,
    existsSync(join(RAIZ, entradaDe(s)))
      && readFileSync(join(RAIZ, entradaDe(s)), "utf8").includes(`data-page="${s}"`),
  ]),
  // Fundo pintado no <head>: sem isto a troca de página pisca em branco antes
  // de o CSS chegar.
  ...slugs.map((s) => [
    `${entradaDe(s)} pinta o fundo antes do CSS`,
    readFileSync(join(RAIZ, entradaDe(s)), "utf8").includes("background: #19120d"),
  ]),
  // Nada visível no HTML cru além do ponto de montagem — qualquer elemento
  // solto aparece sem estilo durante o carregamento.
  ...slugs.map((s) => {
    const corpo = readFileSync(join(RAIZ, entradaDe(s)), "utf8").match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
    const semScript = corpo.replace(/<script[\s\S]*?<\/script>/g, "").trim();
    return [`${entradaDe(s)} não tem conteúdo solto no <body>`, semScript === '<div id="app"></div>'];
  }),
  ...slugs.map((s) => [
    `${entradaDe(s)} declara o favicon`,
    readFileSync(join(RAIZ, entradaDe(s)), "utf8").includes('rel="icon" href="/favicon.svg"'),
  ]),
  [
    "arquivos do favicon existem",
    ["favicon.svg", "favicon-96.png", "apple-touch-icon.png"].every((f) =>
      existsSync(join(RAIZ, "public", f)),
    ),
  ],
]);

process.exit(falhou ? 1 : 0);
