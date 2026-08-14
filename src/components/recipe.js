import { icon } from "./icon.js";
import { sectionHeader } from "./content.js";
import { medidas } from "./medidas.js";

/** Catálogo e leitores completos, gerados pelos itens declarados no JSON. */
export function recipeCatalog({ header, items = [] } = {}) {
  return `
    <section class="recipe-catalog" aria-labelledby="recipe-catalog-title">
      <div id="recipe-catalog-title">
        ${sectionHeader({ iconName: header?.icon ?? "book-open", label: header?.label ?? "Receitas tradicionais" })}
      </div>
      <div class="recipe-grid">
        ${items.map(recipeCard).join("")}
      </div>
    </section>
    ${items.map(recipeModal).join("")}`;
}

function recipeCard(recipe) {
  const preview = recipe.images?.[0];
  return `
    <article class="recipe-card">
      <div class="recipe-card__media">
        ${preview ? `<img src="${preview.src}"${medidas(preview.src)} alt="${preview.alt ?? ""}" loading="lazy" decoding="async">` : ""}
      </div>
      <div class="recipe-card__body">
        <h3 class="recipe-card__title">${recipe.title}</h3>
        <button class="button recipe-card__button" type="button" data-abre="receita-${recipe.id}" aria-haspopup="dialog">
          <span class="button__icon">${icon("book-open")}</span>
          Ver receita
        </button>
      </div>
    </article>`;
}

function recipeModal(recipe) {
  return `
    <div class="modal modal--recipe" id="receita-${recipe.id}" role="dialog" aria-modal="true" aria-labelledby="receita-${recipe.id}-title" hidden>
      <article class="recipe-reader">
        <header class="recipe-reader__header">
          <h2 id="receita-${recipe.id}-title">${recipe.title}</h2>
          <button class="modal__close modal__close--inline" type="button" data-modal-close data-tooltip="Fechar" aria-label="Fechar receita">
            ${icon("x")}
          </button>
        </header>
        <div class="recipe-reader__content">
          ${recipeGallery(recipe.images)}
          <div class="recipe-reader__sections">
            ${recipe.ingredients?.map(ingredientSection).join("") ?? ""}
            ${recipe.preparation?.map(preparationSection).join("") ?? ""}
            ${recipe.note ? `<aside class="recipe-reader__note"><h3>Observação</h3><p>${recipe.note}</p></aside>` : ""}
          </div>
        </div>
      </article>
    </div>`;
}

function recipeGallery(images = []) {
  if (!images.length) return "";
  return `
    <div class="recipe-reader__gallery${images.length > 1 ? " recipe-reader__gallery--multiple" : ""}">
      ${images.map((image) => `<img src="${image.src}"${medidas(image.src)} alt="${image.alt ?? ""}" loading="lazy" decoding="async">`).join("")}
    </div>`;
}

function ingredientSection({ title = "Ingredientes", items = [] }) {
  return `
    <section class="recipe-reader__section">
      <h3>${title}</h3>
      <ul class="recipe-ingredients">
        ${items.map(({ amount, unit, item }) => `<li><span class="recipe-ingredients__amount">${[amount, unit].filter(Boolean).join(" ")}</span><span>${item}</span></li>`).join("")}
      </ul>
    </section>`;
}

function preparationSection({ title = "Modo de preparo", steps = [] }) {
  return `
    <section class="recipe-reader__section">
      <h3>${title}</h3>
      <ol class="recipe-steps">
        ${steps.map((step) => `<li>${step}</li>`).join("")}
      </ol>
    </section>`;
}
