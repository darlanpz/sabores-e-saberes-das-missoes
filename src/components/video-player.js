/**
 * Comportamento do player de vídeo.
 *
 * Mesma regra do player de áudio: a fonte da verdade é o elemento <video> e a
 * UI reage aos eventos dele, nunca ao clique. Os controles nativos ficam
 * desligados — a barra é a do design system.
 *
 * A barra aparece quando o vídeo começa e some sozinha depois de um tempo
 * parado, voltando a qualquer movimento do ponteiro, foco ou toque.
 */

const OCIOSO_MS = 2500;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.floor(seconds);
  const min = Math.floor(total / 60);
  const sec = String(total % 60).padStart(2, "0");
  return `${min}:${sec}`;
}

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

export function initVideo(root) {
  const media = root.querySelector("[data-video-media]");
  const frame = root.querySelector(".video__frame");
  const posterPlay = root.querySelector("[data-video-poster-play]");
  const toggle = root.querySelector("[data-video-toggle]");
  const range = root.querySelector("[data-video-range]");
  const time = root.querySelector("[data-video-time]");
  const mute = root.querySelector("[data-video-mute]");
  const fullscreen = root.querySelector("[data-video-fullscreen]");

  if (!media || !frame || !toggle || !range) return;

  const label = toggle.getAttribute("aria-label").replace(/^Reproduzir /, "");

  let scrubbing = false;
  let idleTimer;

  function render() {
    const { duration, currentTime, paused, ended, muted } = media;
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
    root.dataset.muted = String(muted);

    toggle.setAttribute("aria-label", `${playing ? "Pausar" : "Reproduzir"} ${label}`);
    toggle.dataset.tooltip = playing ? "Pausar" : "Reproduzir";

    if (mute) {
      mute.setAttribute("aria-label", muted ? "Ativar som" : "Desativar som");
      mute.dataset.tooltip = muted ? "Ativar som" : "Desativar som";
    }
  }

  /** Marca atividade e reprograma o sumiço da barra. */
  function acordar() {
    root.dataset.idle = "false";
    clearTimeout(idleTimer);
    // Só some enquanto está de fato tocando.
    if (root.dataset.playing === "true") {
      idleTimer = setTimeout(() => {
        root.dataset.idle = "true";
      }, OCIOSO_MS);
    }
  }

  function play() {
    root.dataset.started = "true";
    media.play();
  }

  function seekFromRange() {
    if (!media.duration) return;
    const pct = Number(range.value);
    media.currentTime = (pct / 100) * media.duration;
    range.style.setProperty("--played", `${pct}%`);
  }

  posterPlay?.addEventListener("click", play);

  toggle.addEventListener("click", () => {
    if (media.paused) play();
    else media.pause();
  });

  mute?.addEventListener("click", () => {
    media.muted = !media.muted;
    render();
  });

  fullscreen?.addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else frame.requestFullscreen?.();
  });

  range.addEventListener("input", () => {
    scrubbing = true;
    seekFromRange();
    acordar();
  });

  range.addEventListener("change", () => {
    scrubbing = false;
    seekFromRange();
    render();
  });

  for (const evento of ["play", "pause", "ended", "timeupdate", "loadedmetadata", "durationchange", "volumechange"]) {
    media.addEventListener(evento, () => {
      render();
      if (evento === "play" || evento === "pause" || evento === "ended") acordar();
    });
  }

  // Qualquer sinal de atividade traz a barra de volta.
  for (const evento of ["pointermove", "pointerdown", "focusin", "touchstart"]) {
    frame.addEventListener(evento, acordar, { passive: true });
  }

  frame.addEventListener("pointerleave", () => {
    if (root.dataset.playing === "true") root.dataset.idle = "true";
  });

  render();
  acordar();
}

/** Inicializa todos os players de vídeo da página. */
export function initVideos(scope = document) {
  scope.querySelectorAll("[data-video]").forEach(initVideo);
}
