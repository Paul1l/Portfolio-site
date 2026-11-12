/**
 * Окно с кейсом работы. Открывается кнопкой «Подробнее» (data-case-open="slug").
 *
 * У открытого кейса свой адрес #case/<slug>: им можно поделиться, а кнопка
 * «назад» в браузере закрывает окно. Содержимое собирается из js/data/projects.js
 * на текущем языке.
 */
import { getProjectBySlug } from '../data/projects.js';

const CASE_HASH_PREFIX = '#case/';
const HASH_AFTER_CLOSE = 'work';

/**
 * Экранирует текст перед вставкой в HTML.
 *
 * @param {string} text Исходный текст.
 * @returns {string} Безопасная для innerHTML строка.
 */
function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

/**
 * Разметка ссылки-кнопки «Открыть сайт» / «Посмотреть код».
 *
 * @param {string} url Адрес.
 * @param {string} label Текст кнопки.
 * @param {'primary' | 'outline'} variant Модификатор блока button.
 * @returns {string} HTML ссылки.
 */
function createButtonLinkMarkup(url, label, variant) {
  return `
    <a class="button button--${variant}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
      ${escapeHtml(label)} <span aria-hidden="true">↗</span>
    </a>`;
}

/**
 * Собирает разметку кейса (блок case-study).
 *
 * @param {object} project Работа с текстами на нужном языке (см. getProjectBySlug).
 * @param {(key: string) => string} translate Перевод подписей.
 * @returns {string} HTML содержимого окна.
 */
function createCaseStudyMarkup(project, translate) {
  const websiteLink = project.websiteUrl
    ? createButtonLinkMarkup(project.websiteUrl, translate('caseStudy.openWebsite'), 'primary')
    : '';
  const codeLink = project.codeUrl
    ? createButtonLinkMarkup(project.codeUrl, translate('caseStudy.openCode'), 'outline')
    : '';
  const stackTags = project.stack
    .map((technology) => `<span class="case-study__tag">${escapeHtml(technology)}</span>`)
    .join('');

  const details = [
    { label: translate('caseStudy.challenge'), text: project.challenge },
    { label: translate('caseStudy.solution'), text: project.solution },
    { label: translate('caseStudy.result'), text: project.result }
  ];
  const detailsMarkup = details.map((detail) => `
    <article class="case-study__detail">
      <span class="case-study__detail-label">${escapeHtml(detail.label)}</span>
      <p class="case-study__detail-text">${escapeHtml(detail.text)}</p>
    </article>`).join('');

  return `
    <div class="case-study">
      <div class="case-study__header">
        <div class="case-study__intro">
          <p class="case-study__eyebrow">${escapeHtml(project.type)} · ${escapeHtml(project.year)}</p>
          <h2 class="case-study__title" id="case-title">${escapeHtml(project.title)}</h2>
          <p class="case-study__summary">${escapeHtml(project.summary)}</p>
        </div>
        <div class="case-study__picture">
          <img class="case-study__image" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt)}" width="1600" height="1000">
        </div>
      </div>

      <div class="case-study__details">${detailsMarkup}</div>

      <div class="case-study__footer">
        <div>
          <p class="case-study__role-label">${escapeHtml(translate('caseStudy.role'))}</p>
          <strong class="case-study__role">${escapeHtml(project.role)}</strong>
        </div>
        <div class="case-study__tags">${stackTags}</div>
        <div class="case-study__actions">${websiteLink}${codeLink}</div>
      </div>
    </div>`;
}

/**
 * @param {{
 *   dialogElement: HTMLDialogElement,
 *   contentElement: HTMLElement,
 *   closeButton: HTMLButtonElement,
 *   translator: { language: string, translate: (key: string) => string, syncWithAddress: () => void }
 * }} options
 * @returns {{ refreshLanguage: () => void }}
 */
export function initCaseDialog({ dialogElement, contentElement, closeButton, translator }) {
  /**
   * @param {string} slug Идентификатор работы.
   * @param {{ updateAddress?: boolean }} [options] Записать ли #case/<slug> в историю браузера.
   */
  function openCase(slug, { updateAddress = true } = {}) {
    const project = getProjectBySlug(slug, translator.language);
    if (!project) return;

    contentElement.innerHTML = createCaseStudyMarkup(project, translator.translate);
    if (!dialogElement.open) dialogElement.showModal();

    const caseHash = `${CASE_HASH_PREFIX}${encodeURIComponent(slug)}`;
    if (updateAddress && window.location.hash !== caseHash) {
      const caseUrl = new URL(window.location.href);
      caseUrl.hash = caseHash;
      window.history.pushState({ caseSlug: slug }, '', caseUrl.href);
    }
  }

  /**
   * @param {{ updateAddress?: boolean }} [options] Убрать ли #case/<slug> из адреса.
   */
  function closeCase({ updateAddress = true } = {}) {
    if (dialogElement.open) dialogElement.close();

    if (updateAddress && window.location.hash.startsWith(CASE_HASH_PREFIX)) {
      const pageUrl = new URL(window.location.href);
      pageUrl.hash = HASH_AFTER_CLOSE;
      window.history.replaceState(null, '', pageUrl.href);
    }
  }

  /** Открывает или закрывает окно в соответствии с текущим адресом. */
  function syncWithAddress() {
    const { hash } = window.location;

    if (hash.startsWith(CASE_HASH_PREFIX)) {
      openCase(decodeURIComponent(hash.slice(CASE_HASH_PREFIX.length)), { updateAddress: false });
    } else {
      closeCase({ updateAddress: false });
    }
  }

  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-case-open]');
    if (openButton) openCase(openButton.dataset.caseOpen);
  });

  closeButton.addEventListener('click', () => closeCase());

  // Клик по затемнённому фону вокруг окна.
  dialogElement.addEventListener('click', (event) => {
    if (event.target === dialogElement) closeCase();
  });

  // Escape: закрываем сами, чтобы заодно поправить адрес.
  dialogElement.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeCase();
  });

  window.addEventListener('popstate', () => {
    translator.syncWithAddress();
    syncWithAddress();
  });

  syncWithAddress();

  return {
    refreshLanguage() {
      if (dialogElement.open && window.location.hash.startsWith(CASE_HASH_PREFIX)) syncWithAddress();
    }
  };
}
