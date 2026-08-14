import { card, panel } from "./content.js";
import { icon } from "./icon.js";
import { medidas } from "./medidas.js";

/** Trabalhos dos alunos: painel de prévias e leitores completos. */
export function studentRecipesPanel({ header, items = [] } = {}) {
  const cards = items.map((recipe) =>
    card({
      title: recipe.title,
      meta: recipe.student,
      thumb: {
        src: recipe.images?.[0]?.src,
        alt: recipe.images?.[0]?.alt ?? "",
        width: 140,
        height: 140,
      },
      action: {
        label: "Ver prato",
        iconName: "book-open",
        opens: `prato-aluno-${recipe.id}`,
      },
    }),
  );

  return `
    ${panel({
      header: header ? { iconName: header.icon ?? "book-open", label: header.label } : null,
      children: cards,
    })}
    ${items.map(studentRecipeModal).join("")}`;
}

function studentRecipeModal(recipe) {
  return `
    <div class="modal modal--recipe modal--student-recipe" id="prato-aluno-${recipe.id}" role="dialog" aria-modal="true" aria-labelledby="prato-aluno-${recipe.id}-title" hidden>
      <article class="recipe-reader student-recipe-reader">
        <header class="recipe-reader__header">
          <div>
            <p class="student-recipe-reader__eyebrow">Prato desenvolvido por</p>
            <h2 id="prato-aluno-${recipe.id}-title">${recipe.title}</h2>
            <p class="student-recipe-reader__student">${recipe.student}</p>
          </div>
          <button class="modal__close modal__close--inline" type="button" data-modal-close data-tooltip="Fechar" aria-label="Fechar prato">
            ${icon("x")}
          </button>
        </header>
        <div class="recipe-reader__content">
          ${studentRecipeGallery(recipe.images)}
          <section class="recipe-reader__section student-recipe-reader__description">
            <h3>Sobre o prato</h3>
            ${(recipe.description ?? []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
          </section>
        </div>
      </article>
    </div>`;
}

function studentRecipeGallery(images = []) {
  if (!images.length) return "";
  return `
    <div class="recipe-reader__gallery${images.length > 1 ? " recipe-reader__gallery--multiple" : ""}">
      ${images
        .map(
          (image) =>
            `<img src="${image.src}"${medidas(image.src)} alt="${image.alt ?? ""}" loading="lazy" decoding="async">`,
        )
        .join("")}
    </div>`;
}
