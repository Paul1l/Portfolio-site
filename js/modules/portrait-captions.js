/**
 * Субтитры под головой — как автосубтитры в Reels или на YouTube.
 *
 * Фразы из js/data/caption-phrases.js набираются по буквам, каждая держится
 * на экране пару секунд и гаснет перед следующей. Пока буквы набираются,
 * голова «говорит»: getSpeechLevel() отдаёт уровень открытия рта —
 * шире на гласных, уже на согласных, закрыт на пробелах и знаках.
 *
 * Показ идёт один раз. Кнопка под текстом ставит его на паузу, продолжает,
 * а в конце запускает заново. Вне экрана и в фоновой вкладке набор сам
 * встаёт на паузу и продолжается, когда субтитры снова видны.
 * При reduced motion фраза появляется целиком, без набора по буквам.
 *
 * Для скринридеров видимая строка скрыта (aria-hidden), а весь текст сразу
 * лежит в отдельном абзаце [data-captions-transcript].
 */

/** Ждём, пока голова соберётся из частиц, и только потом начинаем «говорить». */
const START_DELAY_MS = 1600;
/** Пауза между буквами. Около 16 букв в секунду — примерно темп живой речи. */
const CHARACTER_DELAY_MS = 60;
const SPACE_DELAY_MS = 40;
/** Короткая пауза после запятой, двоеточия или тире — как вдох. */
const PAUSE_MARK_DELAY_MS = 280;
/** Сколько набранная фраза держится на экране: основа плюс время на чтение. */
const PHRASE_HOLD_BASE_MS = 1700;
const PHRASE_HOLD_PER_CHARACTER_MS = 25;
/** Длительность затухания строки — та же, что у transition в captions.css. */
const FADE_DURATION_MS = 250;

/** Открытие рта (0…1) после буквы и сколько оно держится. */
const MOUTH_OPEN_VOWEL = 0.9;
const MOUTH_OPEN_CONSONANT = 0.4;
const MOUTH_OPEN_DURATION_MS = 110;

const VOWELS = new Set([...'аеёиоуыэюяaeiouy']);
const PAUSE_MARKS = new Set([',', ':', ';', '—', '–']);
const LETTER_PATTERN = /\p{L}/u;

/**
 * Этапы показа одной фразы:
 * typing — набираем буквы, holding — фраза целиком на экране,
 * fading — строка гаснет перед следующей, finished — все фразы показаны.
 */
const STAGE = Object.freeze({
  TYPING: 'typing',
  HOLDING: 'holding',
  FADING: 'fading',
  FINISHED: 'finished'
});

/** Какое действие выполнит кнопка и как она выглядит. */
const CONTROL_ACTION = Object.freeze({
  PAUSE: 'pause',
  PLAY: 'play',
  REPLAY: 'replay'
});

/**
 * @param {string} character Только что набранный символ.
 * @returns {number} Пауза перед следующим символом, мс.
 */
function getDelayAfterCharacter(character) {
  if (PAUSE_MARKS.has(character)) return PAUSE_MARK_DELAY_MS;
  if (character === ' ') return SPACE_DELAY_MS;
  return CHARACTER_DELAY_MS;
}

/**
 * @param {string} character Только что набранный символ.
 * @returns {number} Насколько открыт рот (0…1).
 */
function getMouthOpening(character) {
  const lowerCaseCharacter = character.toLowerCase();
  if (VOWELS.has(lowerCaseCharacter)) return MOUTH_OPEN_VOWEL;
  if (LETTER_PATTERN.test(character)) return MOUTH_OPEN_CONSONANT;
  return 0;
}

/**
 * @param {{
 *   rootElement: HTMLElement | null,
 *   phrasesByLanguage: Record<string, string[]>,
 *   language: string,
 *   translate: (key: string) => string
 * }} options
 * @returns {{ getSpeechLevel: () => number, setLanguage: (language: string) => void } | null}
 */
export function initPortraitCaptions({ rootElement, phrasesByLanguage, language, translate }) {
  if (!rootElement) return null;

  const lineElement = rootElement.querySelector('[data-captions-line]');
  const textElement = rootElement.querySelector('[data-captions-text]');
  const caretElement = rootElement.querySelector('[data-captions-caret]');
  const transcriptElement = rootElement.querySelector('[data-captions-transcript]');
  const controlButton = rootElement.querySelector('[data-captions-control]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let phrases = phrasesByLanguage[language] ?? phrasesByLanguage.ru;
  let phraseIndex = 0;
  let characterIndex = 0;
  let stage = STAGE.TYPING;

  // Таймер следующего шага. При паузе запоминаем, сколько ему оставалось.
  let stepTimerId = 0;
  let stepDueTime = 0;
  let remainingDelayMs = START_DELAY_MS;

  let isPausedByUser = false;
  let isOnScreen = true;

  let mouthOpening = 0;
  let mouthCloseTime = 0;

  // ——— Отрисовка ———

  /**
   * @param {string} text Видимый текст строки субтитров.
   */
  function showText(text) {
    textElement.textContent = text;
  }

  function updateTranscript() {
    transcriptElement.textContent = phrases.join(' ');
  }

  /**
   * @param {string} action Одно из значений CONTROL_ACTION.
   */
  function updateControl(action) {
    Object.values(CONTROL_ACTION).forEach((controlAction) => {
      controlButton.classList.toggle(`captions__control--${controlAction}`, controlAction === action);
    });
    controlButton.dataset.action = action;
    controlButton.setAttribute('aria-label', translate(`captions.${action}`));
  }

  function getCurrentControlAction() {
    if (stage === STAGE.FINISHED) return CONTROL_ACTION.REPLAY;
    return isPausedByUser ? CONTROL_ACTION.PLAY : CONTROL_ACTION.PAUSE;
  }

  function updateStateClasses() {
    rootElement.classList.toggle('captions--paused', isPausedByUser);
    rootElement.classList.toggle('captions--finished', stage === STAGE.FINISHED);
    updateControl(getCurrentControlAction());
  }

  // ——— Таймер шагов ———

  /**
   * @param {number} delayMs Через сколько выполнить следующий шаг.
   */
  function scheduleNextStep(delayMs) {
    remainingDelayMs = delayMs;
    if (!canRun()) return;
    stepDueTime = performance.now() + delayMs;
    stepTimerId = window.setTimeout(runNextStep, delayMs);
  }

  function suspendTimer() {
    if (!stepTimerId) return;
    window.clearTimeout(stepTimerId);
    stepTimerId = 0;
    remainingDelayMs = Math.max(0, stepDueTime - performance.now());
  }

  function resumeTimer() {
    if (stepTimerId || stage === STAGE.FINISHED || !canRun()) return;
    scheduleNextStep(remainingDelayMs);
  }

  /** Набор идёт, только если его не остановили кнопкой и субтитры видны. */
  function canRun() {
    return !isPausedByUser && isOnScreen && !document.hidden;
  }

  function updateRunningState() {
    if (canRun()) resumeTimer();
    else suspendTimer();
  }

  // ——— Шаги показа ———

  /**
   * @param {string} phrase Фраза, которая только что набрана целиком.
   * @returns {number} Сколько держать её на экране, мс.
   */
  function getHoldDuration(phrase) {
    return PHRASE_HOLD_BASE_MS + phrase.length * PHRASE_HOLD_PER_CHARACTER_MS;
  }

  function typeNextCharacter() {
    const phrase = phrases[phraseIndex];

    if (characterIndex >= phrase.length) {
      stage = STAGE.HOLDING;
      scheduleNextStep(getHoldDuration(phrase));
      return;
    }

    // При reduced motion фраза появляется сразу целиком.
    if (prefersReducedMotion) {
      characterIndex = phrase.length;
      showText(phrase);
      scheduleNextStep(0);
      return;
    }

    const character = phrase[characterIndex];
    characterIndex += 1;
    showText(phrase.slice(0, characterIndex));

    mouthOpening = getMouthOpening(character);
    mouthCloseTime = performance.now() + MOUTH_OPEN_DURATION_MS;

    scheduleNextStep(getDelayAfterCharacter(character));
  }

  function finishPhrase() {
    const isLastPhrase = phraseIndex === phrases.length - 1;

    if (isLastPhrase) {
      stage = STAGE.FINISHED;
      updateStateClasses();
      return;
    }

    stage = STAGE.FADING;
    lineElement.classList.add('captions__line--fading');
    scheduleNextStep(FADE_DURATION_MS);
  }

  function startNextPhrase() {
    phraseIndex += 1;
    characterIndex = 0;
    showText('');
    lineElement.classList.remove('captions__line--fading');
    stage = STAGE.TYPING;
    scheduleNextStep(CHARACTER_DELAY_MS);
  }

  function runNextStep() {
    stepTimerId = 0;

    if (stage === STAGE.TYPING) typeNextCharacter();
    else if (stage === STAGE.HOLDING) finishPhrase();
    else if (stage === STAGE.FADING) startNextPhrase();
  }

  /**
   * Начинает показ с первой фразы.
   *
   * @param {number} delayMs Пауза перед первой буквой.
   */
  function restart(delayMs) {
    suspendTimer();
    phraseIndex = 0;
    characterIndex = 0;
    stage = STAGE.TYPING;
    showText('');
    lineElement.classList.remove('captions__line--fading');
    updateStateClasses();
    scheduleNextStep(delayMs);
  }

  // ——— Управление ———

  function handleControlClick() {
    if (stage === STAGE.FINISHED) {
      isPausedByUser = false;
      restart(CHARACTER_DELAY_MS);
      return;
    }

    isPausedByUser = !isPausedByUser;
    updateStateClasses();
    updateRunningState();
  }

  /**
   * Переводит субтитры на другой язык:
   * — показ закончен — последняя фраза сразу на новом языке;
   * — показ на паузе — текущая фраза целиком на новом языке, после «продолжить» она дочитывается;
   * — показ идёт — текущая фраза набирается заново на новом языке.
   *
   * @param {string} newLanguage Код языка.
   */
  function setLanguage(newLanguage) {
    phrases = phrasesByLanguage[newLanguage] ?? phrasesByLanguage.ru;
    updateTranscript();
    updateControl(getCurrentControlAction());

    if (stage === STAGE.FINISHED) {
      showText(phrases.at(-1));
      return;
    }

    suspendTimer();
    lineElement.classList.remove('captions__line--fading');
    const phrase = phrases[phraseIndex];

    if (isPausedByUser) {
      characterIndex = phrase.length;
      showText(phrase);
      stage = STAGE.HOLDING;
      scheduleNextStep(getHoldDuration(phrase));
      return;
    }

    characterIndex = 0;
    stage = STAGE.TYPING;
    showText('');
    scheduleNextStep(CHARACTER_DELAY_MS);
  }

  /**
   * Насколько сейчас открыт рот головы. Вызывается из цикла кадров головы.
   *
   * @returns {number} От 0 (закрыт) до 1.
   */
  function getSpeechLevel() {
    if (!canRun() || performance.now() > mouthCloseTime) return 0;
    return mouthOpening;
  }

  // ——— Запуск ———

  controlButton.addEventListener('click', handleControlClick);
  // Каретка и кнопка нужны только с JavaScript: без него текст просто стоит на месте.
  controlButton.hidden = false;
  if (caretElement) caretElement.hidden = false;
  document.addEventListener('visibilitychange', updateRunningState);

  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver((entries) => {
      isOnScreen = entries.at(-1).isIntersecting;
      updateRunningState();
    }, { threshold: 0 });
    visibilityObserver.observe(rootElement);
  }

  updateTranscript();
  restart(START_DELAY_MS);

  return { getSpeechLevel, setLanguage };
}
