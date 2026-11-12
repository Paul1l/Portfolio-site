/**
 * Английские тексты для статичной разметки.
 *
 * Русский текст живёт прямо в index.html. Элемент с атрибутом
 * data-i18n="hero.title" при переключении на английский получает строку
 * ENGLISH_DICTIONARY.hero.title. Строки с HTML (стрелка ↗ в ссылках)
 * подставляются через data-i18n-html.
 */
const ARROW_OUT = '<span aria-hidden="true">↗</span>';
const ARROW_DOWN = '<span aria-hidden="true">↓</span>';

export const ENGLISH_DICTIONARY = {
  seo: {
    title: 'Pavel Orekhov | I build websites for businesses',
    description: 'I build landing pages, catalogs and React websites. Two of them are live for clients: MB Kuzbass and MEATWASH. Message me on Telegram.',
    author: 'Pavel Orekhov',
    locale: 'en_US',
    ogDescription: 'Landing pages, catalogs and React websites. Have a look at my work and message me on Telegram.',
    ogImageAlt: 'Homepage of the MB Kuzbass website'
  },
  skipLink: 'Skip to content',
  logo: {
    ariaLabel: 'Pavel Orekhov, home',
    name: 'Pavel Orekhov'
  },
  navigation: {
    ariaLabel: 'Main menu',
    work: 'Work',
    services: 'Services',
    contact: 'Contact',
    mobileCta: `Message me ${ARROW_OUT}`
  },
  hero: {
    eyebrow: 'Frontend developer',
    title: 'I build websites for&nbsp;businesses.',
    portraitAlt: 'Portrait of Pavel Orekhov made of light dots',
    lead: 'Landing pages, catalogs, service websites. I write them in React or plain JavaScript, whichever the job needs.',
    worksLink: `See my work ${ARROW_OUT}`,
    barLabel: '01 — Introduction',
    scrollLink: `Scroll down ${ARROW_DOWN}`
  },
  work: {
    eyebrow: '02 / Work',
    title: 'Recent work',
    intro: 'Two websites are live for clients, two were built for a client and are still demos. Plus a concept and a full-stack test project. You can open all of them.',
    deckPrevious: 'Previous project',
    deckNext: 'Next project',
    openWebsite: `Open website ${ARROW_OUT}`,
    openCase: 'Details',
    githubCopy: `Copy on GitHub Pages ${ARROW_OUT}`,
    openConcept: `Open concept ${ARROW_OUT}`,
    openCode: `Open code ${ARROW_OUT}`,
    moreTitle: 'Other and older work',
    site: `Website ${ARROW_OUT}`,
    code: `Code ${ARROW_OUT}`
  },
  projects: {
    mbKuzbass: {
      type: 'Client website · 2026',
      title: 'MB Kuzbass',
      subtitle: 'Auto parts and cars from Japan',
      summary: 'The company does three things: auto parts, cars from Japan and supplies for car dismantlers. I put all of it into one React website instead of a heavy online store.'
    },
    meatwash: {
      type: 'Client website · 2026',
      subtitle: 'Car wash and detailing studios in Moscow',
      summary: 'Prices depend on the body type, and you can book either of the two studios. There are before/after sliders and a 3D garage built with three.js. The garage loads only when you press the button, so the rest of the site stays fast.'
    },
    kirpich: {
      type: 'For a client · demo · 2026',
      title: 'Kirpichny Trest',
      subtitle: 'Building materials supplier',
      summary: '10 material categories and 4 services, each with its own page. On the homepage a house builds itself from those materials as you scroll.'
    },
    smesi: {
      type: 'For a client · demo · 2026',
      title: 'Dry Mixes',
      subtitle: 'Dry mix catalog for the same Kirpichny Trest',
      summary: '134 products from Perel, Dauer, Osnovit and others, with prices and specs. You can pick a mix by the job you need it for. On the first screen the packages assemble from a cloud of particles.'
    },
    profit: {
      type: 'Concept · 2026',
      subtitle: 'My take on a homepage for a marketing agency',
      summary: 'Made it for myself, nobody ordered it. The hero video rewinds as you scroll, and there is a 3D version based on a depth map. Contacts and cases in the mockup are made up.'
    },
    reon: {
      type: 'Test project · 2026',
      subtitle: 'A form with a server and a short AI summary',
      summary: 'This one is about what happens inside, not the looks: form checks, sending an email and a task summary written by an AI model.'
    },
    lawyer: {
      title: 'Alexey Kazantsev',
      type: 'Landing page for a lawyer · 2026'
    },
    apex: {
      type: 'Concept for a rare car catalog · 2026'
    },
    dice: {
      type: 'Early work: a JavaScript game · 2024'
    },
    guitar: {
      type: 'Early work: Sass layout · 2024'
    }
  },
  services: {
    eyebrow: '03 / Services',
    title: 'What I can do',
    intro: 'First I figure out what the website is for. Then I suggest the simplest way to build it.',
    newSite: {
      title: 'A website from scratch',
      lead: 'A landing page, a service website or a small catalog.',
      text: 'I plan the sections, build it for phones and desktops, and set up the contact form and basic SEO.'
    },
    catalog: {
      title: 'A catalog or a React app',
      lead: 'When there is a lot of data and many screens.',
      text: 'Categories, search, filters, forms and talking to a server.'
    },
    fromDesign: {
      title: 'A website from your design',
      lead: 'You have a mockup, I turn it into a working website.',
      text: 'I also take care of what mockups usually skip: phones, hover states, loading and errors.'
    },
    improvement: {
      title: 'Improvements',
      lead: 'I can work on a website that is already live.',
      text: 'Fix bugs, add sections. I won’t rewrite everything without a good reason.'
    }
  },
  process: {
    title: 'How it goes',
    step1: {
      title: 'A talk',
      text: 'You tell me what you do and what the website should do. I ask questions.'
    },
    step2: {
      title: 'First screen',
      text: 'I show you the structure and the main screen. If something is off, we change it now while it’s quick.'
    },
    step3: {
      title: 'Building',
      text: 'I build the pages, connect the forms and test on phones and desktops.'
    },
    step4: {
      title: 'Launch',
      text: 'I publish the website and hand over the source code, so you don’t depend on me.'
    }
  },
  about: {
    eyebrow: '04 / About',
    title: 'A bit about me',
    paragraph1: 'I’ve been doing frontend since 2022. I make the whole website myself: plan the structure, design it, code it and publish it. So nothing gets lost between a designer and a developer.',
    paragraph2: 'Before that I played football for many years. That’s where I learned to keep the pace and finish what I start.',
    fact1: {
      term: 'The job comes first',
      definition: 'I find out what people should do on the website. Design and tech come after that.'
    },
    fact2: {
      term: 'Nothing extra',
      definition: 'I use React when it’s really needed. A simple landing page is fine with HTML, CSS and JavaScript.'
    },
    fact3: {
      term: 'You can check it',
      definition: 'Live websites, demos and code on GitHub. The links are above.'
    },
    githubLink: `My GitHub ${ARROW_OUT}`
  },
  faq: {
    eyebrow: '05 / Questions',
    title: 'What people usually ask',
    item1: {
      question: 'I don’t have a brief. Is that OK?',
      answer: 'Yes. Tell me what you do and what you expect from the website. I’ll ask questions and turn the answers into a plan myself.'
    },
    item2: {
      question: 'No design and no copy. Where do we start?',
      answer: 'With the structure. Along the way it becomes clear what text and photos are missing, and I’ll tell you before development starts.'
    },
    item3: {
      question: 'Do you only work with React?',
      answer: 'No. A landing page usually doesn’t need React. HTML, CSS and JavaScript are enough. I use React when a website has a lot of data and screens.'
    },
    item4: {
      question: 'How much does it cost?',
      answer: 'It depends on the number of pages, whether the copy is ready and what the website has to do. I’ll give you a price once we understand the task.'
    },
    item5: {
      question: 'Can you improve a website I already have?',
      answer: 'Yes. First I look at the code. Then I tell you what to keep, what to fix and what is easier to redo.'
    },
    item6: {
      question: 'What happens after launch?',
      answer: 'I check that everything works on the real domain and hand over the source code. If you need support after that, we agree on it separately.'
    },
    item7: {
      question: 'Do you guarantee leads?',
      answer: 'No. Leads also depend on ads, prices and how you reply to customers. What I give you is a clear website where the contact button is easy to find.'
    }
  },
  contact: {
    eyebrow: '06 / Contact',
    title: 'Need a website? Write to me.',
    intro: 'A few words about what you do and what you want from the website. That’s enough to start. No brief needed.',
    telegramLink: `Message me on Telegram ${ARROW_OUT}`
  },
  form: {
    title: 'Or leave a request here',
    emailSubject: 'Request from the portfolio website',
    nameLabel: 'Your name',
    namePlaceholder: 'Name',
    contactLabel: 'Where should I reply?',
    contactPlaceholder: 'Telegram, email or phone',
    formatLabel: 'What do you need?',
    formatUndecided: 'Not sure yet',
    formatNewSite: 'A website from scratch',
    formatCatalog: 'A catalog or a React app',
    formatFromDesign: 'A website from my design',
    formatImprovement: 'Improve my website',
    messageLabel: 'The task in a few words',
    messagePlaceholder: 'What you do, what you already have, what the website should do',
    consent: 'I agree that my data is used to reply to me.',
    consentDetails: 'Details',
    submit: `Send ${ARROW_OUT}`,
    telegramButton: 'Send via Telegram',
    note: 'I need your contact only to reply. No newsletters.'
  },
  footer: {
    topAriaLabel: 'Back to top',
    text: 'Frontend developer. I build websites for businesses.',
    privacy: 'About your data',
    copyright: 'Pavel Orekhov'
  },
  dialogs: {
    close: 'Close',
    caseTitle: 'Case study'
  },
  privacy: {
    eyebrow: 'About your data',
    title: 'What happens to the data from the form',
    paragraph1: 'Your name, contact, the option you picked and the task description are used only to reply to you and talk about the project. I don’t publish them, don’t hand them to ad services and don’t send newsletters.',
    paragraph2Before: 'The form goes through the FormSubmit service to my email',
    paragraph2After: 'If you’d rather not use the form, write to me on Telegram or by email directly.',
    paragraph3: 'Changed your mind? Write to the same email and I’ll delete your message.'
  }
};
