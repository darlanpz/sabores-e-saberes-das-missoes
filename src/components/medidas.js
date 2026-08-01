import { DIMENSOES } from "../content/imagens.js";

/**
 * Atributos `width` e `height` de uma imagem, prontos para entrar na tag.
 *
 * Com eles o navegador reserva o espaço antes do download: a página não pula
 * conforme as imagens chegam, e a restauração de scroll no botão Voltar acerta
 * o alvo — sem a altura reservada, o documento ainda está curto na hora de
 * restaurar e o scroll para antes do ponto certo.
 *
 * Volta vazio para caminho desconhecido, em vez de inventar medida.
 *
 * @param {string} src caminho a partir da raiz do site
 */
export function medidas(src) {
  const d = DIMENSOES[src];
  return d ? ` width="${d[0]}" height="${d[1]}"` : "";
}
