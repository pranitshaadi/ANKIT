/**
 * Application entry point.
 */

import { initDateReveal } from './components/ui/Countdown.js';
import { initMusicPlayer } from './components/ui/MusicPlayer.js?v=3';
import { initEventCards } from './components/sections/Events.js';
import { initNavigation } from './components/layout/Navigation.js';
import { initScrollAnimations } from './utils/animation.js';
import { initSmoothScroll } from './utils/scroll.js';
import { getConfig } from './utils/config-loader.js';

function initOptimizedImages() {
  const imageVariants = [
    ['assets/grand_palace_night_potrait.png', 'assets/grand_palace_night_potrait.jpg'],
    ...['Image-1', 'Image-2', 'Image-3', 'Image-4', 'Image-5'].map(name => [
      `assets/images/couple/${name}.jpeg`,
      `assets/images/couple/${name}-optimized.jpeg`
    ])
  ];

  const updateImage = image => {
    imageVariants.forEach(([original, optimized]) => {
      ['src', 'srcset'].forEach(attribute => {
        const value = image.getAttribute(attribute);
        if (value?.includes(original)) image.setAttribute(attribute, value.replaceAll(original, optimized));
      });
    });
  };

  const scan = node => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('img')) updateImage(node);
    node.querySelectorAll('img').forEach(updateImage);
  };

  scan(document.documentElement);
  new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'attributes') updateImage(record.target);
      record.addedNodes.forEach(scan);
    });
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['src', 'srcset'],
    childList: true,
    subtree: true
  });
}

function initEventFieldOverrides(events) {
  if (!events?.length) return;
  const byName = Object.fromEntries(events.map(e => [e.event, e]));
  const inject = () => {
    document.querySelectorAll('.framer-eqI5A').forEach(card => {
      const nameEl = card.querySelector('.framer-d9o4fp');
      if (!nameEl) return;
      const ev = byName[nameEl.textContent.trim()];
      if (!ev) return;
      [[ '.framer-inj5oz', ev.date ], [ '.framer-1lwecf7', ev.venue ], [ '.framer-g4ggot', ev.time ]]
        .forEach(([sel, val]) => {
          const el = card.querySelector(sel);
          if (!el) return;
          const target = el.querySelector('p') ?? el;
          if (target.textContent.trim() !== val) target.textContent = val;
        });
    });
  };
  inject();
  new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
}

function initRepurposedCards() {
  // Framer JS hardcodes these event names in the .mjs bundle — override all mismatches
  const cards = [
    { sel: '.framer-1xxttys-container', name: 'Mehendi' },
    { sel: '.framer-y390rh-container',  name: 'Mangana Handi' },
    { sel: '.framer-v371mv-container',  name: 'Sangeet' },
    { sel: '.framer-8j9rab-container',  name: 'Reception' },
  ];
  const inject = () => {
    cards.forEach(({ sel, name }) => {
      const container = document.querySelector(sel);
      if (!container) return;
      const nameEl = container.querySelector('.framer-d9o4fp');
      if (!nameEl) return;
      const target = nameEl.querySelector('p') ?? nameEl;
      if (target.textContent.trim() !== name) target.textContent = name;
    });
  };
  inject();
  new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
}

function initMapsCtaLink(url) {
  if (!url) return;
  const inject = () => {
    const container = document.querySelector('.framer-gug0pj-container');
    if (!container) return;
    const anchor = container.querySelector('a');
    if (anchor && anchor.href !== url) anchor.href = url;
  };
  inject();
  new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
}

function initPresenceText() {
  const inject = () => {
    const section = document.querySelector('.framer-1rq20ml');
    if (!section || section.querySelector('.ttk-presence-text')) return;
    const el = document.createElement('p');
    el.className = 'ttk-presence-text';
    el.textContent = 'Awaiting your presence - Sasmal Family';
    section.appendChild(el);
  };
  inject();
  new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
}

function initCoupleNameDisplay(name1Display, name2Display, name1Hero, name2Hero) {
  const setDeepText = (container, sel, val) => {
    const wrapper = container.querySelector(sel);
    if (!wrapper) return;
    // Framer renders: wrapper > p > h3 (or h2) with inline styles — target the deepest element
    const target = wrapper.querySelector('h3, h2') ?? wrapper.querySelector('p') ?? wrapper;
    if (target.textContent.trim() !== val) target.textContent = val;
  };
  const inject = () => {
    const hero = document.querySelector('.framer-1if6ejn-container');
    if (hero) {
      setDeepText(hero, '.framer-ti6z94', name1Hero);
      setDeepText(hero, '.framer-8cgar', name2Hero);
    }
    const invite = document.querySelector('.framer-igjlsv-container');
    if (invite) {
      setDeepText(invite, '.framer-11ag0sw', name1Display);
      setDeepText(invite, '.framer-13k4cyv', name2Display);
    }
  };
  inject();
  new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
}

function initGroomAndBrideHeading() {
  const inject = () => {
    const el = document.querySelector('.framer-ewzo4f');
    if (!el) return;
    const target = el.querySelector('p') ?? el;
    if (target.textContent.trim() !== 'groom and bride') target.textContent = 'groom and bride';
  };
  inject();
  new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
}

function initCountdownHeading() {
  const inject = () => {
    const section = document.querySelector('.framer-jcebrp');
    if (!section || section.querySelector('.ttk-countdown-heading')) return;
    const el = document.createElement('p');
    el.className = 'framer-text ttk-countdown-heading';
    el.textContent = 'Countdown Begins...';
    section.appendChild(el);
  };
  inject();
  new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
}

function init() {
  const config = getConfig();

  initOptimizedImages();
  initSmoothScroll();
  initScrollAnimations();
  initNavigation();
  initCountdownHeading();
  initPresenceText();
  initGroomAndBrideHeading();
  initCoupleNameDisplay(
    config.name1Display ?? 'Ankit',
    config.name2Display ?? 'Priti',
    config.name1 ?? 'ANKIT',
    config.name2 ?? 'PRITI'
  );
  initRepurposedCards();
  if (config.mapsCtaLink) initMapsCtaLink(config.mapsCtaLink);
  else initMapsCtaLink('https://www.google.com/maps/place/Das+gadia+mini+stadium/@20.3843891,85.8560771,110m/data=!3m1!1e3!4m6!3m5!1s0x3a190d9d527b205b:0x90876bbc086aae85!8m2!3d20.3843891!4d85.8563757!16s%2Fg%2F11srtvzpml?entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D');
  if (config.events) initEventFieldOverrides(config.events);

  const countdownDate = config.countdownDate ?? '2026-12-06T06:00:00.000Z';
  initDateReveal(countdownDate, `${config.name1Display ?? 'Ankit'} & ${config.name2Display ?? 'Priti'}`);
  if (config.musicUrl) initMusicPlayer(config.musicUrl);
  if (config.eventCardBack) {
    initEventCards(
      config.eventCardBack,
      `${config.name1Display} & ${config.name2Display}`,
      config.eventHours ?? 3,
      config.events ?? []
    );
  }
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
