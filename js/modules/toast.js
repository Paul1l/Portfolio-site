/**
 * Короткое уведомление внизу экрана («Отправлено.», «Текст скопирован…»).
 * Само исчезает через несколько секунд. При смене языка видимое уведомление
 * переводится на новый язык.
 */

const VISIBLE_DURATION_MS = 4200;

/**
 * @param {{ toastElement: HTMLElement, translate: (key: string) => string }} options
 * @returns {{ show: (messageKey: string) => void, refreshLanguage: () => void }}
 */
export function createToast({ toastElement, translate }) {
  let hideTimerId = 0;
  let visibleMessageKey = '';

  function hide() {
    toastElement.classList.remove('toast--visible');
    visibleMessageKey = '';
  }

  /**
   * @param {string} messageKey Ключ сообщения из js/i18n/messages.js.
   */
  function show(messageKey) {
    window.clearTimeout(hideTimerId);
    visibleMessageKey = messageKey;
    toastElement.textContent = translate(messageKey);
    toastElement.classList.add('toast--visible');
    hideTimerId = window.setTimeout(hide, VISIBLE_DURATION_MS);
  }

  function refreshLanguage() {
    if (visibleMessageKey) toastElement.textContent = translate(visibleMessageKey);
  }

  return { show, refreshLanguage };
}
