/**
 * «Колода» избранных работ (экраны от 768 px).
 *
 * Превью стоят стопкой на ребре. При прокрутке передняя карточка опрокидывается
 * вперёд «на пол», а следующая выходит вперёд. Идея — компонент Tumble Deck
 * Showcase (Kedhareswer Naidu, 21st.dev), реализация своя: CSS 3D-трансформации
 * и этот скрипт.
 *
 * Как устроено:
 * — колода слева закреплена (position: sticky), описания работ справа идут
 *   обычным текстом; активной становится работа, описание которой пересекает
 *   середину экрана;
 * — прокрутку не перехватываем: всё работает от обычного скролла, клавиатуры
 *   и кнопок ↑ / ↓;
 * — весь текст остаётся в HTML, колода — только картинка (aria-hidden);
 * — на экранах уже 768 px колода скрыта, остаётся список карточек с превью.
 */

const WIDE_SCREEN_QUERY = '(min-width: 768px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Сколько следующих карточек видно в стопке за передней. */
const VISIBLE_CARDS_BEHIND = 5;
/** Сдвиг каждой следующей карточки вверх (в % высоты) и вглубь (в px). */
const CARD_OFFSET_UP_PERCENT = 3.2;
const CARD_OFFSET_DEPTH_PX = 70;
/** Затемнение карточек в стопке: первая за передней — 0.35, дальше темнее, но не больше 0.75. */
const SHADE_BASE = 0.25;
const SHADE_STEP = 0.1;
const SHADE_MAX = 0.75;
const FALLEN_CARD_SHADE = 0.45;

/**
 * Считает, как стоит карточка относительно активной.
 *
 * @param {number} distance Номер карточки минус номер активной: 0 — передняя,
 *   больше нуля — в стопке позади, меньше нуля — уже упала.
 * @returns {{ transform: string, opacity: number, shade: number }}
 */
function getCardPlacement(distance) {
  if (distance === 0) {
    return { transform: 'translate3d(0, 0, 0) rotateX(0deg)', opacity: 1, shade: 0 };
  }

  if (distance > 0) {
    const stackPosition = Math.min(distance, VISIBLE_CARDS_BEHIND + 1);
    return {
      transform: `translate3d(0, ${-stackPosition * CARD_OFFSET_UP_PERCENT}%, ${-stackPosition * CARD_OFFSET_DEPTH_PX}px) rotateX(0deg)`,
      opacity: distance > VISIBLE_CARDS_BEHIND ? 0 : 1,
      shade: Math.min(SHADE_MAX, SHADE_BASE + stackPosition * SHADE_STEP)
    };
  }

  // На «полу» видна только последняя упавшая карточка.
  return {
    transform: 'translate3d(0, 0, 0) rotateX(-90deg)',
    opacity: distance === -1 ? 1 : 0,
    shade: FALLEN_CARD_SHADE
  };
}

/**
 * @param {number} number Порядковый номер с единицы.
 * @returns {string} Номер из двух цифр: «01», «06».
 */
function formatCardNumber(number) {
  return String(number).padStart(2, '0');
}

/**
 * Создаёт карточку колоды с копией превью работы.
 *
 * @param {string} imageSource Путь к превью.
 * @returns {HTMLDivElement} Карточка.
 */
function createDeckCard(imageSource) {
  const card = document.createElement('div');
  card.className = 'work-deck__card';

  const image = document.createElement('img');
  image.className = 'work-deck__image';
  image.src = imageSource;
  image.alt = '';
  image.width = 1600;
  image.height = 1000;
  image.loading = 'lazy';
  image.decoding = 'async';

  card.append(image);
  return card;
}

/**
 * @param {{ showcaseElement: HTMLElement | null }} options
 * @returns {{ refresh: () => void } | null}
 */
export function initWorkDeck({ showcaseElement }) {
  if (!showcaseElement) return null;

  const projectItems = [...showcaseElement.querySelectorAll('[data-project]')];
  if (projectItems.length < 2) return null;

  const deckElement = showcaseElement.querySelector('[data-work-deck]');
  const stageElement = deckElement.querySelector('[data-work-deck-stage]');
  const currentNumberElement = deckElement.querySelector('[data-work-deck-current]');
  const totalNumberElement = deckElement.querySelector('[data-work-deck-total]');
  const previousButton = deckElement.querySelector('[data-work-deck-previous]');
  const nextButton = deckElement.querySelector('[data-work-deck-next]');

  const wideScreenQuery = window.matchMedia(WIDE_SCREEN_QUERY);
  const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

  const cards = projectItems.map((projectItem) => {
    const previewImage = projectItem.querySelector('[data-project-image]');
    const card = createDeckCard(previewImage?.getAttribute('src') ?? '');
    stageElement.append(card);
    return card;
  });
  totalNumberElement.textContent = formatCardNumber(projectItems.length);

  let isEnabled = false;
  let activeIndex = -1;
  let scheduledFrameId = 0;

  /**
   * @param {number} newActiveIndex Номер активной работы с нуля.
   */
  function placeCards(newActiveIndex) {
    cards.forEach((card, cardIndex) => {
      const distance = cardIndex - newActiveIndex;
      const placement = getCardPlacement(distance);

      card.style.transform = placement.transform;
      card.style.opacity = String(placement.opacity);
      card.style.setProperty('--card-shade', String(placement.shade));
      // Передняя карточка выше всех, дальше по стопке и по «полу» — ниже.
      card.style.zIndex = String(distance >= 0 ? 100 - distance : 100 + distance);
      card.classList.toggle('work-deck__card--front', distance === 0);
      card.classList.toggle('work-deck__card--fallen', distance < 0);
      card.classList.toggle('work-deck__card--hidden', placement.opacity === 0);
    });
  }

  /**
   * @param {number} newActiveIndex Номер активной работы с нуля.
   */
  function setActiveIndex(newActiveIndex) {
    if (newActiveIndex === activeIndex) return;
    activeIndex = newActiveIndex;

    placeCards(activeIndex);
    projectItems.forEach((projectItem, itemIndex) => {
      projectItem.classList.toggle('showcase__item--active', itemIndex === activeIndex);
    });
    currentNumberElement.textContent = formatCardNumber(activeIndex + 1);
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === projectItems.length - 1;
  }

  /** Активна последняя работа, верх которой уже поднялся выше середины экрана. */
  function updateActiveFromScroll() {
    scheduledFrameId = 0;
    if (!isEnabled) return;

    const viewportMiddle = window.innerHeight / 2;
    let newActiveIndex = 0;
    projectItems.forEach((projectItem, itemIndex) => {
      if (projectItem.getBoundingClientRect().top <= viewportMiddle) newActiveIndex = itemIndex;
    });
    setActiveIndex(newActiveIndex);
  }

  /** Пересчёт не чаще одного раза за кадр. */
  function scheduleUpdate() {
    if (!scheduledFrameId) scheduledFrameId = window.requestAnimationFrame(updateActiveFromScroll);
  }

  /**
   * Прокручивает страницу так, чтобы описание работы оказалось посередине экрана.
   *
   * @param {number} targetIndex Номер работы с нуля.
   */
  function scrollToProject(targetIndex) {
    const clampedIndex = Math.max(0, Math.min(projectItems.length - 1, targetIndex));
    const itemRect = projectItems[clampedIndex].getBoundingClientRect();
    const targetScrollTop = window.scrollY + itemRect.top + itemRect.height / 2 - window.innerHeight / 2;
    window.scrollTo({ top: targetScrollTop, behavior: reducedMotionQuery.matches ? 'instant' : 'smooth' });
  }

  /** Включает колоду на широком экране и выключает на узком. */
  function refresh() {
    isEnabled = wideScreenQuery.matches;
    deckElement.hidden = !isEnabled;
    showcaseElement.classList.toggle('showcase--deck', isEnabled);
    activeIndex = -1;

    if (!isEnabled) {
      projectItems.forEach((projectItem) => projectItem.classList.remove('showcase__item--active'));
      return;
    }

    updateActiveFromScroll();
  }

  previousButton.addEventListener('click', () => scrollToProject(activeIndex - 1));
  nextButton.addEventListener('click', () => scrollToProject(activeIndex + 1));
  // Клик по колоде листает вперёд, после последней работы — к первой.
  stageElement.addEventListener('click', () => {
    scrollToProject(activeIndex + 1 < projectItems.length ? activeIndex + 1 : 0);
  });
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  wideScreenQuery.addEventListener('change', refresh);

  refresh();

  return { refresh };
}
