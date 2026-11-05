// «Стопка» избранных работ: при прокрутке карточки закрепляются под шапкой
// и ложатся друг на друга, предыдущая слегка уменьшается и темнеет.
// Идея — компонент Stacking Cards (Daniel Petho, 21st.dev); здесь своя
// реализация на CSS position: sticky + небольшом скрипте без зависимостей.
//
// Стопка включается только там, где она удобна:
// — экран от 768 px и без «уменьшить движение»;
// — каждая карточка целиком помещается в окно (иначе низ карточки с кнопками
//   нельзя было бы дочитать — его накроет следующая);
// — если фокус (клавиатура, возврат фокуса после закрытия кейса) попадает на
//   элемент под соседней карточкой, страница мгновенно прокручивается так,
//   чтобы его карточка оказалась впереди. Раскладку при этом не переключаем —
//   иначе она прыгала бы под курсором и клики терялись.

const WIDE = '(min-width: 768px)';
const CALM = '(prefers-reduced-motion: reduce)';

export function initWorkStack(list) {
  if (!list) return null;

  const cards = [...list.querySelectorAll('.project')];
  if (cards.length < 2) return null;

  const wide = window.matchMedia(WIDE);
  const calm = window.matchMedia(CALM);
  let enabled = false;
  let frame = 0;

  cards.forEach((card, index) => card.style.setProperty('--i', String(index)));

  function headerHeight() {
    return document.querySelector('[data-header]')?.offsetHeight ?? 64;
  }

  function fits() {
    const room = window.innerHeight - headerHeight() - 24 - cards.length * 12;
    return cards.every((card) => card.offsetHeight <= room);
  }

  function reset() {
    cards.forEach((card) => card.style.removeProperty('--stack'));
  }

  function update() {
    frame = 0;
    if (!enabled) return;

    // Насколько следующая карточка уже наехала на текущую: 0 — свободна, 1 — накрыта.
    for (let i = 0; i < cards.length; i += 1) {
      const card = cards[i];
      const next = cards[i + 1];
      let progress = 0;

      if (next) {
        const top = card.getBoundingClientRect().top;
        const nextTop = next.getBoundingClientRect().top;
        progress = 1 - (nextTop - top) / card.offsetHeight;
        progress = Math.min(1, Math.max(0, progress));
      }

      card.style.setProperty('--stack', progress.toFixed(3));
    }
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  function refresh() {
    // Меряем карточки в обычной раскладке, чтобы решение не зависело от стопки.
    list.classList.remove('is-stacked');
    reset();

    enabled = wide.matches && !calm.matches && fits();
    list.classList.toggle('is-stacked', enabled);
    if (enabled) schedule();
  }

  // Положение прокрутки, при котором карточка закреплена наверху и ещё не накрыта:
  // считаем по обычному потоку (sticky не меняет место карточки в потоке).
  function pinnedScrollY(index) {
    let flowTop = list.getBoundingClientRect().top + window.scrollY;
    for (let i = 0; i < index; i += 1) {
      flowTop += cards[i].offsetHeight + parseFloat(getComputedStyle(cards[i]).marginBottom);
    }
    return flowTop - parseFloat(getComputedStyle(cards[index]).top);
  }

  function isCovered(element) {
    const box = element.getBoundingClientRect();
    if (!box.width || !box.height) return false;
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return Boolean(hit) && hit !== element && !element.contains(hit);
  }

  function onFocusIn(event) {
    if (!enabled) return;
    const card = event.target.closest('.project');
    if (!card) return;

    // Ждём, пока браузер закончит свою (плавную) прокрутку к фокусу, и только
    // потом проверяем, не оказался ли элемент под соседней карточкой.
    const target = event.target;
    let done = false;
    const fix = () => {
      if (done) return;
      done = true;
      window.removeEventListener('scrollend', fix);
      if (document.activeElement !== target || !isCovered(target)) return;
      window.scrollTo({ top: pinnedScrollY(cards.indexOf(card)), behavior: 'instant' });
    };
    window.addEventListener('scrollend', fix, { once: true });
    window.setTimeout(fix, 600);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', refresh, { passive: true });
  wide.addEventListener?.('change', refresh);
  calm.addEventListener?.('change', refresh);
  list.addEventListener('focusin', onFocusIn);

  // Картинки с loading="lazy" меняют высоту карточек — пересчитываем после загрузки.
  list.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', refresh, { once: true });
  });

  refresh();

  return { refresh };
}
