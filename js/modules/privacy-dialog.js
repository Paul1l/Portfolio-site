/**
 * Окно «Что происходит с данными из формы». Открывается кнопками
 * с атрибутом data-privacy-open, закрывается крестиком, Escape или кликом по фону.
 */

/**
 * @param {{ dialogElement: HTMLDialogElement, closeButton: HTMLButtonElement }} options
 */
export function initPrivacyDialog({ dialogElement, closeButton }) {
  document.querySelectorAll('[data-privacy-open]').forEach((openButton) => {
    openButton.addEventListener('click', () => dialogElement.showModal());
  });

  closeButton.addEventListener('click', () => dialogElement.close());

  // Клик пришёлся на сам <dialog>, а не на содержимое, — значит, по затемнённому фону.
  dialogElement.addEventListener('click', (event) => {
    if (event.target === dialogElement) dialogElement.close();
  });
}
