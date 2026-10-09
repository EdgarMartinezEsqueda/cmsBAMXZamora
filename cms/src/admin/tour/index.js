import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './tour.css';
import { CONTENT_STEPS, EDIT_STEPS, GENERAL_STEPS, TOUR_VERSION } from './steps.mjs';

// Recorrido guiado del panel (driver.js). Los pasos están en ./steps.mjs.
// - Arranca solo una vez por usuaria (no al Super Admin): el general al entrar, el de edición la
//   primera vez que abre un contenido. Se recuerda en este navegador.
// - El botón "?" de abajo a la derecha lo vuelve a mostrar a cualquiera.
// Depende del HTML del panel de Strapi: si un elemento no aparece, el paso se centra o se salta.

const ADMIN_BASE = '/gestion-bamx';
const seenKey = (kind, userId) => `bamx-tour-${TOUR_VERSION}:${kind}:${userId}`;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const storage = {
  get(key) { try { return window.localStorage.getItem(key); } catch { return null; } },
  set(key) { try { window.localStorage.setItem(key, '1'); } catch { /* sin almacenamiento: se verá otra vez */ } },
};

const visibleText = (element) => (element.innerText || element.textContent || '').replace(/\s+/g, ' ').trim();

/** Elemento del panel para un `find` de steps.mjs, o undefined (paso centrado). */
function locate(find) {
  if (!find) return undefined;
  if (find.type === 'link') {
    const links = [...document.querySelectorAll('a[href]')];
    const path = (link) => link.getAttribute('href').split('?')[0];
    // Primero la coincidencia exacta (el enlace del menú), luego la que lo contiene.
    return links.find((link) => path(link).endsWith(find.fragment)) ?? links.find((link) => path(link).includes(find.fragment));
  }
  if (find.type === 'button') {
    return [...document.querySelectorAll('button, a[role="button"], a[href]')]
      .find((element) => visibleText(element).startsWith(find.label) && element.offsetParent !== null);
  }
  if (find.type === 'profile') {
    const nav = document.querySelector('nav');
    const triggers = nav ? [...nav.querySelectorAll('button[aria-haspopup]')] : [];
    return triggers[triggers.length - 1];
  }
  return undefined;
}

/** Espera hasta `timeout` ms a que aparezca un elemento. */
async function waitFor(find, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const element = locate(find);
    if (element) return element;
    await wait(150);
  }
  return undefined;
}

/** Pasos para driver.js: los opcionales cuyo elemento no existe se quitan. */
function toDriverSteps(steps) {
  return steps
    .filter((step) => !step.optional || locate(step.find))
    .map((step) => ({
      element: step.find ? () => locate(step.find) : undefined,
      popover: { title: step.title, description: step.text },
    }));
}

function run(steps, { onDone } = {}) {
  const driverSteps = toDriverSteps(steps);
  if (driverSteps.length === 0) return;
  // Terminó (pulsó "Siguiente"/"Listo" en el último paso) o lo cerró con la X / Esc.
  let finished = false;
  const last = driverSteps[driverSteps.length - 1];
  last.popover.onNextClick = () => { finished = true; tour.destroy(); };
  const tour = driver({
    steps: driverSteps,
    showProgress: true,
    progressText: '{{current}} de {{total}}',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: onDone ? 'Siguiente' : 'Listo',
    popoverClass: 'bamx-tour',
    overlayColor: '#1f2937',
    smoothScroll: true,
    allowClose: true,
    onDestroyed: () => {
      if (finished && onDone) onDone();
    },
  });
  tour.drive();
}

/** Recorrido general: menú lateral y, si sigue, el Administrador de contenido. */
async function startGeneral() {
  const firstPart = GENERAL_STEPS.filter((step) => !step.opensContentManager);
  const opener = GENERAL_STEPS.find((step) => step.opensContentManager);
  run([...firstPart, opener], {
    onDone: async () => {
      const link = locate({ type: 'link', fragment: '/content-manager' });
      if (link) link.click();
      // Espera a que aparezca el menú del Administrador de contenido.
      await waitFor({ type: 'link', fragment: '/api::' }, 6000);
      await wait(300);
      run(CONTENT_STEPS);
    },
  });
}

function startEdit() {
  run(EDIT_STEPS);
}

/** Pantalla de edición: hay un botón "Publicar" o "Guardar" visible. */
const isEditView = () => Boolean(locate({ type: 'button', label: 'Publicar' }) || locate({ type: 'button', label: 'Guardar' }));

function addHelpButton() {
  if (document.getElementById('bamx-tour-help')) return;
  const button = document.createElement('button');
  button.id = 'bamx-tour-help';
  button.type = 'button';
  button.textContent = '?';
  button.title = 'Ver recorrido';
  button.setAttribute('aria-label', 'Ver recorrido guiado del panel');
  button.addEventListener('click', () => (isEditView() ? startEdit() : startGeneral()));
  document.body.appendChild(button);
}

/** Arranque automático (una sola vez por usuaria, nunca al Super Admin). */
async function autoStart() {
  const user = window.__bamxAdminUser;
  if (!user || user.isSuperAdmin || !window.location.pathname.startsWith(ADMIN_BASE)) return;
  if (document.querySelector('.driver-active')) return;
  // El panel tarda en pintar: se espera al menú lateral.
  await waitFor({ type: 'link', fragment: '/content-manager' }, 8000);
  await wait(400);
  if (isEditView()) {
    const key = seenKey('edit', user.id);
    if (!storage.get(key)) { storage.set(key); startEdit(); }
    return;
  }
  const key = seenKey('general', user.id);
  if (!storage.get(key)) { storage.set(key); startGeneral(); }
}

export function setupTour() {
  if (typeof window === 'undefined' || window.__bamxTour) return;
  window.__bamxTour = true;
  // El botón "?" solo con sesión iniciada (no en la pantalla de acceso).
  const refresh = () => {
    if (window.__bamxAdminUser) addHelpButton();
    else document.getElementById('bamx-tour-help')?.remove();
    autoStart();
  };
  window.addEventListener('bamx:admin-user', refresh);
  // Cambios de pantalla dentro del panel (p. ej. al abrir un contenido para editar).
  let last = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== last) {
      last = window.location.pathname;
      if (window.__bamxAdminUser) autoStart();
    }
  }, 700);
  refresh();
}
