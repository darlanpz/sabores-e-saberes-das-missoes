const VLIBRAS_BASE_URL = "https://vlibras.gov.br/app";
const VLIBRAS_SCRIPT_URL = `${VLIBRAS_BASE_URL}/vlibras-plugin.js`;
const VLIBRAS_SCRIPT_ID = "vlibras-widget-script";

/**
 * Instala o widget oficial uma única vez e fora de #app.
 * Assim, a navegação interna entre banners não remove nem reinicializa o avatar.
 */
export function initVLibras() {
  if (!document.querySelector("[vw]")) {
    const root = document.createElement("div");
    root.setAttribute("vw", "");
    root.className = "enabled";
    root.innerHTML = `
      <div vw-access-button class="active"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>`;
    document.body.append(root);
  }

  const iniciarWidget = () => {
    if (window.__saboresVLibrasInicializado || !window.VLibras?.Widget) return;
    window.__saboresVLibrasInicializado = true;
    new window.VLibras.Widget(VLIBRAS_BASE_URL);
  };

  const carregado = document.getElementById(VLIBRAS_SCRIPT_ID);
  if (carregado) {
    if (window.VLibras?.Widget) iniciarWidget();
    else carregado.addEventListener("load", iniciarWidget, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.id = VLIBRAS_SCRIPT_ID;
  script.src = VLIBRAS_SCRIPT_URL;
  script.addEventListener("load", iniciarWidget, { once: true });
  document.body.append(script);
}
