const STORAGE_KEY = 'portfolio-language';
const SUPPORTED_LANGUAGES = ['ru', 'en'];

const english = {
  seo: {
    title: 'Business Website Development — Pavel Orekhov',
    description: 'I design and launch landing pages, product catalogs, and React SPAs for businesses—from structure and responsive UI to forms, technical SEO, and deployment. Featured commercial project: MB Kuzbass.',
    author: 'Pavel Orekhov',
    locale: 'en_US',
    ogDescription: 'Landing pages, catalogs, and React SPAs—from structure and interface to lead forms and launch.',
    ogImageAlt: 'MB Kuzbass website homepage'
  },
  skipLink: 'Skip to content',
  brand: {
    aria: 'Pavel Orekhov — Home',
    name: 'Pavel Orekhov'
  },
  nav: {
    aria: 'Main navigation',
    work: 'Work',
    services: 'Services',
    contact: 'Contact',
    cta: 'Discuss a project <span aria-hidden="true">↗</span>'
  },
  hero: {
    kicker: 'Web development',
    title: 'I build websites that work for&nbsp;you.',
    portraitAlt: 'Portrait of Pavel Orekhov made of light dots',
    lead: 'From idea to launch.<br> Websites and<br> web interfaces.',
    worksCta: 'See my work <span aria-hidden="true">↗</span>',
    index: '01 — Introduction',
    scroll: 'Scroll down <span aria-hidden="true">↓</span>'
  },
  work: {
    kicker: '02 / Portfolio',
    heading: 'Selected work',
    intro: 'Commercial websites, client projects, and concepts — each one can be opened and explored.',
    openWebsite: 'View website <span aria-hidden="true">↗</span>',
    openCode: 'View code <span aria-hidden="true">↗</span>',
    details: 'Case study',
    githubCopy: 'GitHub Pages copy <span aria-hidden="true">↗</span>',
    openConcept: 'View concept <span aria-hidden="true">↗</span>',
    moreTitle: 'More projects and archive',
    site: 'Website <span aria-hidden="true">↗</span>',
    code: 'Code <span aria-hidden="true">↗</span>'
  },
  projects: {
    mbkuzbass: {
      type: 'Commercial project · 2026',
      title: 'MB Kuzbass',
      subtitle: 'Storefront for auto parts and vehicles on its own domain',
      summary: 'Three lines of business — auto parts, vehicles from Japan, and supply for dismantlers — brought together in one clear React SPA instead of an overloaded online shop.'
    },
    meatwash: {
      type: 'Commercial project · 2026',
      subtitle: 'Website for a Moscow car wash and detailing studio network',
      summary: 'Services and prices by body type, online booking at one of two studios, before-and-after comparisons, and a 3D service garage built with three.js that loads only on request.'
    },
    kirpich: {
      type: 'Client project · demo · 2026',
      title: 'Kirpichny Trest',
      subtitle: 'Website for a building materials and services supplier',
      summary: '10 material categories and 4 services, each with its own page. On the homepage, a house assembles on scroll from the materials the company sells.'
    },
    smesi: {
      type: 'Client project · demo · 2026',
      title: 'Dry Mixes',
      subtitle: 'Dry building mix catalog for Kirpichny Trest',
      summary: '134 products from Perel, Dauer, Osnovit, and other manufacturers with prices and specifications, plus a task-based finder. In the hero, a particle cloud assembles into a 3D package showcase.'
    },
    profit: {
      type: 'Concept · 2026',
      subtitle: 'Homepage concept for a marketing agency',
      summary: 'A personal redesign concept: the hero video scrubs with scrolling, a 3D variant uses a depth map, plus animated service cards and a case carousel. Contacts and cases in the mockup are placeholders.'
    },
    mpower: {
      subtitle: 'SPA for an independent BMW service center',
      summary: 'A service landing page with a clear booking journey and a form that prepares an enquiry for Telegram.'
    },
    reon: {
      type: 'Full-stack / Test project · 2026',
      subtitle: 'Form, server-side APIs, and an AI workflow',
      summary: 'The interface connects to server-side functions: an email enquiry, validation, and an AI-generated task summary.'
    },
    techbearing: {
      subtitle: 'Technical product catalog',
      summary: 'A catalog with search, filters, enquiries, and a demo admin panel for managing products.'
    },
    lawyer: {
      title: 'Alexey Kazantsev',
      subtitle: 'Landing page for an independent lawyer · 2026'
    },
    apex: {
      subtitle: 'Editorial concept for a rare-car watchlist · 2026'
    }
  },
  history: {
    guitarMeta: 'Early work: responsive Sass layout · 2024',
    diceMeta: 'Early work: JavaScript game · 2024'
  },
  services: {
    kicker: '03 / Services',
    heading: 'How I can help',
    intro: 'First we define what the website needs to achieve. Then I choose a solution that is powerful enough without being overbuilt.',
    scratchLabel: 'Website from scratch',
    scratchTitle: 'A landing page, service website, or catalog—from structure to launch.',
    scratchText: 'Structure, visual direction, responsive interface, forms, and a solid SEO foundation.',
    spaLabel: 'Catalog / React SPA',
    spaTitle: 'Interfaces with data, states, and user flows.',
    spaText: 'Categories, search, filters, forms, internal screens, and API integrations.',
    designLabel: 'Development from a design',
    designTitle: 'Your design, turned into a responsive working website.',
    designText: 'I preserve the visual idea and build component states, mobile layouts, and interactions.',
    improveLabel: 'Improvements and growth',
    improveTitle: 'I can join an existing project.',
    improveText: 'Audit and fixes, new sections and features, refactoring without rewriting for the sake of it.'
  },
  process: {
    title: 'How the work goes',
    step1Title: 'Define the challenge',
    step1Text: 'We clarify the goal, audience, offer, content, constraints, and the action visitors should take.',
    step2Title: 'Set the direction',
    step2Text: 'I shape the structure, visual system, and opening screen before full development begins.',
    step3Title: 'Build',
    step3Text: 'Responsive layouts, interactions, real form states, and testing across different screen sizes.',
    step4Title: 'Launch',
    step4Text: 'Final checks, deployment, and a clean, well-organized source handoff.'
  },
  about: {
    kicker: '04 / Approach',
    heading: 'A focused process, without the noise',
    paragraph1: 'Clients care less about library names than a clear process, a careful launch, and a website they can continue working with. That is what I build the process around.',
    paragraph2: 'I have worked in frontend development since 2022. I keep the structure, visual system, frontend, and launch preparation in one context, so decisions do not get lost between multiple specialists.',
    personal: 'Before development, I spent many years playing football. It taught me to keep the pace, work as part of a team, and see every play through.',
    githubCta: 'Review my code on GitHub <span aria-hidden="true">↗</span>',
    purposeTitle: 'Purpose first',
    purposeText: 'I clarify what visitors need to understand and what action the website should lead them to.',
    technologyTitle: 'Right-sized technology',
    technologyText: 'I use React when it solves the problem—not simply to make the stack sound impressive.',
    proofTitle: 'Work you can verify',
    proofText: 'There is a live commercial website, published projects, and open source code.'
  },
  faq: {
    kicker: '05 / Questions',
    heading: 'A few things worth clarifying before we start',
    item1Question: 'Can I get in touch without a finished brief?',
    item1Answer: 'Yes. Tell me about the business, the audience, and what the website needs to achieve. I’ll ask a few focused questions and help turn the requirements into a clear structure.',
    item2Question: 'What if I don’t have a design or finished copy?',
    item2Answer: 'We can start with the structure and visual direction. Before development begins, we’ll define which materials are needed and what is still missing.',
    item3Question: 'Do you only work with React?',
    item3Answer: 'No. I use React when a project needs complex states, data, or multiple screens. For a compact website, HTML, CSS, and JavaScript may be the smarter choice.',
    item4Question: 'How is the price calculated?',
    item4Answer: 'It depends on the number and type of pages, how complete the content is, the user flows, and any integrations. Once we review the task, I can define a clear scope of work.',
    item5Question: 'Can you improve an existing website?',
    item5Answer: 'Yes. I’ll first review the current structure and code. Then we can decide what should stay, what needs fixing, and what would be better rebuilt.',
    item6Question: 'What happens after launch?',
    item6Answer: 'I check the production version and hand over the source files in a clear structure. Ongoing development or separate support can be arranged if needed.',
    item7Question: 'Can you guarantee enquiries?',
    item7Answer: 'Enquiry volume depends on more than the website—it is also shaped by the offer, traffic, and sales process. My role is to communicate the value clearly and make the path to contact easy.'
  },
  contact: {
    kicker: '06 / Contact',
    heading: 'Need a website that helps people take the next step?',
    intro: 'Tell me what the business does, what you already have, and what action visitors should take. There is no need to prepare a long technical brief.',
    cta: 'Discuss a project <span aria-hidden="true">↗</span>',
    formTitle: 'Or send a short brief',
    emailSubject: 'New Portfolio Enquiry for Pavel Orekhov',
    nameLabel: 'How should I address you?',
    namePlaceholder: 'Your name',
    contactLabel: 'Where should I reply?',
    contactPlaceholder: 'Telegram or email',
    formatLabel: 'What are you looking for?',
    formatUndecided: 'Not sure yet',
    formatNewSite: 'Website from scratch',
    formatCatalog: 'Catalog or React SPA',
    formatDesign: 'Development from a design',
    formatImprovement: 'Website improvements',
    projectLabel: 'About the project',
    projectPlaceholder: 'What does the business do? What do you already have? What should visitors do on the website?',
    consent: 'I agree to the use of my data for responding to this enquiry.',
    consentDetails: 'Details',
    submit: 'Send enquiry <span aria-hidden="true">↗</span>',
    telegram: 'Continue in Telegram',
    privacyNote: 'Your contact details are used only to reply about the project. No newsletters.'
  },
  footer: {
    topAria: 'Back to top',
    text: 'Frontend development built around the challenge, the interface, and clean code.',
    privacy: 'Privacy',
    copyright: 'Pavel Orekhov'
  },
  dialogs: {
    closeCase: 'Close case study',
    caseTitle: 'Project Case Study',
    close: 'Close',
    document: 'Document'
  },
  privacy: {
    title: 'Personal Data Processing',
    paragraph1: 'The information submitted through the form—your name, contact details, selected project type, and project description—is used only to respond to your enquiry and discuss the project. It is not published, shared with advertising services, or used for newsletters.',
    paragraph2Before: 'The form is sent through FormSubmit to',
    paragraph2After: 'If you prefer not to use the form, contact me directly through Telegram or email.',
    paragraph3: 'You can withdraw your consent or request deletion of your enquiry through the same email address.'
  }
};

const runtime = {
  ru: {
    menuOpen: 'Открыть меню',
    menuClose: 'Закрыть меню',
    switchEnglish: 'Переключить сайт на английский',
    switchRussian: 'Переключить сайт на русский',
    openWebsite: 'Открыть сайт',
    challenge: '01 / Задача',
    solution: '02 / Решение',
    outcome: '03 / Результат',
    myRole: 'Моя роль',
    viewCode: 'Смотреть код',
    requiredFields: 'Проверьте обязательные поля.',
    sending: 'Отправляю заявку на email…',
    sent: 'Спасибо! Заявка отправлена — отвечу по указанному контакту.',
    sentToast: 'Заявка отправлена.',
    sendError: 'Не получилось отправить форму. Напишите мне в Telegram или на email.',
    sendErrorToast: 'Форма временно недоступна — контакты рядом.',
    fillFirst: 'Сначала заполните обязательные поля.',
    telegramGreeting: 'Здравствуйте! Хочу обсудить проект.',
    telegramName: 'Имя',
    telegramContact: 'Контакт',
    telegramFormat: 'Формат',
    telegramTask: 'Задача',
    copiedToast: 'Описание скопировано. Вставьте его в Telegram.',
    copiedStatus: 'Текст заявки скопирован — открываю Telegram.',
    telegramFallbackToast: 'Открываю Telegram. Описание можно скопировать из формы.',
    telegramFallbackStatus: 'Открываю Telegram.',
    fieldEmpty: 'Заполните это поле.',
    contactInvalid: 'Укажите email, @username в Telegram или телефон.',
    greetingIdle: 'Давайте познакомимся',
    greetingLoading: 'Подключаю голос…',
    greetingSpeaking: 'Приветствие',
    greetingSpeakingTts: 'Озвучивает синтезатор браузера',
    greetingStopped: 'Приветствие остановлено',
    greetingEnded: 'Приветствие завершено',
    greetingNoVoice: 'Голос недоступен — приветствие текстом',
    greetingAudioError: 'Звук не включился — приветствие текстом',
    greetingCaption: 'Можно и без звука',
    greetingButton: {
      play: 'Включить приветствие',
      stop: 'Остановить',
      replay: 'Повторить приветствие'
    }
  },
  en: {
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    switchEnglish: 'Switch site language to English',
    switchRussian: 'Switch site language to Russian',
    openWebsite: 'View Website',
    challenge: '01 / Challenge',
    solution: '02 / Solution',
    outcome: '03 / Outcome',
    myRole: 'My Role',
    viewCode: 'View Source',
    requiredFields: 'Please complete the required fields.',
    sending: 'Sending your enquiry…',
    sent: 'Thank you! Your enquiry has been sent. I’ll reply using the contact details you provided.',
    sentToast: 'Enquiry sent.',
    sendError: 'The form could not be sent. Please contact me through Telegram or email.',
    sendErrorToast: 'The form is temporarily unavailable—direct contact options are nearby.',
    fillFirst: 'Please complete the required fields first.',
    telegramGreeting: 'Hello! I’d like to discuss a project.',
    telegramName: 'Name',
    telegramContact: 'Contact',
    telegramFormat: 'Project type',
    telegramTask: 'Project',
    copiedToast: 'The project details were copied. Paste them into Telegram.',
    copiedStatus: 'The project details were copied—opening Telegram.',
    telegramFallbackToast: 'Opening Telegram. You can copy the details from the form.',
    telegramFallbackStatus: 'Opening Telegram.',
    fieldEmpty: 'Please fill in this field.',
    contactInvalid: 'Enter an email, a Telegram @username, or a phone number.',
    greetingIdle: 'Let’s get acquainted',
    greetingLoading: 'Preparing the voice…',
    greetingSpeaking: 'Greeting',
    greetingSpeakingTts: 'Voiced by the browser’s speech synthesizer',
    greetingStopped: 'Greeting stopped',
    greetingEnded: 'Greeting finished',
    greetingNoVoice: 'Voice unavailable — greeting as text',
    greetingAudioError: 'Sound didn’t start — greeting as text',
    greetingCaption: 'Works without sound, too',
    greetingButton: {
      play: 'Play greeting',
      stop: 'Stop',
      replay: 'Replay greeting'
    }
  }
};

const translationTargets = [
  { selector: '[data-i18n]', key: 'i18n', property: 'textContent' },
  { selector: '[data-i18n-html]', key: 'i18nHtml', property: 'innerHTML' },
  { selector: '[data-i18n-content]', key: 'i18nContent', attribute: 'content' },
  { selector: '[data-i18n-aria]', key: 'i18nAria', attribute: 'aria-label' },
  { selector: '[data-i18n-alt]', key: 'i18nAlt', attribute: 'alt' },
  { selector: '[data-i18n-placeholder]', key: 'i18nPlaceholder', attribute: 'placeholder' },
  { selector: '[data-i18n-value]', key: 'i18nValue', attribute: 'value' }
];

function valueAt(source, path) {
  return path.split('.').reduce((value, part) => value?.[part], source);
}

function getInitialLanguage() {
  const url = new URL(window.location.href);

  if (url.searchParams.has('lang')) {
    const requested = url.searchParams.get('lang');
    return SUPPORTED_LANGUAGES.includes(requested) ? requested : 'ru';
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(saved)) return saved;
  } catch {
    // The site still works when storage is disabled.
  }

  return 'ru';
}

function updateAddress(language) {
  const url = new URL(window.location.href);

  if (language === 'en') {
    url.searchParams.set('lang', 'en');
  } else {
    url.searchParams.delete('lang');
  }

  try {
    window.history.replaceState(window.history.state, '', url.href);
  } catch {
    // Some local preview environments do not allow file URL replacement.
  }
}

function rememberLanguage(language) {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // A blocked localStorage should not block the language switch.
  }
}

function createSchemaController() {
  const personNode = document.querySelector('[data-schema-person]');
  const projectsNode = document.querySelector('[data-schema-projects]');
  const personSource = personNode?.textContent ?? '';
  const projectsSource = projectsNode?.textContent ?? '';

  function restore() {
    if (personNode) personNode.textContent = personSource;
    if (projectsNode) projectsNode.textContent = projectsSource;
  }

  function translate() {
    if (personNode) {
      const person = JSON.parse(personSource);
      person.name = 'Pavel Orekhov';
      person.alternateName = 'Павел Орехов';
      person.jobTitle = 'Frontend Developer';
      personNode.textContent = JSON.stringify(person, null, 2);
    }

    if (projectsNode) {
      const projectList = JSON.parse(projectsSource);
      const descriptions = [
        'A commercial React SPA showcasing spare parts and vehicles.',
        'A website for a Moscow car wash and detailing studio network with online booking and a 3D service garage.',
        'A React SPA for an independent BMW service center.',
        'A full-stack project with server-side APIs, an email enquiry flow, and an AI workflow.',
        'A technical product catalog built with vanilla JavaScript.'
      ];

      projectList.name = 'Selected Work by Pavel Orekhov';
      projectList.itemListElement.forEach((entry, index) => {
        if (index === 0) entry.item.name = 'MB Kuzbass';
        entry.item.description = descriptions[index];
        entry.item.inLanguage = 'en';
      });
      projectsNode.textContent = JSON.stringify(projectList, null, 2);
    }
  }

  return (language) => {
    if (language === 'en') translate();
    else restore();
  };
}

export function createI18n() {
  const toggles = [...document.querySelectorAll('[data-language-toggle]')];
  const subscribers = new Set();
  const records = [];
  const updateSchema = createSchemaController();
  let currentLanguage = getInitialLanguage();

  translationTargets.forEach((target) => {
    document.querySelectorAll(target.selector).forEach((element) => {
      records.push({
        element,
        translationKey: element.dataset[target.key],
        property: target.property,
        attribute: target.attribute,
        original: target.attribute
          ? element.getAttribute(target.attribute)
          : element[target.property]
      });
    });
  });

  function t(key) {
    const translated = valueAt(runtime[currentLanguage], key);
    if (translated !== undefined) return translated;

    const staticTranslation = currentLanguage === 'en' ? valueAt(english, key) : undefined;
    return staticTranslation ?? key;
  }

  function applyRecords(language) {
    records.forEach((record) => {
      const translated = language === 'en' ? valueAt(english, record.translationKey) : record.original;
      if (translated === undefined) return;

      if (record.attribute) {
        record.element.setAttribute(record.attribute, translated);
      } else {
        record.element[record.property] = translated;
      }
    });
  }

  function updateToggle(language) {
    const isEnglish = language === 'en';
    const label = isEnglish ? runtime.en.switchRussian : runtime.ru.switchEnglish;

    toggles.forEach((toggle) => {
      toggle.querySelector('[data-language-current]').textContent = isEnglish ? 'EN' : 'RU';
      toggle.querySelector('[data-language-next]').textContent = isEnglish ? 'RU' : 'EN';
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('title', label);
      toggle.hidden = false;
    });
  }

  function applyLanguage(language, options = {}) {
    const nextLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'ru';
    const { persist = true, syncAddress = true, announce = true } = options;

    currentLanguage = nextLanguage;
    document.documentElement.lang = nextLanguage;
    applyRecords(nextLanguage);
    updateSchema(nextLanguage);
    updateToggle(nextLanguage);

    if (persist) rememberLanguage(nextLanguage);
    if (syncAddress) updateAddress(nextLanguage);

    if (announce) {
      subscribers.forEach((subscriber) => subscriber(nextLanguage));
      document.dispatchEvent(new CustomEvent('languagechange', {
        detail: { language: nextLanguage }
      }));
    }
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      applyLanguage(currentLanguage === 'ru' ? 'en' : 'ru');
    });
  });

  applyLanguage(currentLanguage, { announce: false });

  return {
    get language() {
      return currentLanguage;
    },
    t,
    setLanguage: applyLanguage,
    syncFromAddress() {
      const requested = new URL(window.location.href).searchParams.get('lang');
      const addressLanguage = requested === 'en' ? 'en' : 'ru';

      if (addressLanguage !== currentLanguage) {
        applyLanguage(addressLanguage, { syncAddress: false });
      }
    },
    subscribe(callback) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    }
  };
}
