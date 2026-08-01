/**
 * Gera src/content/imagens.js com a medida de cada imagem de public/img.
 *
 * As medidas viram os atributos `width` e `height` das <img>, o que faz o
 * navegador reservar o espaço antes de a imagem chegar. Sem isso a página
 * cresce conforme carrega — e a restauração de scroll no botão Voltar erra o
 * alvo, porque no momento de restaurar o documento ainda está curto.
 *
 * Lê o cabeçalho dos arquivos direto, sem dependência: PNG, WebP e SVG têm a
 * medida nos primeiros bytes.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const RAIZ = join(import.meta.dirname, "..");
const PUBLICO = join(RAIZ, "public");
// Tudo que pode virar uma <img> no site.
const PASTAS = ["img", "icons"];
const SAIDA = join(RAIZ, "src", "content", "imagens.js");

/** PNG: largura e altura são dois inteiros de 32 bits a partir do byte 16. */
function medirPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

/** WebP: a medida muda conforme o formato interno (lossy, lossless ou estendido). */
function medirWebp(buf) {
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }

  const tipo = buf.toString("ascii", 12, 16);

  if (tipo === "VP8X") {
    return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
  }

  if (tipo === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }

  if (tipo === "VP8 ") {
    return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  }

  return null;
}

/** SVG: usa width/height quando existem; senão, cai no viewBox. */
function medirSvg(buf) {
  const texto = buf.toString("utf8", 0, 2000);
  const w = texto.match(/\bwidth="([\d.]+)/);
  const h = texto.match(/\bheight="([\d.]+)/);
  if (w && h) return [Math.round(+w[1]), Math.round(+h[1])];

  const vb = texto.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
  return vb ? [Math.round(+vb[1]), Math.round(+vb[2])] : null;
}

function medir(arquivo) {
  const buf = readFileSync(arquivo);
  if (arquivo.endsWith(".png")) return medirPng(buf);
  if (arquivo.endsWith(".webp")) return medirWebp(buf);
  if (arquivo.endsWith(".svg")) return medirSvg(buf);
  return null;
}

function percorrer(dir) {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    return statSync(caminho).isDirectory() ? percorrer(caminho) : [caminho];
  });
}

const mapa = {};
const semMedida = [];

for (const pasta of PASTAS) {
  const base = join(PUBLICO, pasta);
  for (const arquivo of percorrer(base).sort()) {
    const url = `/${pasta}/` + relative(base, arquivo).split(sep).join("/");
    const medida = medir(arquivo);
    if (medida) mapa[url] = medida;
    else semMedida.push(url);
  }
}

const linhas = Object.entries(mapa)
  .map(([url, [w, h]]) => `  "${url}": [${w}, ${h}],`)
  .join("\n");

writeFileSync(
  SAIDA,
  `/**
 * Medida de cada imagem de public/img — GERADO, não editar à mão.
 * Rode \`npm run dimensoes\` depois de acrescentar ou trocar qualquer imagem.
 *
 * Serve para as <img> saírem com \`width\` e \`height\`, reservando o espaço
 * antes do download.
 */
export const DIMENSOES = {
${linhas}
};
`,
);

console.log(`${Object.keys(mapa).length} imagens medidas -> src/content/imagens.js`);
if (semMedida.length) console.log(`sem medida: ${semMedida.join(", ")}`);
