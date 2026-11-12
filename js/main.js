/**
 * Точка входа сайта: находит элементы страницы и подключает к ним модули.
 *
 * Каждый модуль отвечает за один блок и ничего не знает о других. Связи
 * между ними — только здесь: например, субтитры отдают голове уровень «речи»,
 * а смена языка обновляет подписи во всех модулях.
 */
import { createTranslator } from './i18n/translator.js';
import { CAPTION_PHRASES } from './data/caption-phrases.js';
import { createParticlePortrait } from './modules/particle-portrait.js';
import { initPortraitCaptions } from './modules/portrait-captions.js';
import { initLanguageSwitch } from './modules/language-switch.js';
import { initSiteMenu } from './modules/site-menu.js';
import { initRevealOnScroll } from './modules/reveal-on-scroll.js';
import { initWorkDeck } from './modules/work-deck.js';
import { initCaseDialog } from './modules/case-dialog.js';
import { initPrivacyDialog } from './modules/privacy-dialog.js';
import { createToast } from './modules/toast.js';
import { initBriefForm } from './modules/brief-form.js';
import { initMobileCta } from './modules/mobile-cta.js';

const pageElement = document.body;
const translator = createTranslator();
const { translate } = translator;

const languageSwitch = initLanguageSwitch({
  buttonElement: document.querySelector('[data-language-switch]'),
  translator
});

const siteMenu = initSiteMenu({
  pageElement,
  navigationElement: document.querySelector('[data-site-nav]'),
  menuButton: document.querySelector('[data-menu-button]'),
  logoLink: document.querySelector('[data-logo]'),
  languageSwitchButton: document.querySelector('[data-language-switch]'),
  translate
});

const portraitCaptions = initPortraitCaptions({
  rootElement: document.querySelector('[data-captions]'),
  phrasesByLanguage: CAPTION_PHRASES,
  language: translator.language,
  translate
});

createParticlePortrait({
  portraitElement: document.querySelector('[data-portrait]'),
  posterElement: document.querySelector('[data-portrait-poster]'),
  getSpeechLevel: () => portraitCaptions?.getSpeechLevel() ?? 0
});

initRevealOnScroll({ pageElement });

initWorkDeck({ showcaseElement: document.querySelector('[data-showcase]') });

const caseDialog = initCaseDialog({
  dialogElement: document.querySelector('[data-case-dialog]'),
  contentElement: document.querySelector('[data-case-content]'),
  closeButton: document.querySelector('[data-case-close]'),
  translator
});

initPrivacyDialog({
  dialogElement: document.querySelector('[data-privacy-dialog]'),
  closeButton: document.querySelector('[data-privacy-close]')
});

const toast = createToast({
  toastElement: document.querySelector('[data-toast]'),
  translate
});

const briefForm = initBriefForm({
  formElement: document.querySelector('[data-brief-form]'),
  statusElement: document.querySelector('[data-form-status]'),
  telegramButton: document.querySelector('[data-telegram-button]'),
  translate,
  toast
});

initMobileCta({
  buttonElement: document.querySelector('[data-mobile-cta]'),
  hidingSections: [document.querySelector('#contact'), document.querySelector('[data-site-footer]')]
});

document.querySelector('[data-current-year]').textContent = String(new Date().getFullYear());

translator.onChange((language) => {
  languageSwitch.refresh();
  siteMenu.refreshLanguage();
  portraitCaptions?.setLanguage(language);
  caseDialog.refreshLanguage();
  briefForm.refreshLanguage();
  toast.refreshLanguage();
});
