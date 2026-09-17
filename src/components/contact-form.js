import { icon } from "./icon.js";
import { feedback } from "./content.js";
import { medidas } from "./medidas.js";

const TIPOS_PADRAO = ["Elogio", "Dúvida", "Sugestão"];

/**
 * Página de contato — abertura (texto + imagem, como a `.intro` da Home) e
 * logo abaixo o formulário, com pouco respiro entre as duas: é uma única
 * seção, não dois blocos separados.
 *
 * @param {object} [opts]
 * @param {string} [opts.title]
 * @param {string} [opts.lead]
 * @param {string} [opts.text]
 * @param {{src: string, alt: string}} [opts.image]
 * @param {string} [opts.submitLabel]
 * @param {string} [opts.sendingLabel]
 * @param {string} [opts.successMessage]
 * @param {string} [opts.errorMessage]
 * @param {string[]} [opts.tipos]
 * @param {{nome?: string, email?: string, tipo?: string, cidade?: string, mensagem?: string}} [opts.labels]
 * @param {{cidade?: string}} [opts.placeholders]
 * @param {string} [opts.cidadeAjuda]
 */
export function contactForm({
  title,
  lead,
  text,
  image,
  submitLabel = "Enviar mensagem",
  sendingLabel = "Enviando…",
  successMessage = "Mensagem enviada! Vamos responder em breve.",
  errorMessage = "Não foi possível enviar agora. Tente novamente em instantes.",
  tipos = TIPOS_PADRAO,
  labels = {},
  placeholders = {},
  cidadeAjuda = "Buscamos na lista oficial de municípios do IBGE.",
} = {}) {
  const rotulo = {
    nome: "Nome",
    email: "E-mail",
    tipo: "Tipo de mensagem",
    cidade: "Cidade",
    mensagem: "Mensagem",
    ...labels,
  };

  const abertura = title
    ? `
    <div class="contact-page__intro">
      <div class="contact-page__intro-content">
        <h1 class="intro__title">${title}</h1>
        ${lead ? `<p class="intro__lead">${lead}</p>` : ""}
        ${text ? `<p class="intro__text">${text}</p>` : ""}
      </div>
      ${
        image
          ? `<figure class="intro__figure fade-image fade-image--screen fade-image--rounded">
              <img class="fade-image__img" src="${image.src}"${medidas(image.src)} alt="${image.alt ?? ""}" loading="lazy" decoding="async">
            </figure>`
          : ""
      }
    </div>`
    : "";

  return `
    <section class="contact-page">
      ${abertura}

      <form class="contact-form" data-contact-form novalidate
        data-submit-label="${submitLabel}"
        data-sending-label="${sendingLabel}"
        data-success-message="${successMessage}"
        data-error-message="${errorMessage}"
      >
        <input type="hidden" name="startedAt" data-contact-started>

        <div class="form-field visually-hidden" aria-hidden="true">
          <label for="contato-site">Deixe este campo em branco</label>
          <input type="text" id="contato-site" name="website" tabindex="-1" autocomplete="off">
        </div>

        <div class="form-field">
          <label class="form-field__label" for="contato-nome">${rotulo.nome}</label>
          <input
            class="form-field__control"
            type="text"
            id="contato-nome"
            name="nome"
            autocomplete="name"
            required
            aria-describedby="contato-nome-erro"
          >
          <p class="form-field__error" id="contato-nome-erro" role="alert" hidden></p>
        </div>

        <div class="form-field">
          <label class="form-field__label" for="contato-email">${rotulo.email}</label>
          <input
            class="form-field__control"
            type="email"
            id="contato-email"
            name="email"
            autocomplete="email"
            required
            aria-describedby="contato-email-erro"
          >
          <p class="form-field__error" id="contato-email-erro" role="alert" hidden></p>
        </div>

        <fieldset class="form-field" data-invalid-target="tipo" tabindex="-1">
          <legend class="form-field__label">${rotulo.tipo}</legend>
          <div class="select-buttons">
            ${tipos
              .map(
                (tipo, index) => `
              <label class="select-button">
                <input
                  type="radio"
                  name="tipo"
                  value="${tipo}"
                  ${index === 0 ? 'aria-describedby="contato-tipo-erro"' : ""}
                  required
                >
                <span>${tipo}</span>
              </label>`,
              )
              .join("")}
          </div>
          <p class="form-field__error" id="contato-tipo-erro" role="alert" hidden></p>
        </fieldset>

        <div class="form-field">
          <label class="form-field__label" for="contato-cidade">${rotulo.cidade}</label>
          <div class="contact-combobox" data-city-combobox>
            <input
              class="form-field__control"
              type="text"
              id="contato-cidade"
              name="cidade"
              role="combobox"
              aria-expanded="false"
              aria-autocomplete="list"
              aria-controls="contato-cidade-lista"
              autocomplete="off"
              placeholder="${placeholders.cidade ?? "Digite o nome da sua cidade"}"
              data-city-input
            >
            <ul class="contact-combobox__list" id="contato-cidade-lista" role="listbox" data-city-list hidden></ul>
            <p class="contact-combobox__status" data-city-status aria-live="polite"></p>
          </div>
          <p class="form-field__help" id="contato-cidade-ajuda">${cidadeAjuda}</p>
        </div>

        <div class="form-field">
          <label class="form-field__label" for="contato-mensagem">${rotulo.mensagem}</label>
          <textarea
            class="form-field__control form-field__control--textarea"
            id="contato-mensagem"
            name="mensagem"
            rows="6"
            required
            aria-describedby="contato-mensagem-erro"
          ></textarea>
          <p class="form-field__error" id="contato-mensagem-erro" role="alert" hidden></p>
        </div>

        <div class="contact-form__status" data-contact-status aria-live="polite"></div>

        <button class="button contact-form__submit" type="submit" data-contact-submit>
          <span class="button__icon">${icon("send")}</span><span data-contact-submit-label>${submitLabel}</span>
        </button>
      </form>
    </section>`;
}

/* -------------------------------------------------------------------------- */

const REQUIRED_FIELDS = {
  nome: "Informe seu nome.",
  email: "Informe um e-mail.",
  tipo: "Selecione o tipo de mensagem.",
  mensagem: "Escreva sua mensagem.",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let municipiosPromise = null;

/** Busca os municípios do IBGE uma única vez por sessão (lazy). */
function carregarMunicipios() {
  if (municipiosPromise) return municipiosPromise;

  municipiosPromise = (async () => {
    try {
      const guardados = sessionStorage.getItem("ibge-municipios");
      if (guardados) return JSON.parse(guardados);
    } catch {
      // sessionStorage indisponível (modo privado, por exemplo) — segue para a rede.
    }

    const resposta = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome",
    );
    if (!resposta.ok) throw new Error("Falha ao buscar municípios do IBGE");
    const dados = await resposta.json();
    const cidades = dados.map((item) => ({
      nome: item.nome,
      uf: item.microrregiao?.mesorregiao?.UF?.sigla ?? item["regiao-imediata"]?.["regiao-intermediaria"]?.UF?.sigla ?? "",
    }));

    try {
      sessionStorage.setItem("ibge-municipios", JSON.stringify(cidades));
    } catch {
      // sem espaço/indisponível — sem problema, só não fica em cache.
    }

    return cidades;
  })();

  return municipiosPromise;
}

function semAcento(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function initCityCombobox(root) {
  const combo = root.querySelector("[data-city-combobox]");
  if (!combo) return;

  const input = combo.querySelector("[data-city-input]");
  const list = combo.querySelector("[data-city-list]");
  const status = combo.querySelector("[data-city-status]");

  let cidades = [];
  let opcoes = [];
  let indiceAtivo = -1;
  let carregando = false;
  let erro = false;

  function fecharLista() {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    indiceAtivo = -1;
  }

  function renderizarOpcoes(termo) {
    const termoNormalizado = semAcento(termo.trim());
    opcoes = termoNormalizado
      ? cidades.filter((cidade) => semAcento(cidade.nome).includes(termoNormalizado)).slice(0, 8)
      : [];

    if (!opcoes.length) {
      fecharLista();
      list.innerHTML = "";
      return;
    }

    list.innerHTML = opcoes
      .map(
        (cidade, index) => `
        <li
          class="contact-combobox__option"
          id="contato-cidade-opcao-${index}"
          role="option"
          aria-selected="false"
          data-value="${cidade.nome} — ${cidade.uf}"
        >${cidade.nome} — ${cidade.uf}</li>`,
      )
      .join("");
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    indiceAtivo = -1;
  }

  function destacar(index) {
    const itens = [...list.querySelectorAll("[role=option]")];
    itens.forEach((item, itemIndex) => {
      const ativo = itemIndex === index;
      item.classList.toggle("contact-combobox__option--ativo", ativo);
      item.setAttribute("aria-selected", String(ativo));
    });
    indiceAtivo = index;
    if (index >= 0) input.setAttribute("aria-activedescendant", itens[index].id);
    else input.removeAttribute("aria-activedescendant");
  }

  function selecionar(index) {
    const cidade = opcoes[index];
    if (!cidade) return;
    input.value = `${cidade.nome} — ${cidade.uf}`;
    fecharLista();
  }

  async function garantirCidadesCarregadas() {
    if (cidades.length || carregando) return;
    carregando = true;
    status.textContent = "Carregando cidades…";
    try {
      cidades = await carregarMunicipios();
      erro = false;
      status.textContent = "";
    } catch {
      erro = true;
      status.textContent =
        "Não foi possível carregar a lista de cidades agora — você pode digitar o nome da sua cidade normalmente.";
    } finally {
      carregando = false;
    }
  }

  input.addEventListener("focus", garantirCidadesCarregadas);

  input.addEventListener("input", () => {
    if (erro || carregando) return;
    renderizarOpcoes(input.value);
  });

  input.addEventListener("keydown", (event) => {
    if (list.hidden && event.key !== "ArrowDown") return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (list.hidden) renderizarOpcoes(input.value);
      else destacar(Math.min(indiceAtivo + 1, opcoes.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      destacar(Math.max(indiceAtivo - 1, 0));
    } else if (event.key === "Enter") {
      if (indiceAtivo >= 0) {
        event.preventDefault();
        selecionar(indiceAtivo);
      }
    } else if (event.key === "Escape") {
      fecharLista();
    }
  });

  list.addEventListener("mousedown", (event) => {
    const item = event.target.closest("[role=option]");
    if (!item) return;
    event.preventDefault();
    const index = opcoes.findIndex((cidade) => `${cidade.nome} — ${cidade.uf}` === item.dataset.value);
    selecionar(index);
  });

  document.addEventListener("click", (event) => {
    if (!combo.contains(event.target)) fecharLista();
  });
}

function campoDeErro(form, nome) {
  return form.querySelector(`#contato-${nome}-erro`);
}

/** `tipo` é um grupo de radios: o alvo do erro é o fieldset, não um campo só. */
function alvoDoErro(form, nome) {
  return form.querySelector(`[data-invalid-target="${nome}"]`) ?? form.elements[nome];
}

function marcarErro(form, nome, mensagem) {
  const alvo = alvoDoErro(form, nome);
  const erro = campoDeErro(form, nome);
  if (!alvo || !erro) return;
  alvo.setAttribute("aria-invalid", "true");
  erro.textContent = mensagem;
  erro.hidden = false;
}

function limparErro(form, nome) {
  const alvo = alvoDoErro(form, nome);
  const erro = campoDeErro(form, nome);
  if (!alvo || !erro) return;
  alvo.removeAttribute("aria-invalid");
  erro.hidden = true;
}

function validar(form) {
  let valido = true;

  for (const [nome, mensagem] of Object.entries(REQUIRED_FIELDS)) {
    const valor = form.elements[nome]?.value.trim();
    if (!valor) {
      marcarErro(form, nome, mensagem);
      valido = false;
    } else if (nome === "email" && !EMAIL_REGEX.test(valor)) {
      marcarErro(form, nome, "Informe um e-mail válido.");
      valido = false;
    } else {
      limparErro(form, nome);
    }
  }

  return valido;
}

function initContactSubmit(form) {
  const started = form.querySelector("[data-contact-started]");
  if (started) started.value = String(Date.now());

  const status = form.querySelector("[data-contact-status]");
  const submit = form.querySelector("[data-contact-submit]");
  const submitLabel = form.querySelector("[data-contact-submit-label]");
  const rotuloEnviar = form.dataset.submitLabel;
  const rotuloEnviando = form.dataset.sendingLabel;
  const mensagemSucesso = form.dataset.successMessage;
  const mensagemErro = form.dataset.errorMessage;

  form.addEventListener("input", (event) => {
    const nome = event.target.name;
    if (nome in REQUIRED_FIELDS) limparErro(form, nome);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.innerHTML = "";

    if (!validar(form)) {
      const primeiroInvalido = form.querySelector('[aria-invalid="true"]');
      primeiroInvalido?.focus();
      return;
    }

    const dados = new FormData(form);
    const payload = {
      nome: dados.get("nome"),
      email: dados.get("email"),
      tipo: dados.get("tipo"),
      cidade: dados.get("cidade"),
      mensagem: dados.get("mensagem"),
      website: dados.get("website"),
      startedAt: Number(dados.get("startedAt")),
    };

    submit.disabled = true;
    submitLabel.textContent = rotuloEnviando;

    try {
      const resposta = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resultado = await resposta.json().catch(() => ({ ok: false }));

      if (!resposta.ok || !resultado.ok) throw new Error(resultado.error || "Falha no envio");

      status.innerHTML = feedback({ variant: "success", text: mensagemSucesso });
      form.reset();
      if (started) started.value = String(Date.now());
      status.querySelector(".feedback")?.setAttribute("tabindex", "-1");
      status.querySelector(".feedback")?.focus();
    } catch {
      status.innerHTML = feedback({ variant: "danger", text: mensagemErro });
      status.querySelector(".feedback")?.setAttribute("tabindex", "-1");
      status.querySelector(".feedback")?.focus();
    } finally {
      submit.disabled = false;
      submitLabel.textContent = rotuloEnviar;
    }
  });
}

export function initContactForm(scope = document) {
  for (const form of scope.querySelectorAll("[data-contact-form]")) {
    initCityCombobox(form);
    initContactSubmit(form);
  }
}
