/**
 * Плавающая кнопка «Написать» на телефоне.
 * Появляется, когда первый экран прокручен больше чем наполовину, и прячется,
 * пока на экране раздел контактов или подвал — там и так есть куда нажать.
 */

const SHOW_AFTER_VIEWPORT_SHARE = 0.55;

/**
 * @param {{ buttonElement: HTMLElement, hidingSections: HTMLElement[] }} options
 */
export function initMobileCta({ buttonElement, hidingSections }) {
  const visibleSections = new Set();

  function updateVisibility() {
    const heroIsScrolledPast = window.scrollY > window.innerHeight * SHOW_AFTER_VIEWPORT_SHARE;
    const isCoveredBySection = visibleSections.size > 0;
    buttonElement.classList.toggle('mobile-cta--visible', heroIsScrolledPast && !isCoveredBySection);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.add(entry.target);
        else visibleSections.delete(entry.target);
      });
      updateVisibility();
    }, { threshold: 0.08 });

    hidingSections.filter(Boolean).forEach((section) => observer.observe(section));
  }

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
}
