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
    name: 'Pavel Orekhov<br><small>frontend developer</small>'
  },
  nav: {
    aria: 'Main navigation',
    cases: 'Case Studies',
    services: 'Services',
    process: 'Process',
    faq: 'FAQ',
    about: 'About',
    contact: 'Discuss a Project <span aria-hidden="true">↗</span>'
  },
  hero: {
    status: 'Frontend Developer · Available for Projects',
    location: 'Barnaul · Remote',
    title: 'Websites for business —<span class="hero__title-line">from first impression</span>to <em>enquiry.</em>',
    lead: 'I shape the structure, build the interface and frontend, set up forms, responsive layouts, technical SEO, and deployment. Landing pages, catalogs, and React SPAs.',
    note: 'No finished brief? That’s fine — we’ll start with the goal.',
    primaryCta: 'Discuss Your Project <span aria-hidden="true">↗</span>',
    caseCta: 'MB Kuzbass Case Study <span aria-hidden="true">↓</span>',
    ownDomain: 'Live on Its Own Domain'
  },
  trust: {
    aria: 'Why clients can trust the work',
    live: 'Commercial website live on its own domain',
    experience: 'Hands-on frontend development',
    code: 'Project code available on GitHub',
    context: 'Structure, frontend, and launch — one point of contact'
  },
  case: {
    liveAria: 'Open the live MB Kuzbass website',
    heroAlt: 'MB Kuzbass website homepage',
    imageAlt: 'MB Kuzbass commercial website',
    kicker: '01 / Commercial Case Study',
    heading: 'One website.<br><em>Three lines of business.</em>',
    intro: 'MB Kuzbass brings spare parts, vehicles from Japan, and supply for auto dismantlers together in one clear digital storefront.',
    role: 'Structure · UI · Frontend · Launch',
    eyebrow: 'Live on Its Own Domain',
    title: 'MB Kuzbass',
    lead: 'The business needed to present three distinct offers without the weight of a full ecommerce store, while giving visitors a direct route to the right information and contact.',
    taskLabel: '01 / Challenge',
    task: 'Bring the company’s services and product range into one clear structure.',
    solutionLabel: '02 / Solution',
    solution: 'A React SPA with a product catalog, a vehicle showcase, and direct contact flows.',
    resultLabel: '03 / Outcome',
    result: 'The company’s primary digital storefront is live and in use.',
    openLive: 'View Live Website <span aria-hidden="true">↗</span>',
    details: 'Explore Case Study'
  },
  work: {
    kicker: 'Selected Work',
    heading: 'Different challenges.<br><em>Verifiable solutions.</em>',
    intro: 'These three projects demonstrate work with React, server-side APIs, and product catalogs. Each one links to a live result or its source code.',
    openWebsite: 'View Website <span aria-hidden="true">↗</span>',
    openCode: 'View Code <span aria-hidden="true">↗</span>',
    details: 'View Case Study'
  },
  projects: {
    mpower: {
      role: 'UI · React · Responsive',
      subtitle: 'SPA for an Independent BMW Service Center',
      summary: 'A service landing page with a clear booking journey and a form that prepares an enquiry for Telegram.',
      alt: 'Dark interface of the MPower service website',
      aria: 'View the MPower Service case study'
    },
    reon: {
      type: 'Full-stack / Test Project',
      role: 'Frontend · API · Validation',
      subtitle: 'Form, Server-side APIs, and an AI Workflow',
      summary: 'The interface connects to server-side functions: an email enquiry, validation, and an AI-generated task summary.',
      alt: 'REON full-stack landing page homepage',
      aria: 'View the REON Fullstack case study'
    },
    techbearing: {
      role: 'Structure · UI · JavaScript',
      subtitle: 'Technical Product Catalog',
      summary: 'A catalog with search, filters, enquiries, and a demo admin panel for managing products.',
      alt: 'TechBearing catalog interface',
      aria: 'View the TechBearing case study'
    }
  },
  services: {
    kicker: '02 / Ways to Work Together',
    heading: 'Right-sized for the job.<br><em>No unnecessary complexity.</em>',
    intro: 'I don’t sell technology for its own sake. First, we define what the website needs to achieve. Then I choose a solution that is powerful enough without being overbuilt.',
    scratchLabel: 'Website from Scratch',
    scratchTitle: 'A landing page, service website, or catalog—from structure to launch.',
    scratchText: 'I turn your business offer into a clear digital product: structure, visual direction, responsive interface, forms, and a solid SEO foundation.',
    scratchCta: 'Discuss a Launch ↗',
    spaLabel: 'Catalog / React SPA',
    spaTitle: 'Interfaces with data, states, and user flows.',
    spaText: 'Categories, search, filters, forms, internal screens, and API integrations—for projects that have outgrown a simple static page.',
    spaCta: 'Discuss an Interface ↗',
    designLabel: 'Development from a Design',
    designTitle: 'Your design, turned into a responsive working website.',
    designText: 'I preserve the visual idea while building component states, mobile layouts, interactions, and everything needed for launch.',
    designCta: 'Share Your Design ↗',
    improveLabel: 'Improvements and Growth',
    improveTitle: 'I can join an existing project.',
    improveText: 'I’ll understand the current codebase and improve what is holding the site back: individual sections, the mobile experience, or new user flows.',
    audit: 'Audit and fixes',
    features: 'New sections and features',
    refactor: 'Refactoring without rewriting for the sake of it',
    improveCta: 'Discuss an Improvement ↗',
    unsure: 'Not sure which option fits?',
    callout: 'Describe the task in your own words—we can define the right scope after a quick review.',
    calloutCta: 'Review My Project ↗'
  },
  process: {
    kicker: '03 / Process',
    heading: 'No black box.<br><em>Four clear stages.</em>',
    intro: 'You always know what is happening, where the project stands, and what comes next.',
    step1Title: 'Define the Challenge',
    step1Text: 'We clarify the goal, audience, offer, content, constraints, and the action visitors should take.',
    step2Title: 'Set the Direction',
    step2Text: 'I shape the structure, visual system, and opening screen before full development begins.',
    step3Title: 'Build',
    step3Text: 'Responsive layouts, interactions, real form states, and testing across different screen sizes.',
    step4Title: 'Launch',
    step4Text: 'Final checks, deployment, and a clean, well-organized source handoff.'
  },
  about: {
    kicker: '04 / Why Work With Me',
    heading: 'A focused process, without the noise.<em>Built around your business and the details.</em>',
    paragraph1: 'Clients care less about library names than a clear process, a careful launch, and a website they can continue working with. That is what I build the process around.',
    paragraph2: 'I have worked in frontend development since 2022. I keep the structure, visual system, frontend, and launch preparation in one context, so decisions do not get lost between multiple specialists.',
    personal: 'Before development, I spent many years playing football. It taught me to keep the pace, work as part of a team, and see every play through.',
    githubCta: 'Review My Code on GitHub <span aria-hidden="true">↗</span>',
    purposeTitle: 'Purpose First',
    purposeText: 'I clarify what visitors need to understand and what action the website should lead them to.',
    technologyTitle: 'Right-sized Technology',
    technologyText: 'I use React when it solves the problem—not simply to make the stack sound impressive.',
    proofTitle: 'Work You Can Verify',
    proofText: 'There is a live commercial website, published projects, and open source code.'
  },
  history: {
    kicker: 'Archive / 2024',
    title: 'The early work stays in the archive.',
    text: 'These projects show where the journey began. The commercial case study and recent work are the best reflection of my current level.',
    guitarMeta: 'HTML · Sass · Responsive Layout',
    guitarRepoAria: 'Open the Guitar repository',
    guitarCodeAria: 'View the Guitar project code',
    guitarImageAlt: 'Early Guitar landing page',
    diceMeta: 'JavaScript · DOM · Game Logic',
    diceOpenAria: 'Open the Dice game',
    diceCodeAria: 'View the Dice project code',
    diceImageAlt: 'Dice JavaScript game interface'
  },
  faq: {
    kicker: '05 / FAQ',
    heading: 'A few things worth<br><em>clarifying before we start.</em>',
    intro: 'If your question is not covered here, send it through Telegram or the short brief below.',
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
    kicker: '06 / New Project',
    heading: 'Need a website that helps people<br><em>take the next step?</em>',
    intro: 'Tell me what the business does, what you already have, and what action visitors should take. There is no need to prepare a long technical brief.',
    directQuestion: 'Prefer to start with a short message?',
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
    projectLabel: 'About the Project',
    projectPlaceholder: 'What does the business do? What do you already have? What should visitors do on the website? Do you have any materials or a preferred timeline?',
    consent: 'I agree to the use of my data for responding to this enquiry.',
    consentDetails: 'Details',
    submit: 'Discuss the Project <span aria-hidden="true">↗</span>',
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
    telegramFallbackStatus: 'Открываю Telegram.'
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
    telegramFallbackStatus: 'Opening Telegram.'
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
