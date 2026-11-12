/**
 * Мобильное меню: открытие по «бургеру», закрытие по Escape, по ссылке
 * или по логотипу. Пока меню открыто, фокус с клавиатуры ходит по кругу
 * внутри него, а страница под ним не прокручивается.
 * На ширине от 768 px меню всегда в шапке, и открытое состояние сбрасывается.
 */

const DESKTOP_QUERY = '(min-width: 768px)';
const FOCUS_DELAY_MS = 120; // ждём начала анимации панели, иначе фокус «прыгает»

/**
 * @param {{
 *   pageElement: HTMLElement,
 *   navigationElement: HTMLElement,
 *   menuButton: HTMLButtonElement,
 *   logoLink: HTMLElement | null,
 *   languageSwitchButton: HTMLElement | null,
 *   translate: (key: string) => string
 * }} options
 * @returns {{ refreshLanguage: () => void }}
 */
export function initSiteMenu({ pageElement, navigationElement, menuButton, logoLink, languageSwitchButton, translate }) {
  const desktopQuery = window.matchMedia(DESKTOP_QUERY);
  let isOpen = false;

  function updateButtonLabel() {
    menuButton.setAttribute('aria-label', translate(isOpen ? 'menu.close' : 'menu.open'));
  }

  /**
   * @param {boolean} shouldOpen Открыть или закрыть меню.
   * @param {{ returnFocus?: boolean }} [options] Вернуть фокус на кнопку после закрытия.
   */
  function setMenuOpen(shouldOpen, { returnFocus = false } = {}) {
    isOpen = shouldOpen;
    navigationElement.classList.toggle('site-nav--open', isOpen);
    menuButton.classList.toggle('menu-button--open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    pageElement.classList.toggle('page--menu-open', isOpen);
    updateButtonLabel();

    if (isOpen) {
      window.setTimeout(() => navigationElement.querySelector('a')?.focus(), FOCUS_DELAY_MS);
    } else if (returnFocus) {
      menuButton.focus();
    }
  }

  /** Элементы, по которым ходит Tab, пока меню открыто. */
  function getFocusableElements() {
    return [...navigationElement.querySelectorAll('a[href]'), languageSwitchButton, menuButton]
      .filter((element) => element && !element.hidden);
  }

  /**
   * @param {KeyboardEvent} event
   */
  function handleKeydown(event) {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false, { returnFocus: true });
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  menuButton.addEventListener('click', () => setMenuOpen(!isOpen));

  navigationElement.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  logoLink?.addEventListener('click', () => {
    if (isOpen) setMenuOpen(false);
  });

  document.addEventListener('keydown', handleKeydown);

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenuOpen(false);
  });

  setMenuOpen(false);

  return { refreshLanguage: updateButtonLabel };
}
