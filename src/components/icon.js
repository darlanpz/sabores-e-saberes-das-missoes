import feather from "feather-icons";

/**
 * Ícone Feather — a única biblioteca de ícones do projeto.
 *
 * Feather é outline por natureza (`fill="none"`). As variantes fill do style
 * guide (play, circle, fast-forward) são obtidas sobrescrevendo fill e stroke,
 * o que é feito pela classe `icon--fill`.
 *
 * @param {string} name  nome do ícone no Feather
 * @param {object} [opts]
 * @param {number} [opts.size=24]
 * @param {boolean} [opts.fill=false]
 * @param {string} [opts.label]  rótulo acessível; sem ele o ícone é decorativo
 */
export function icon(name, { size = 24, fill = false, label } = {}) {
  const glyph = feather.icons[name];
  if (!glyph) throw new Error(`Ícone Feather inexistente: "${name}"`);

  const classes = ["icon", fill && "icon--fill"].filter(Boolean).join(" ");
  const a11y = label
    ? `role="img" aria-label="${label}"`
    : 'aria-hidden="true" focusable="false"';

  return glyph.toSvg({
    class: classes,
    width: size,
    height: size,
    "stroke-width": 1.5,
  }).replace("<svg", `<svg ${a11y}`);
}

/** Selo de audiodescrição — não existe no Feather, é asset próprio. */
export function audioDescriptionIcon() {
  return `<img src="/icons/audio-description.svg" alt="" width="24" height="24">`;
}
