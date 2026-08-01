/**
 * Revelação do conteúdo — cada bloco sobe e aparece ao entrar em cena.
 *
 * O estado inicial é aplicado por JS, não pelo CSS de partida: assim, se este
 * módulo não rodar, o conteúdo simplesmente aparece sem animação em vez de
 * ficar invisível.
 */

/* Blocos das duas colunas, e as peças de dentro de cada painel. */
const CONTAINERS = [".page__aside", ".page__main", ".panel"];

const ESCALONAMENTO = 60; // ms entre irmãos
const ATRASO_MAXIMO = 240; // teto, para o fim de uma lista longa não esperar demais

export function initReveal(scope = document) {
  const alvos = [];

  for (const seletor of CONTAINERS) {
    for (const container of scope.querySelectorAll(seletor)) {
      // O atraso é contado por container: cada coluna começa do zero, em vez
      // de o painel herdar a espera acumulada da coluna anterior.
      [...container.children].forEach((filho, i) => {
        if (filho.classList.contains("revelar")) return;
        filho.classList.add("revelar");
        filho.style.setProperty(
          "--revelar-atraso",
          `${Math.min(i * ESCALONAMENTO, ATRASO_MAXIMO)}ms`,
        );
        alvos.push(filho);
      });
    }
  }

  if (!alvos.length) return;

  const mostrar = (el) => el.classList.add("revelar--visivel");

  const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (semMovimento || !("IntersectionObserver" in window)) {
    alvos.forEach(mostrar);
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        mostrar(entrada.target);
        observador.unobserve(entrada.target); // revela uma vez só, não a cada passagem
      }
    },
    {
      // Começa um pouco antes de encostar na borda de baixo, para o movimento
      // terminar enquanto o bloco ainda está subindo.
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.05,
    },
  );

  alvos.forEach((el) => observador.observe(el));
}
