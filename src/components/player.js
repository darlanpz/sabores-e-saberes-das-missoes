/**
 * Comportamento do player de audiodescrição.
 *
 * A fonte da verdade é sempre o elemento <audio> — a UI reage aos eventos dele
 * (`play`, `pause`, `ended`, `timeupdate`), nunca ao clique diretamente. Isso
 * mantém a interface correta mesmo quando o navegador pausa por conta própria
 * (perda de foco, política de autoplay, outro áudio assumindo a saída).
 *
 * Regras de habilitação, conforme o style guide:
 * - Parar   → só enquanto está tocando.
 * - Repetir → enquanto está tocando ou depois de terminar (senão o áudio
 *             terminado viraria um beco sem saída).
 */

/** Formata segundos como m:ss. */
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.floor(seconds);
  const min = Math.floor(total / 60);
  const sec = String(total % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

/** Lê o tempo em voz alta para leitores de tela: "1 minuto e 12 segundos". */
function spellTime(seconds) {
  if (!Number.isFinite(seconds)) return "0 segundos";
  const total = Math.floor(seconds);
  const min = Math.floor(total / 60);
  const sec = total % 60;
  const partes = [];
  if (min) partes.push(`${min} ${min === 1 ? "minuto" : "minutos"}`);
  if (sec || !min) partes.push(`${sec} ${sec === 1 ? "segundo" : "segundos"}`);
  return partes.join(" e ");
}

export function initPlayer(root) {
  const audio = root.querySelector("[data-player-audio]");
  const toggle = root.querySelector("[data-player-toggle]");
  const range = root.querySelector("[data-player-range]");
  const time = root.querySelector("[data-player-time]");
  const stop = root.querySelector("[data-player-stop]");
  const restart = root.querySelector("[data-player-restart]");

  if (!audio || !toggle || !range || !stop || !restart) return;

  const label = toggle.getAttribute("aria-label").replace(/^Reproduzir /, "");

  // Enquanto o usuário arrasta, o timeupdate não pode reescrever a posição.
  let scrubbing = false;

  function render() {
    const { duration, currentTime, paused, ended } = audio;
    const pct = duration ? (currentTime / duration) * 100 : 0;

    if (!scrubbing) range.value = String(pct);
    range.style.setProperty("--played", `${pct}%`);
    range.setAttribute(
      "aria-valuetext",
      `${spellTime(currentTime)} de ${spellTime(duration)}`,
    );

    if (time) time.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;

    const playing = !paused && !ended;
    root.dataset.playing = String(playing);

    toggle.setAttribute("aria-label", `${playing ? "Pausar" : "Reproduzir"} ${label}`);
    toggle.dataset.tooltip = playing ? "Pausar" : "Reproduzir";

    // Parar só faz sentido tocando; repetir também depois que terminou.
    stop.disabled = !playing;
    restart.disabled = !playing && !ended;
  }

  function seekFromRange() {
    if (!audio.duration) return;
    const pct = Number(range.value);
    audio.currentTime = (pct / 100) * audio.duration;
    range.style.setProperty("--played", `${pct}%`);
  }

  toggle.addEventListener("click", () => {
    if (audio.paused) audio.play();
    else audio.pause();
  });

  stop.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
    render();
  });

  restart.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play();
  });

  range.addEventListener("input", () => {
    scrubbing = true;
    seekFromRange();
  });

  range.addEventListener("change", () => {
    scrubbing = false;
    seekFromRange();
    render();
  });

  // A UI segue o <audio>, não o clique.
  for (const evento of ["play", "pause", "ended", "timeupdate", "loadedmetadata", "durationchange"]) {
    audio.addEventListener(evento, render);
  }

  render();
}

/** Inicializa todos os players da página. */
export function initPlayers(scope = document) {
  scope.querySelectorAll("[data-player]").forEach(initPlayer);
}
