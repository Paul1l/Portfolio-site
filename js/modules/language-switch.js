/**
 * Кнопка «RU / EN» в шапке. Без JavaScript переключать нечего, поэтому
 * в разметке она скрыта атрибутом hidden и появляется только здесь.
 */

/**
 * @param {{
 *   buttonElement: HTMLButtonElement,
 *   translator: { language: string, setLanguage: (language: string) => void, translate: (key: string) => string }
 * }} options
 * @returns {{ refresh: () => void }}
 */
export function initLanguageSwitch({ buttonElement, translator }) {
  const currentLabel = buttonElement.querySelector('[data-language-current]');
  const nextLabel = buttonElement.querySelector('[data-language-next]');

  function refresh() {
    const isEnglish = translator.language === 'en';
    const actionLabel = translator.translate(isEnglish ? 'languageSwitch.toRussian' : 'languageSwitch.toEnglish');

    currentLabel.textContent = isEnglish ? 'EN' : 'RU';
    nextLabel.textContent = isEnglish ? 'RU' : 'EN';
    buttonElement.setAttribute('aria-label', actionLabel);
    buttonElement.setAttribute('title', actionLabel);
  }

  buttonElement.addEventListener('click', () => {
    translator.setLanguage(translator.language === 'ru' ? 'en' : 'ru');
  });

  buttonElement.hidden = false;
  refresh();

  return { refresh };
}
