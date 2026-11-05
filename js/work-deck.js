// «Колода» избранных работ: превью сайтов стоят стопкой на ребре, и по мере
// прокрутки передняя карточка опрокидывается вперёд «на пол», а следующая
// поднимается. Идея — компонент Tumble Deck Showcase (Kedhareswer Naidu, 21st.dev);
// здесь своя реализация на CSS 3D-трансформациях и небольшом скрипте.
//
// Как устроено:
// — слева колода закреплена (sticky), справа описания работ идут обычным
//   текстом; активной становится работа, описание которой пересекает середину
//   экрана, — колода листается к ней вперёд или назад;
// — прокрутку страницы не перехватываем: всё работает от обычного скролла,
//   клавиатуры и кнопок «вверх / вниз»;
// — весь текст остаётся в HTML и доступен, колода — только визуальный слой;
// — на экранах уже 768 px остаётся обычный список с превью.

const WIDE = '(min-width: 768px)';
const MAX_BEHIND = 5;

export function initWorkDeck(list, { t = (key) => key } = {}) {
  if (!list) return null;

  const items = [...list.querySelectorAll('.project')];
  if (items.length < 2) return null;

  const wide = window.matchMedia(WIDE);
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Обёртка: колода слева, список справа.
  const showcase = document.createElement('div');
  showcase.className = 'work-showcase';
  list.before(showcase);

  const deck = document.createElement('div');
  deck.className = 'work-deck';
  deck.innerHTML = `
    <div class="work-deck__stage" aria-hidden="true"></div>
    <div class="work-deck__controls">
      <button class="work-deck__button" type="button" data-deck-prev><span aria-hidden="true">↑</span></button>
      <p class="work-deck__counter"><span data-deck-current>01</span> / <span>${String(items.length).padStart(2, '0')}</span></p>
      <button class="work-deck__button" type="button" data-deck-next><span aria-hidden="true">↓</span></button>
    </div>`;
  showcase.append(deck, list);

  const stage = deck.querySelector('.work-deck__stage');
  const current = deck.querySelector('[data-deck-current]');
  const prevButton = deck.querySelector('[data-deck-prev]');
  const nextButton = deck.querySelector('[data-deck-next]');

  const cards = items.map((item) => {
    const source = item.querySelector('.project__visual img');
    const card = document.createElement('div');
    card.className = 'work-deck__card';
    const img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 1600;
    img.height = 1000;
    img.src = source?.getAttribute('src') ?? '';
    card.append(img);
    stage.append(card);
    return card;
  });

  let enabled = false;
  let active = -1;
  let frame = 0;

  function place(index) {
    cards.forEach((card, i) => {
      const d = i - index;
      let transform;
      let opacity = 1;
      let shade = 0;

      if (d === 0) {
        transform = 'translate3d(0, 0, 0) rotateX(0deg)';
      } else if (d > 0) {
        // Следующие работы стоят в стопке позади и выглядывают сверху.
        const k = Math.min(d, MAX_BEHIND + 1);
        transform = `translate3d(0, ${-k * 3.2}%, ${-k * 70}px) rotateX(0deg)`;
        opacity = d > MAX_BEHIND ? 0 : 1;
        shade = Math.min(0.75, 0.25 + k * 0.1);
      } else {
        // Пройденные работы лежат «на полу»: видна только последняя.
        transform = 'translate3d(0, 0, 0) rotateX(-90deg)';
        opacity = d === -1 ? 1 : 0;
        shade = 0.45;
      }

      card.style.transform = transform;
      card.style.opacity = String(opacity);
      card.style.setProperty('--shade', String(shade));
      card.classList.toggle('is-front', d === 0);
      card.classList.toggle('is-fallen', d < 0);
      card.classList.toggle('is-hidden', opacity === 0);
      card.style.zIndex = String(d >= 0 ? 100 - d : 100 + d);
    });
  }

  function setActive(index) {
    if (index === active) return;
    active = index;
    place(index);
    items.forEach((item, i) => item.classList.toggle('is-active', i === index));
    current.textContent = String(index + 1).padStart(2, '0');
    prevButton.disabled = index === 0;
    nextButton.disabled = index === items.length - 1;
  }

  // Активна работа, описание которой пересекает середину экрана.
  function update() {
    frame = 0;
    if (!enabled) return;
    const line = window.innerHeight * 0.5;
    let index = 0;
    for (let i = 0; i < items.length; i += 1) {
      if (items[i].getBoundingClientRect().top <= line) index = i;
    }
    setActive(index);
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  function go(index) {
    const target = items[Math.max(0, Math.min(items.length - 1, index))];
    const box = target.getBoundingClientRect();
    const top = window.scrollY + box.top + box.height / 2 - window.innerHeight / 2;
    window.scrollTo({ top, behavior: calm.matches ? 'instant' : 'smooth' });
  }

  function relabel() {
    prevButton.setAttribute('aria-label', t('deckPrev'));
    nextButton.setAttribute('aria-label', t('deckNext'));
  }

  function refresh() {
    enabled = wide.matches;
    showcase.classList.toggle('is-deck', enabled);
    if (!enabled) {
      items.forEach((item) => item.classList.remove('is-active'));
      active = -1;
      return;
    }
    active = -1;
    update();
  }

  prevButton.addEventListener('click', () => go(active - 1));
  nextButton.addEventListener('click', () => go(active + 1));
  stage.addEventListener('click', () => go(active + 1 < items.length ? active + 1 : 0));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  wide.addEventListener?.('change', refresh);

  relabel();
  refresh();

  return { refresh, relabel };
}
