/**
 * Плавное появление блоков с классом .reveal, когда они доходят до экрана.
 *
 * Скрывать блоки начинаем только из скрипта (класс page--reveal-ready на <body>),
 * поэтому без JavaScript всё видно сразу. Если фокус с клавиатуры попал
 * в ещё не проявившийся блок, показываем его немедленно.
 */

const VISIBLE_CLASS = 'reveal--visible';

/**
 * @param {{ pageElement: HTMLElement }} options
 */
export function initRevealOnScroll({ pageElement }) {
  const revealElements = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add(VISIBLE_CLASS));
    return;
  }

  pageElement.classList.add('page--reveal-ready');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add(VISIBLE_CLASS);
      observer.unobserve(entry.target);
    });
  }, {
    // Порог 0: высокие блоки (вопросы, форма) появляются, как только край вошёл в экран.
    threshold: 0,
    rootMargin: '0px 0px -40px'
  });

  revealElements.forEach((element) => observer.observe(element));

  document.addEventListener('focusin', (event) => {
    const revealElement = event.target.closest?.('.reveal');
    if (!revealElement || revealElement.classList.contains(VISIBLE_CLASS)) return;
    revealElement.classList.add(VISIBLE_CLASS);
    observer.unobserve(revealElement);
  });
}
