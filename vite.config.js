import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { extname } from "node:path";

const raiz = (caminho) => fileURLToPath(new URL(caminho, import.meta.url));

/**
 * Em desenvolvimento, redireciona /banner1 para /banner1/ quando existe uma
 * pasta com index.html. É o que host estático faz em produção; sem isso o Vite
 * não acha a página e a requisição acaba caindo no index.html da raiz.
 */
function redirecionaParaBarraFinal() {
  return {
    name: "redireciona-para-barra-final",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [caminho, busca = ""] = req.url.split("?");

        if (
          caminho !== "/"
          && !caminho.endsWith("/")
          && !extname(caminho)
          && existsSync(raiz(`.${caminho}/index.html`))
        ) {
          res.writeHead(301, { Location: `${caminho}/${busca ? `?${busca}` : ""}` });
          res.end();
          return;
        }

        next();
      });
    },
  };
}

// Multi-page: cada página do site é uma entrada própria, com URL de verdade.
// Adicionar uma página = uma entrada no site.json, um HTML de 12 linhas e uma
// linha aqui.
export default defineConfig({
  // Sem isto o Vite usa o fallback de SPA: qualquer rota não encontrada cai no
  // index.html da raiz, e /banner1 abria a biblioteca de componentes.
  appType: "mpa",

  plugins: [redirecionaParaBarraFinal()],

  build: {
    rollupOptions: {
      input: {
        home: raiz("index.html"),
        styleguide: raiz("styleguide/index.html"),
        banner1: raiz("banner1/index.html"),
        banner2: raiz("banner2/index.html"),
        banner3: raiz("banner3/index.html"),
        banner4: raiz("banner4/index.html"),
        banner5: raiz("banner5/index.html"),
      },
    },
  },
});
