/**
 * Background music player — one Audio object, play/pause button with icon swap.
 *
 * Why it's written this way:
 *  - The page has TWO copies of the button (desktop + phone SSR variants) and Framer
 *    re-renders them on hydration, so a listener bound to one element at startup ends
 *    up on a node the visitor never taps. One delegated listener on the document
 *    works for whichever copy is on screen.
 *  - The icon follows the audio's real state (play/pause events), so it can't drift.
 *  - The mp3 is only requested on the first tap.
 */

const BUTTON_SEL = '.framer-2fmrhl-container';
const PLAY_D =
  'M 5.379 1.292 C 4.968 1.033 4.449 1.017 4.023 1.251 C 3.598 1.486 3.334 1.933 3.333 2.419 L 3.333 13.581 C 3.334 14.067 3.598 14.514 4.023 14.749 C 4.449 14.983 4.968 14.967 5.379 14.708 L 14.215 9.127 C 14.602 8.883 14.836 8.457 14.836 8 C 14.836 7.543 14.602 7.117 14.215 6.873 Z';
const PAUSE_D = 'M 3.5 2 L 6.5 2 L 6.5 14 L 3.5 14 Z M 9.5 2 L 12.5 2 L 12.5 14 L 9.5 14 Z';

export function initMusicPlayer(src) {
  let audio = null;

  function setIcon(playing) {
    const d = playing ? PAUSE_D : PLAY_D;
    document.querySelectorAll(`${BUTTON_SEL} svg`).forEach(svg => {
      let path = svg.querySelector('path');
      if (!path) {
        path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill', '#333');
        svg.appendChild(path);
      }
      if (path.getAttribute('d') !== d) path.setAttribute('d', d);
      svg.setAttribute('aria-label', playing ? 'pause audio' : 'play audio');
    });
  }

  function getAudio() {
    if (!audio) {
      audio = new Audio();
      audio.loop = true;
      audio.volume = 0.4;
      audio.addEventListener('play', () => setIcon(true));
      audio.addEventListener('pause', () => setIcon(false));
      audio.src = src; // the file is requested here, once, on first tap
    }
    return audio;
  }

  // One delegated listener, capture phase: runs before Framer's own handlers.
  document.addEventListener('click', e => {
    if (!e.target.closest || !e.target.closest(BUTTON_SEL)) return;
    e.stopPropagation();
    const a = getAudio();
    if (a.paused) a.play().catch(() => setIcon(false));
    else a.pause();
  }, true);

  // Safety net: if any other media element (e.g. Framer's) starts, stop it.
  document.addEventListener('play', e => {
    if (e.target !== audio && e.target instanceof HTMLMediaElement) e.target.pause();
  }, true);

  // Framer re-renders the button when the viewport breakpoint changes.
  let t;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => { if (audio) setIcon(!audio.paused); }, 200);
  });
}