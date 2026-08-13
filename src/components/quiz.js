import { icon } from "./icon.js";

/** Formulário de quiz gerado inteiramente pelos dados de site.json. */
export function quizModal({
  id = "modal-quiz",
  title = "Quiz",
  intro = "Responda às perguntas.",
  submitLabel = "Ver resultado",
  retryLabel = "Tentar novamente",
  questions = [],
  results = [],
} = {}) {
  const dadosResultados = JSON.stringify(results).replace(/'/g, "&apos;");

  return `
    <div class="modal modal--quiz" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-title" hidden>
      <section class="quiz" data-quiz data-results='${dadosResultados}'>
        <header class="quiz__header">
          <div>
            <p class="quiz__eyebrow">Quiz</p>
            <h2 class="quiz__title" id="${id}-title">${title}</h2>
          </div>
          <button class="modal__close modal__close--inline" type="button" data-modal-close data-tooltip="Fechar" aria-label="Fechar quiz">
            ${icon("x")}
          </button>
        </header>

        <div class="quiz__content">
          <form class="quiz__form" data-quiz-form novalidate>
            <p class="quiz__intro">${intro}</p>

            <div class="quiz__progress" aria-live="polite">
              <p data-quiz-progress-text>0 de ${questions.length} respondidas</p>
              <div class="quiz__progress-track" aria-hidden="true">
                <span data-quiz-progress-bar style="width:0%"></span>
              </div>
            </div>

            <div class="quiz__error" data-quiz-error role="alert" tabindex="-1" hidden></div>

            <div class="quiz__questions">
              ${questions.map(questionHTML).join("")}
            </div>

            <button class="button quiz__submit" type="submit">
              ${icon("check-circle")}${submitLabel}
            </button>
          </form>

          <section class="quiz-result" data-quiz-result aria-live="polite" hidden>
            <div class="quiz-result__celebration" data-quiz-celebration aria-hidden="true"></div>
            <p class="quiz-result__score" data-quiz-score></p>
            <div class="quiz-result__stars" data-quiz-stars aria-label=""></div>
            <h3 class="quiz-result__title" data-quiz-heading tabindex="-1"></h3>
            <p class="quiz-result__message" data-quiz-message></p>
            <button class="button" type="button" data-quiz-retry>
              ${icon("refresh-cw")}${retryLabel}
            </button>
          </section>
        </div>
      </section>
    </div>`;
}

function questionHTML({ id, text, options = [] }, index) {
  return `
    <fieldset class="quiz-question" data-quiz-question tabindex="-1" aria-labelledby="quiz-${id}-title">
      <div class="quiz-question__legend" id="quiz-${id}-title">
        <span class="quiz-question__number" aria-hidden="true">${index + 1}</span>
        <span>${text}</span>
      </div>
      <div class="quiz-question__options">
        ${options
          .map(
            (option, optionIndex) => `
              <label class="quiz-option">
                <input
                  type="radio"
                  name="quiz-${id}"
                  value="${optionIndex}"
                  data-correct="${Boolean(option.correct)}"
                  required
                >
                <span class="quiz-option__marker" aria-hidden="true"></span>
                <span>${option.text}</span>
              </label>`,
          )
          .join("")}
      </div>
    </fieldset>`;
}

export function initQuizzes(scope = document) {
  for (const root of scope.querySelectorAll("[data-quiz]")) initQuiz(root);
}

function initQuiz(root) {
  const form = root.querySelector("[data-quiz-form]");
  const result = root.querySelector("[data-quiz-result]");
  const questions = [...root.querySelectorAll("[data-quiz-question]")];
  const progressText = root.querySelector("[data-quiz-progress-text]");
  const progressBar = root.querySelector("[data-quiz-progress-bar]");
  const error = root.querySelector("[data-quiz-error]");
  if (!form || !result || !questions.length) return;

  let results = [];
  try {
    results = JSON.parse(root.dataset.results || "[]").sort((a, b) => b.minRatio - a.minRatio);
  } catch {
    results = [];
  }

  function atualizarProgresso() {
    const answered = questions.filter((question) => question.querySelector("input:checked")).length;
    progressText.textContent = `${answered} de ${questions.length} respondidas`;
    progressBar.style.width = `${(answered / questions.length) * 100}%`;
  }

  form.addEventListener("change", (event) => {
    const scrollTop = root.scrollTop;
    const question = event.target.closest("[data-quiz-question]");
    question?.classList.remove("quiz-question--invalid");
    question?.removeAttribute("aria-invalid");
    error.hidden = true;
    atualizarProgresso();
    root.scrollTop = scrollTop;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const unanswered = questions.filter((question) => !question.querySelector("input:checked"));

    questions.forEach((question) => {
      const invalid = unanswered.includes(question);
      question.classList.toggle("quiz-question--invalid", invalid);
      if (invalid) question.setAttribute("aria-invalid", "true");
      else question.removeAttribute("aria-invalid");
    });

    if (unanswered.length) {
      error.textContent = `Responda ${unanswered.length === 1 ? "à pergunta que falta" : `às ${unanswered.length} perguntas que faltam`} antes de ver sua pontuação.`;
      error.hidden = false;
      error.focus();
      unanswered[0].scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const score = questions.filter(
      (question) => question.querySelector("input:checked")?.dataset.correct === "true",
    ).length;
    mostrarResultado(score);
  });

  function mostrarResultado(score) {
    const ratio = score / questions.length;
    const level = results.find((item) => ratio >= item.minRatio) ?? results.at(-1) ?? {};
    const stars = Number(level.stars) || 0;

    root.dataset.celebration = level.celebration || "none";
    root.querySelector("[data-quiz-score]").textContent =
      score === questions.length
        ? `Você acertou todas as ${questions.length} questões!`
        : score === 0
          ? "Você ainda não acertou nenhuma questão."
          : `Você acertou ${score} ${score === 1 ? "questão" : "questões"}!`;
    const starsEl = root.querySelector("[data-quiz-stars]");
    starsEl.textContent = "★".repeat(stars);
    starsEl.setAttribute("aria-label", `${stars} ${stars === 1 ? "estrela" : "estrelas"}`);
    root.querySelector("[data-quiz-heading]").textContent = level.heading || "Veja sua pontuação";
    root.querySelector("[data-quiz-message]").textContent = level.message || "";
    root.querySelector("[data-quiz-celebration]").innerHTML =
      level.celebration === "confetti"
        ? Array.from(
            { length: 20 },
            (_, index) =>
              `<i style="--left:${(index * 47) % 100}%;--rotate:${index * 23}deg;--delay:${index * 35}ms" aria-hidden="true"></i>`,
          ).join("")
        : "";

    form.hidden = true;
    result.hidden = false;
    root.scrollTo({ top: 0, behavior: "smooth" });
    root.querySelector("[data-quiz-heading]").focus();
  }

  root.querySelector("[data-quiz-retry]")?.addEventListener("click", () => {
    form.reset();
    questions.forEach((question) => {
      question.classList.remove("quiz-question--invalid");
      question.removeAttribute("aria-invalid");
    });
    error.hidden = true;
    result.hidden = true;
    form.hidden = false;
    root.dataset.celebration = "none";
    atualizarProgresso();
    root.scrollTo({ top: 0, behavior: "smooth" });
    questions[0].focus();
  });
}
