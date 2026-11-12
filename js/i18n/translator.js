/**
 * Переводчик сайта: русский ↔ английский.
 *
 * Русский текст — это обычная разметка index.html. Элементы, которые нужно
 * переводить, помечены атрибутом с ключом словаря:
 *   data-i18n="hero.lead"          → меняется textContent;
 *   data-i18n-html="hero.worksLink" → меняется innerHTML (строки со стрелкой ↗);
 *   data-i18n-content / -aria / -alt / -placeholder / -value → одноимённый атрибут.
 *
 * Переводчик один раз запоминает русский оригинал каждого элемента. При
 * переходе на английский подставляет строку из js/i18n/english.js, при
 * возврате — оригинал. Язык хранится в адресе (?lang=en) и в localStorage.
 */
import { ENGLISH_DICTIONARY } from './english.js';
import { MESSAGES } from './messages.js';
import { createStructuredDataTranslator } from './structured-data.js';

const SUPPORTED_LANGUAGES = ['ru', 'en'];
const DEFAULT_LANGUAGE = 'ru';
const STORAGE_KEY = 'portfolio-language';

/** Какие атрибуты разметки что переводят. */
const TRANSLATION_TARGETS = [
  { selector: '[data-i18n]', datasetKey: 'i18n', property: 'textContent' },
  { selector: '[data-i18n-html]', datasetKey: 'i18nHtml', property: 'innerHTML' },
  { selector: '[data-i18n-content]', datasetKey: 'i18nContent', attribute: 'content' },
  { selector: '[data-i18n-aria]', datasetKey: 'i18nAria', attribute: 'aria-label' },
  { selector: '[data-i18n-alt]', datasetKey: 'i18nAlt', attribute: 'alt' },
  { selector: '[data-i18n-placeholder]', datasetKey: 'i18nPlaceholder', attribute: 'placeholder' },
  { selector: '[data-i18n-value]', datasetKey: 'i18nValue', attribute: 'value' }
];

/**
 * Достаёт значение из вложенного объекта по пути вида «form.sending».
 *
 * @param {object} source Объект со строками.
 * @param {string} path Путь через точку.
 * @returns {string | undefined} Найденная строка.
 */
function getValueByPath(source, path) {
  return path.split('.').reduce((value, key) => value?.[key], source);
}

/**
 * @param {string | null} language Код языка из адреса или хранилища.
 * @returns {boolean} Поддерживает ли сайт этот язык.
 */
function isSupportedLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language);
}

/**
 * Язык при загрузке: сначала адрес (?lang=en), потом выбор из прошлого визита.
 *
 * @returns {string} Код языка.
 */
function detectInitialLanguage() {
  const currentUrl = new URL(window.location.href);

  if (currentUrl.searchParams.has('lang')) {
    const requestedLanguage = currentUrl.searchParams.get('lang');
    return isSupportedLanguage(requestedLanguage) ? requestedLanguage : DEFAULT_LANGUAGE;
  }

  try {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(savedLanguage)) return savedLanguage;
  } catch {
    // Хранилище может быть запрещено — тогда просто берём язык по умолчанию.
  }

  return DEFAULT_LANGUAGE;
}

/**
 * @param {string} language Код языка.
 */
function saveLanguage(language) {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Без хранилища язык всё равно переключится, просто не запомнится.
  }
}

/**
 * Записывает язык в адрес страницы без перезагрузки: ?lang=en или без параметра.
 *
 * @param {string} language Код языка.
 */
function writeLanguageToAddress(language) {
  const currentUrl = new URL(window.location.href);

  if (language === DEFAULT_LANGUAGE) currentUrl.searchParams.delete('lang');
  else currentUrl.searchParams.set('lang', language);

  try {
    window.history.replaceState(window.history.state, '', currentUrl.href);
  } catch {
    // Некоторые локальные предпросмотры не разрешают менять адрес — не страшно.
  }
}

/**
 * Собирает список всех переводимых элементов вместе с их русским оригиналом.
 *
 * @returns {Array<{element: Element, key: string, property?: string, attribute?: string, originalText: string}>}
 */
function collectTranslatableElements() {
  const records = [];

  TRANSLATION_TARGETS.forEach((target) => {
    document.querySelectorAll(target.selector).forEach((element) => {
      records.push({
        element,
        key: element.dataset[target.datasetKey],
        property: target.property,
        attribute: target.attribute,
        originalText: target.attribute ? element.getAttribute(target.attribute) : element[target.property]
      });
    });
  });

  return records;
}

/**
 * Создаёт переводчик и сразу применяет язык, выбранный при загрузке.
 *
 * @returns {{
 *   readonly language: string,
 *   translate: (key: string) => string,
 *   setLanguage: (language: string) => void,
 *   syncWithAddress: () => void,
 *   onChange: (listener: (language: string) => void) => () => void
 * }}
 */
export function createTranslator() {
  const translatableElements = collectTranslatableElements();
  const translateStructuredData = createStructuredDataTranslator();
  const changeListeners = new Set();
  let currentLanguage = detectInitialLanguage();

  /**
   * Строка для скриптов: сначала сообщения (оба языка), затем словарь разметки.
   *
   * @param {string} key Ключ вида «form.sending».
   * @returns {string} Перевод или сам ключ, если строки нет.
   */
  function translate(key) {
    const message = getValueByPath(MESSAGES[currentLanguage], key);
    if (message !== undefined) return message;

    const markupText = currentLanguage === 'en' ? getValueByPath(ENGLISH_DICTIONARY, key) : undefined;
    return markupText ?? key;
  }

  /**
   * @param {string} language Код языка.
   */
  function translateMarkup(language) {
    translatableElements.forEach((record) => {
      const text = language === 'en' ? getValueByPath(ENGLISH_DICTIONARY, record.key) : record.originalText;
      if (text === undefined) return;

      if (record.attribute) record.element.setAttribute(record.attribute, text);
      else record.element[record.property] = text;
    });
  }

  /**
   * Переключает язык всей страницы.
   *
   * @param {string} language Код языка.
   * @param {{ saveChoice?: boolean, updateAddress?: boolean, notifyListeners?: boolean }} [options]
   */
  function applyLanguage(language, options = {}) {
    const { saveChoice = true, updateAddress = true, notifyListeners = true } = options;
    const nextLanguage = isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE;

    currentLanguage = nextLanguage;
    document.documentElement.lang = nextLanguage;
    translateMarkup(nextLanguage);
    translateStructuredData(nextLanguage);

    if (saveChoice) saveLanguage(nextLanguage);
    if (updateAddress) writeLanguageToAddress(nextLanguage);
    if (notifyListeners) changeListeners.forEach((listener) => listener(nextLanguage));
  }

  applyLanguage(currentLanguage, { notifyListeners: false });

  return {
    get language() {
      return currentLanguage;
    },
    translate,
    setLanguage: (language) => applyLanguage(language),
    /** Язык мог смениться кнопками «назад/вперёд» браузера — догоняем адрес. */
    syncWithAddress() {
      const addressLanguage = new URL(window.location.href).searchParams.get('lang') === 'en' ? 'en' : DEFAULT_LANGUAGE;
      if (addressLanguage !== currentLanguage) applyLanguage(addressLanguage, { updateAddress: false });
    },
    onChange(listener) {
      changeListeners.add(listener);
      return () => changeListeners.delete(listener);
    }
  };
}
