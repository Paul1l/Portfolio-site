const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
const ageNode = document.querySelector('[data-age]');
const yearNode = document.querySelector('[data-year]');
const form = document.querySelector('[data-form]');
const message = document.querySelector('[data-message]');
const telegramButton = document.querySelector('[data-telegram]');

function setHeaderState() {
  header?.classList.toggle('is-scrolled', window.scrollY > 10);
}

function getAge(dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const hasBirthdayPassed = monthDiff > 0 || (monthDiff === 0 && today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age;
}

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

if (ageNode) {
  ageNode.textContent = getAge(ageNode.dataset.birth);
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

nav?.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

function getFormValues() {
  const data = new FormData(form);

  return {
    name: String(data.get('name') || '').trim(),
    contact: String(data.get('contact') || '').trim(),
    task: String(data.get('message') || '').trim(),
    agree: Boolean(data.get('agree'))
  };
}

function validateForm() {
  const values = getFormValues();

  if (!values.name || !values.contact || !values.task) {
    message.textContent = 'Заполните имя, контакт и описание задачи.';
    return null;
  }

  if (!values.agree) {
    message.textContent = 'Нужно согласие на обработку данных для ответа на заявку.';
    return null;
  }

  return values;
}

form?.addEventListener('submit', (event) => {
  if (!validateForm()) {
    event.preventDefault();
    return;
  }

  message.textContent = 'Отправляю заявку на email. При первом запуске FormSubmit может попросить подтвердить адрес.';
});

telegramButton?.addEventListener('click', () => {
  const values = validateForm();

  if (!values) {
    return;
  }

  const text = `Здравствуйте! Меня зовут ${values.name}. Контакт: ${values.contact}. Задача: ${values.task}`;
  const tgUrl = 'https://t.me/pauletolava1804';
  const mailUrl = `mailto:pauletolava1804@gmail.com?subject=${encodeURIComponent('Заявка на сайт')}&body=${encodeURIComponent(text)}`;

  message.innerHTML = `Открываю Telegram. Если он не открылся, можно <a href="${tgUrl}" target="_blank" rel="noopener">перейти вручную</a> или <a href="${mailUrl}">отправить email</a>.`;
  window.open(tgUrl, '_blank', 'noopener');
});
