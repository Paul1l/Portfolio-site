import { projects } from './projects.js';

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu]');
const navigation = document.querySelector('[data-nav]');
const progress = document.querySelector('[data-progress]');
const glow = document.querySelector('[data-glow]');
const caseDialog = document.querySelector('[data-case-dialog]');
const caseContent = document.querySelector('[data-case-content]');
const caseCloseButton = document.querySelector('[data-case-close]');
const privacyDialog = document.querySelector('[data-privacy-dialog]');
const form = document.querySelector('[data-form]');
const formStatus = document.querySelector('[data-form-status]');
const toast = document.querySelector('[data-toast]');
const mobileCta = document.querySelector('[data-mobile-cta]');

let toastTimer;

function caseMarkup(project) {
  const liveButton = project.live
    ? `<a class="button button--accent" href="${project.live}" target="_blank" rel="noopener noreferrer">
        Открыть сайт <span aria-hidden="true">↗</span>
      </a>`
    : '';

  return `
    <div class="case-hero">
      <div class="case-hero__copy">
        <p class="section-kicker">${project.type} · ${project.year}</p>
        <h2 id="case-title">${project.title}</h2>
        <p>${project.summary}</p>
      </div>
      <div class="case-hero__image">
        <img src="${project.image}" alt="${project.imageAlt}" width="1600" height="1000">
      </div>
    </div>

    <div class="case-details">
      <article>
        <span>01 / Задача</span>
        <p>${project.challenge}</p>
      </article>
      <article>
        <span>02 / Решение</span>
        <p>${project.solution}</p>
      </article>
      <article>
        <span>03 / Результат</span>
        <p>${project.result}</p>
      </article>
    </div>

    <div class="case-footer">
      <div>
        <p>Моя роль</p>
        <strong>${project.role}</strong>
      </div>
      <div class="tag-list">
        ${project.stack.map((item) => `<span>${item}</span>`).join('')}
      </div>
      <div class="case-footer__actions">
        ${liveButton}
        <a class="button button--outline" href="${project.code}" target="_blank" rel="noopener noreferrer">
          Смотреть код <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  `;
}

function openCase(slug, updateAddress = true) {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return;

  caseContent.innerHTML = caseMarkup(project);

  if (!caseDialog.open) {
    caseDialog.showModal();
  }

  if (updateAddress && window.location.hash !== `#case/${slug}`) {
    window.history.pushState({ case: slug }, '', `#case/${slug}`);
  }
}

function closeCase(updateAddress = true) {
  if (caseDialog.open) {
    caseDialog.close();
  }

  if (updateAddress && window.location.hash.startsWith('#case/')) {
    window.history.replaceState(null, '', '#work');
  }
}

function syncCaseRoute() {
  const hash = window.location.hash;

  if (hash.startsWith('#case/')) {
    openCase(decodeURIComponent(hash.slice('#case/'.length)), false);
    return;
  }

  closeCase(false);
}

function initCases() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-case]');
    if (!button) return;
    openCase(button.dataset.case);
  });

  caseCloseButton.addEventListener('click', () => closeCase());
  caseDialog.addEventListener('click', (event) => {
    if (event.target === caseDialog) closeCase();
  });
  caseDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeCase();
  });

  window.addEventListener('popstate', syncCaseRoute);
  syncCaseRoute();
}

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const value = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  header.classList.toggle('is-scrolled', window.scrollY > 20);
  progress.style.transform = `scaleX(${value})`;
}

function initNavigation() {
  const desktopQuery = window.matchMedia('(min-width: 901px)');

  function setMenuState(isOpen, restoreFocus = false) {
    navigation.classList.toggle('is-open', isOpen);
    menuButton.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-is-open', isOpen);

    if (isOpen) {
      window.setTimeout(() => navigation.querySelector('a')?.focus(), 120);
    } else if (restoreFocus) {
      menuButton.focus();
    }
  }

  menuButton.addEventListener('click', () => {
    setMenuState(!navigation.classList.contains('is-open'));
  });

  navigation.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (!navigation.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuState(false, true);
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = [...navigation.querySelectorAll('a[href]'), menuButton];
    const first = focusable[0];
    const last = focusable.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setMenuState(false);
  });

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  document.documentElement.classList.add('reveal-ready');

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px'
  });

  items.forEach((item) => observer.observe(item));
}

function initPointerEffects() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

  window.addEventListener('pointermove', (event) => {
    glow.style.setProperty('--x', `${event.clientX}px`);
    glow.style.setProperty('--y', `${event.clientY}px`);
  }, { passive: true });

  document.querySelectorAll('[data-tilt]').forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const bounds = item.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      item.style.setProperty('--rotate-x', `${y * -4}deg`);
      item.style.setProperty('--rotate-y', `${x * 5}deg`);
    });

    item.addEventListener('pointerleave', () => {
      item.style.removeProperty('--rotate-x');
      item.style.removeProperty('--rotate-y');
    });
  });
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 4200);
}

function formValues() {
  const data = new FormData(form);

  return {
    name: String(data.get('name') || '').trim(),
    contact: String(data.get('contact') || '').trim(),
    format: String(data.get('format') || '').trim(),
    task: String(data.get('message') || '').trim()
  };
}

function initForm() {
  const telegramButton = form.querySelector('[data-telegram]');
  const submitButton = form.querySelector('[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      formStatus.textContent = 'Проверьте обязательные поля.';
      return;
    }

    const payload = new FormData(form);
    const contact = String(payload.get('contact') || '').trim();
    const endpoint = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      payload.set('email', contact);
    }

    submitButton.disabled = true;
    form.setAttribute('aria-busy', 'true');
    formStatus.textContent = 'Отправляю заявку на email…';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error('FormSubmit request failed');

      form.reset();
      formStatus.textContent = 'Спасибо! Заявка отправлена — отвечу по указанному контакту.';
      showToast('Заявка отправлена.');
    } catch {
      formStatus.textContent = 'Не получилось отправить форму. Напишите мне в Telegram или на email.';
      showToast('Форма временно недоступна — контакты рядом.');
    } finally {
      submitButton.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });

  telegramButton.addEventListener('click', async () => {
    if (!form.reportValidity()) {
      formStatus.textContent = 'Сначала заполните обязательные поля.';
      return;
    }

    const values = formValues();
    const brief = [
      'Здравствуйте! Хочу обсудить проект.',
      `Имя: ${values.name}`,
      `Контакт: ${values.contact}`,
      `Формат: ${values.format}`,
      `Задача: ${values.task}`
    ].join('\n');

    window.open('https://t.me/shra1d', '_blank', 'noopener,noreferrer');

    try {
      await navigator.clipboard.writeText(brief);
      showToast('Описание скопировано. Вставьте его в Telegram.');
      formStatus.textContent = 'Текст заявки скопирован — открываю Telegram.';
    } catch {
      showToast('Открываю Telegram. Описание можно скопировать из формы.');
      formStatus.textContent = 'Открываю Telegram.';
    }
  });
}

function initMobileCta() {
  const contactSection = document.querySelector('#contact');
  const footer = document.querySelector('.site-footer');
  const blockedSections = new Map([
    [contactSection, false],
    [footer, false]
  ]);

  function updateMobileCta() {
    const passedHero = window.scrollY > window.innerHeight * 0.55;
    const blocked = [...blockedSections.values()].some(Boolean);
    mobileCta.classList.toggle('is-visible', passedHero && !blocked);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        blockedSections.set(entry.target, entry.isIntersecting);
      });
      updateMobileCta();
    }, { threshold: 0.08 });

    observer.observe(contactSection);
    observer.observe(footer);
  }

  window.addEventListener('scroll', updateMobileCta, { passive: true });
  updateMobileCta();
}

function initPrivacyDialog() {
  document.querySelectorAll('[data-privacy-open]').forEach((button) => {
    button.addEventListener('click', () => privacyDialog.showModal());
  });

  document.querySelector('[data-privacy-close]').addEventListener('click', () => {
    privacyDialog.close();
  });

  privacyDialog.addEventListener('click', (event) => {
    if (event.target === privacyDialog) privacyDialog.close();
  });
}

initCases();
initNavigation();
initReveal();
initPointerEffects();
initForm();
initMobileCta();
initPrivacyDialog();

document.querySelector('[data-year]').textContent = new Date().getFullYear();
