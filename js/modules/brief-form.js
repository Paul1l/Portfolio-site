/**
 * Форма заявки.
 *
 * — Проверка: пустые поля и поля из одних пробелов не проходят, контакт должен
 *   быть похож на email, @username в Telegram, ссылку t.me или телефон.
 * — Отправка: AJAX-запрос в FormSubmit. Успехом считаем только явный
 *   success: true — сервис может ответить 200 и при отказе.
 * — «Отправить через Telegram»: копируем текст заявки и открываем чат.
 * Без JavaScript форма отправляется обычным POST и проверяется браузером.
 */

const TELEGRAM_CHAT_URL = 'https://t.me/shra1d';

/**
 * email | @username | t.me/username | телефон.
 * Ник в Telegram — от 5 до 32 символов, начинается с буквы.
 */
const CONTACT_PATTERN = /^(?:[^\s@]+@[^\s@]+\.[^\s@]+|@?[A-Za-z][A-Za-z0-9_]{4,31}|(?:https?:\/\/)?t\.me\/[A-Za-z][A-Za-z0-9_]{4,31}|\+?[\d\s()-]{7,20})$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Статусы, которые устаревают, как только человек снова начинает печатать. */
const STATUSES_CLEARED_BY_INPUT = new Set(['form.sent', 'form.checkFields']);

/**
 * @param {{
 *   formElement: HTMLFormElement,
 *   statusElement: HTMLElement,
 *   telegramButton: HTMLButtonElement,
 *   translate: (key: string) => string,
 *   toast: { show: (messageKey: string) => void }
 * }} options
 * @returns {{ refreshLanguage: () => void }}
 */
export function initBriefForm({ formElement, statusElement, telegramButton, translate, toast }) {
  const submitButton = formElement.querySelector('[type="submit"]');
  const { name: nameField, contact: contactField, message: messageField, format: formatField } = formElement.elements;
  let currentStatusKey = '';

  // Проверку берём на себя, чтобы статус под формой всегда был актуальным.
  formElement.noValidate = true;

  /**
   * @param {string} [statusKey] Ключ сообщения или пустая строка, чтобы скрыть статус.
   */
  function setStatus(statusKey = '') {
    currentStatusKey = statusKey;
    statusElement.textContent = statusKey ? translate(statusKey) : '';
  }

  /** @returns {string} Подпись выбранного варианта «Что нужно» на текущем языке. */
  function getSelectedFormatLabel() {
    return formatField.selectedOptions[0]?.textContent.trim() ?? '';
  }

  /**
   * Проверяет поля и показывает подсказку у первого неверного.
   *
   * @returns {boolean} Можно ли отправлять.
   */
  function validateFields() {
    [nameField, contactField, messageField].forEach((field) => {
      field.setCustomValidity(field.value.trim() ? '' : translate('form.fieldEmpty'));
    });

    const contactValue = contactField.value.trim();
    if (contactValue && !CONTACT_PATTERN.test(contactValue)) {
      contactField.setCustomValidity(translate('form.contactInvalid'));
    }

    return formElement.reportValidity();
  }

  /**
   * @returns {Promise<void>} Выполняется, когда FormSubmit подтвердил отправку.
   */
  async function sendToFormSubmit() {
    const formData = new FormData(formElement);
    const contactValue = String(formData.get('contact') ?? '').trim();

    // Если оставили почту, FormSubmit подставит её в «Ответить».
    if (EMAIL_PATTERN.test(contactValue)) formData.set('email', contactValue);
    formData.set('format', getSelectedFormatLabel());

    const ajaxEndpoint = formElement.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
    const response = await fetch(ajaxEndpoint, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });
    const responseBody = await response.json().catch(() => ({}));

    if (!response.ok || String(responseBody.success) !== 'true') {
      throw new Error('FormSubmit did not confirm the request');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateFields()) {
      setStatus('form.checkFields');
      return;
    }

    const submitButtonHadFocus = document.activeElement === submitButton;
    submitButton.disabled = true;
    formElement.setAttribute('aria-busy', 'true');
    setStatus('form.sending');

    try {
      await sendToFormSubmit();
      formElement.reset();
      setStatus('form.sent');
      toast.show('toast.sent');
    } catch {
      setStatus('form.sendError');
      toast.show('toast.sendError');
    } finally {
      submitButton.disabled = false;
      formElement.removeAttribute('aria-busy');
      // Отключённая кнопка теряет фокус — возвращаем его, чтобы клавиатура не «потерялась».
      if (submitButtonHadFocus && (!document.activeElement || document.activeElement === document.body)) {
        submitButton.focus();
      }
    }
  }

  /** @returns {string} Текст заявки для вставки в чат. */
  function createTelegramMessage() {
    return [
      translate('form.telegramGreeting'),
      `${translate('form.telegramName')}: ${nameField.value.trim()}`,
      `${translate('form.telegramContact')}: ${contactField.value.trim()}`,
      `${translate('form.telegramFormat')}: ${getSelectedFormatLabel()}`,
      `${translate('form.telegramTask')}: ${messageField.value.trim()}`
    ].join('\n');
  }

  async function handleTelegramClick() {
    if (!validateFields()) {
      setStatus('form.fillFirst');
      return;
    }

    // Копировать начинаем до открытия вкладки: новая вкладка забирает фокус,
    // и после этого браузер может не пустить к буферу обмена.
    const copying = navigator.clipboard
      ? navigator.clipboard.writeText(createTelegramMessage())
      : Promise.reject(new Error('Clipboard API is not available'));
    window.open(TELEGRAM_CHAT_URL, '_blank', 'noopener,noreferrer');

    try {
      await copying;
      toast.show('toast.copied');
      setStatus('form.copied');
    } catch {
      toast.show('toast.telegramOpened');
      setStatus('form.telegramOpened');
    }
  }

  formElement.addEventListener('input', (event) => {
    event.target.setCustomValidity?.('');
    if (STATUSES_CLEARED_BY_INPUT.has(currentStatusKey)) setStatus('');
  });
  formElement.addEventListener('submit', handleSubmit);
  telegramButton.addEventListener('click', handleTelegramClick);

  return {
    refreshLanguage() {
      if (currentStatusKey) statusElement.textContent = translate(currentStatusKey);
    }
  };
}
