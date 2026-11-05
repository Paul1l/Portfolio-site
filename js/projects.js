// Данные проектов живут отдельно от разметки.
// Так проще менять порядок, тексты и ссылки, не трогая логику галереи.
export const projects = [
  {
    slug: 'mb-kuzbass',
    title: 'МБ Кузбасс',
    subtitle: 'Коммерческая витрина запчастей и автомобилей',
    year: '2026',
    type: 'Commercial React SPA',
    categories: ['commercial', 'spa'],
    image: 'assets/projects/mb-kuzbass.jpg',
    imageAlt: 'Первый экран коммерческого сайта МБ Кузбасс',
    summary:
      'Действующий сайт на собственном домене: каталог запчастей, автомобили с аукционов, отзывы и быстрые сценарии связи.',
    challenge:
      'У бизнеса три разных направления — запчасти, автомобили из Японии и поставки для авторазборов. Их нужно было собрать в одну понятную витрину, не превращая страницу в перегруженный интернет-магазин.',
    solution:
      'Собрал React SPA с внутренними страницами каталога, ручным слайдером автомобилей, заявкой через мессенджеры и отдельной логикой согласия на аналитику. Подготовил SEO, PWA-файлы, error-страницы и структуру для дальнейшего развития каталога.',
    result:
      'Сайт опубликован на mb-kuzbass.ru и используется как основная цифровая витрина компании.',
    role: 'Структура · UI · Frontend · контент · запуск',
    stack: ['React', 'Vite', 'SCSS', 'PWA', 'SEO'],
    live: 'https://mb-kuzbass.ru/',
    code: 'https://github.com/Paul1l/MB_Kuzbass',
    featured: true
  },
  {
    slug: 'meatwash',
    title: 'MEATWASH',
    subtitle: 'Сайт сети студий мойки и детейлинга в Москве',
    year: '2026',
    type: 'Commercial website',
    categories: ['commercial'],
    image: 'assets/projects/meatwash.jpg',
    imageAlt: 'Первый экран сайта MEATWASH',
    summary:
      'Действующий сайт на meatwash.ru: услуги и цены по типу кузова, онлайн-запись в одну из двух студий, «До и после» и 3D-гараж услуг.',
    challenge:
      'Сайт сети из двух студий должен вести к записи в нужный филиал и показывать цены по типу кузова, а интерактивный 3D не должен замедлять обычный просмотр.',
    solution:
      'Статические страницы собираются из общих частей; запись по филиалам, каталог услуг с ценами по типу кузова и шторки «До и после». 3D-гараж (three.js, модель Porsche 930 Turbo) загружается только по кнопке: камера показывает деталь работы, итог считается по ценам каталога.',
    result:
      'Сайт работает на meatwash.ru; копия на GitHub Pages обновляется при каждом слиянии в main.',
    role: 'Frontend · запись по филиалам · 3D-гараж · выкладка',
    stack: ['HTML', 'CSS', 'JavaScript', 'three.js', 'GitHub Actions'],
    live: 'https://meatwash.ru/',
    code: 'https://github.com/Paul1l/MeatWash-v3.0'
  },
  {
    slug: 'kirpich-brand',
    title: 'Кирпичный трест',
    subtitle: 'Сайт поставщика строительных материалов и услуг',
    year: '2026',
    type: 'Client project / Demo',
    categories: ['interface'],
    image: 'assets/projects/kirpich-brand.jpg',
    imageAlt: 'Первый экран сайта «Кирпичный трест»',
    summary:
      'Сайт поставщика из Москвы: 10 направлений материалов и 4 услуги, производители и шоу-румы.',
    challenge:
      'Собрать на одном сайте десять направлений материалов и четыре услуги так, чтобы у каждого была своя понятная страница.',
    solution:
      'Статический сайт на Astro и TypeScript: 19 страниц, данные направлений вынесены в отдельные файлы. На главной — каталог «стопкой карточек» и сцена, где при прокрутке дом собирается из материалов компании.',
    result:
      'Демо-версия опубликована на Vercel и закрыта от индексации до запуска.',
    role: 'UI · Frontend · анимация',
    stack: ['Astro', 'TypeScript', 'CSS'],
    live: 'https://nikolay-brand-stack.vercel.app/'
  },
  {
    slug: 'smesi-sukhie',
    title: 'Сухие смеси',
    subtitle: 'Каталог сухих строительных смесей для «Кирпичного треста»',
    year: '2026',
    type: 'Client project / Demo',
    categories: ['interface'],
    image: 'assets/projects/smesi-sukhie.jpg',
    imageAlt: 'Первый экран каталога сухих смесей',
    summary:
      '134 позиции Perel, Dauer, Основит и других производителей с ценами и характеристиками, подбор смеси по задаче.',
    challenge:
      'Каталог дилера с позициями пяти производителей, где назначение и характеристики должны совпадать с данными производителей.',
    solution:
      'Astro и TypeScript; данные собраны с карточек производителей и сверены дословно (13 465 цитат, 0 расхождений). Подбор смеси по задаче («Что делаете?»), а на первом экране облако частиц собирается в 3D-витрину упаковок на three.js.',
    result:
      'Демо-версия опубликована на Vercel и закрыта от индексации до запуска.',
    role: 'Данные · UI · Frontend · 3D',
    stack: ['Astro', 'TypeScript', 'three.js', 'Python'],
    live: 'https://smesi-sukhie-hero.vercel.app/'
  },
  {
    slug: 'profit-concept',
    title: 'PROFIT',
    subtitle: 'Концепт новой главной для маркетингового агентства',
    year: '2026',
    type: 'Concept',
    categories: ['interface'],
    image: 'assets/projects/profit.jpg',
    imageAlt: 'Первый экран концепта PROFIT',
    summary:
      'Личный концепт редизайна главной страницы агентства: структура и тексты услуг взяты с текущего сайта, подача сделана заново.',
    challenge:
      'Сохранить структуру и тексты услуг текущего сайта агентства, но сделать подачу заново — динамичнее и запоминающимся первым экраном.',
    solution:
      'Vite и чистый JavaScript, GSAP с ScrollTrigger и Lenis. Видео первого экрана перематывается прокруткой; в 3D-варианте фото «выдавлено» по карте глубины на Three.js. Карточки услуг с 3D-наклоном, спидометр-прогноз и бесконечная лента кейсов.',
    result:
      'Концепт опубликован на Vercel как макет для показа: контакты, клиенты и кейсы в нём демонстрационные, страница закрыта от индексации.',
    role: 'Концепт · UI · анимация · frontend',
    stack: ['Vite', 'JavaScript', 'GSAP', 'Three.js'],
    live: 'https://profit-concept.vercel.app/'
  },
  {
    slug: 'mpower-service',
    title: 'MPower Service',
    subtitle: 'SPA для независимого BMW-сервиса',
    year: '2026',
    type: 'React / Service landing',
    categories: ['spa', 'interface'],
    image: 'assets/projects/mpower.webp',
    imageAlt: 'Темный интерфейс сайта автосервиса MPower',
    summary:
      'Сервисный лендинг с сильной типографикой, понятным сценарием записи и формой, которая готовит обращение для Telegram.',
    challenge:
      'Показать техническую компетентность сервиса без стандартной автомобильной визуальной перегрузки и провести клиента от симптома к записи.',
    solution:
      'Собрал компонентный React-интерфейс, адаптивную сетку услуг, четыре этапа работы, валидацию заявки и юридические модальные окна.',
    result:
      'Готовая production-сборка для GitHub Pages с SEO-файлами и отдельными desktop/mobile-макетами.',
    role: 'UI · React-разработка · адаптив',
    stack: ['React', 'Vite', 'CSS', 'Forms'],
    live: 'https://paul1l.github.io/M_Power-service/',
    code: 'https://github.com/Paul1l/M_Power-service'
  },
  {
    slug: 'fullstack-landing',
    title: 'REON Fullstack Landing',
    subtitle: 'Форма, серверные API и AI-сценарий',
    year: '2026',
    type: 'Fullstack / Test project',
    categories: ['interface'],
    image: 'assets/projects/fullstack.jpg',
    imageAlt: 'Первый экран fullstack-лендинга',
    summary:
      'Тестовый проект, где frontend связан с серверными функциями: email-заявка, валидация и AI-summary задачи.',
    challenge:
      'Сделать форму не декоративной, а показать полный путь данных — от проверки в браузере до серверного ответа и понятного состояния интерфейса.',
    solution:
      'Разделил клиентскую и серверную логику, добавил Vercel-compatible API, Resend для писем, AI endpoint и dry-run режимы для безопасной проверки без секретных ключей.',
    result:
      'Проект можно развернуть на Vercel и протестировать локально встроенным проверочным скриптом.',
    role: 'Frontend · API · валидация · документация',
    stack: ['JavaScript', 'Node.js', 'REST API', 'Resend', 'OpenAI API'],
    code: 'https://github.com/Paul1l/Fullstack-landing'
  },
  {
    slug: 'techbearing',
    title: 'TechBearing',
    subtitle: 'Каталог технической продукции',
    year: '2026',
    type: 'Catalog / Vanilla JS',
    categories: ['interface'],
    image: 'assets/projects/techbearing.jpg',
    imageAlt: 'Интерфейс каталога TechBearing',
    summary:
      'B2B/B2C-каталог с фильтрацией, поиском, заявками и демонстрационной админкой для управления товарами.',
    challenge:
      'Уместить разные группы технической продукции в быстрый статический сайт и дать пользователю удобный подбор без backend.',
    solution:
      'Сделал каталог, поиск и фильтры на чистом JavaScript. Для демонстрации работы с данными добавил заявки, товары и админку на localStorage.',
    result:
      'Лёгкий GitHub Pages-проект без зависимостей, с юридическими страницами и сохранением пользовательских настроек.',
    role: 'Структура · UI · JavaScript',
    stack: ['HTML', 'CSS', 'JavaScript', 'localStorage'],
    live: 'https://paul1l.github.io/TechBearing/',
    code: 'https://github.com/Paul1l/TechBearing'
  },
  {
    slug: 'lawyer-landing',
    title: 'Алексей Казанцев',
    subtitle: 'Лендинг частнопрактикующего юриста',
    year: '2026',
    type: 'Landing / Professional services',
    categories: ['interface'],
    image: 'assets/projects/lawyer.jpg',
    imageAlt: 'Первый экран лендинга юриста Алексея Казанцева',
    summary:
      'Спокойный экспертный лендинг: практика, консультация, подготовка к встрече, FAQ и юридические документы.',
    challenge:
      'Собрать доверительную подачу без громких обещаний и сохранить ясную иерархию на большом количестве смысловых блоков.',
    solution:
      'Разработал адаптивную структуру, светлую и тёмную темы, сценарий записи, FAQ, cookie-согласие и полный набор технических SEO-файлов.',
    result:
      'Готовый к публикации статический сайт, который легко передать и поддерживать без сборщика.',
    role: 'UI · вёрстка · JavaScript · адаптив',
    stack: ['HTML', 'SCSS', 'JavaScript', 'SEO'],
    live: 'https://paul1l.github.io/lawyer-landing/',
    code: 'https://github.com/Paul1l/lawyer-landing'
  },
  {
    slug: 'apex-select',
    title: 'Apex Select',
    subtitle: 'Editorial watchlist редких автомобилей',
    year: '2026',
    type: 'Editorial interface / Concept',
    categories: ['interface'],
    image: 'assets/projects/apex-select.jpg',
    imageAlt: 'Темный editorial-интерфейс Apex Select',
    summary:
      'Англоязычный концепт с нестандартной арт-дирекцией, фильтрами автомобилей и системой визуальных risk-notes.',
    challenge:
      'Отойти от шаблонной сетки автокаталога и сделать интерфейс похожим на рабочий закрытый desk, где важны документы и риски.',
    solution:
      'Построил асимметричную editorial-сетку, категории, scroll-reveal, мобильное меню и локальную валидацию брифа на чистом JavaScript.',
    result:
      'Самостоятельный визуальный концепт, опубликованный на GitHub Pages без фреймворков.',
    role: 'Арт-направление · UI · frontend',
    stack: ['HTML', 'SCSS', 'JavaScript'],
    live: 'https://paul1l.github.io/Apex-Select/',
    code: 'https://github.com/Paul1l/Apex-Select'
  }
];

// Переводы хранятся рядом с данными, но отдельно от русской версии.
// Благодаря этому исходные карточки остаются понятным вариантом по умолчанию.
const projectTranslations = {
  en: {
    'mb-kuzbass': {
      title: 'MB Kuzbass',
      subtitle: 'Commercial Showcase for Auto Parts and Vehicles',
      type: 'Commercial React SPA',
      imageAlt: 'Hero section of the MB Kuzbass commercial website',
      summary:
        'A live website on its own domain: an auto parts catalog, auction vehicles, customer reviews, and quick ways to get in touch.',
      challenge:
        'The business covers three distinct lines: auto parts, vehicles from Japan, and supplies for dismantlers. They needed to work as one clear storefront without turning the page into an overloaded online shop.',
      solution:
        'I built a React SPA with internal catalog pages, a custom vehicle slider, enquiries through messaging apps, and separate analytics consent logic. I also prepared the SEO and PWA files, error pages, and a structure that can support future catalog growth.',
      result:
        'The website is live at mb-kuzbass.ru and serves as the company’s main digital storefront.',
      role: 'Structure · UI · Frontend · Content · Launch'
    },
    'meatwash': {
      title: 'MEATWASH',
      subtitle: 'Website for a Moscow Car Wash and Detailing Studio Network',
      type: 'Commercial Website',
      imageAlt: 'Hero section of the MEATWASH website',
      summary:
        'A live website at meatwash.ru: services and prices by body type, online booking at one of two studios, before-and-after comparisons, and a 3D service garage.',
      challenge:
        'A two-studio network needed a website that leads to booking at the right location and shows prices by body type, while interactive 3D must not slow down regular browsing.',
      solution:
        'Static pages assembled from shared partials; per-location booking, a service catalog with body-type pricing, and before-and-after sliders. The 3D garage (three.js, a Porsche 930 Turbo model) loads only on request: the camera highlights the area of work and the total is calculated from catalog prices.',
      result:
        'The website is live at meatwash.ru; a GitHub Pages copy updates on every merge into main.',
      role: 'Frontend · Location Booking · 3D Garage · Deployment'
    },
    'kirpich-brand': {
      title: 'Kirpichny Trest',
      subtitle: 'Website for a Building Materials and Services Supplier',
      type: 'Client Project / Demo',
      imageAlt: 'Hero section of the Kirpichny Trest website',
      summary:
        'A Moscow supplier website: 10 material categories and 4 services, manufacturers, and showrooms.',
      challenge:
        'Bring ten material categories and four services together on one website, each with its own clear page.',
      solution:
        'A static Astro and TypeScript website with 19 pages and category data kept in separate files. The homepage features a stacked-card catalog and a scroll scene where a house assembles from the materials the company sells.',
      result:
        'The demo is published on Vercel and kept out of search indexing until launch.',
      role: 'UI · Frontend · Animation'
    },
    'smesi-sukhie': {
      title: 'Dry Mixes',
      subtitle: 'Dry Building Mix Catalog for Kirpichny Trest',
      type: 'Client Project / Demo',
      imageAlt: 'Hero section of the dry mix catalog',
      summary:
        '134 products from Perel, Dauer, Osnovit, and other manufacturers with prices and specifications, plus a task-based product finder.',
      challenge:
        'A dealer catalog with products from five manufacturers, where purposes and specifications must match the manufacturers’ data.',
      solution:
        'Astro and TypeScript; data collected from manufacturer product pages and verified verbatim (13,465 quotes, 0 mismatches). A task-based finder, and a hero where a particle cloud assembles into a 3D package showcase built with three.js.',
      result:
        'The demo is published on Vercel and kept out of search indexing until launch.',
      role: 'Data · UI · Frontend · 3D'
    },
    'profit-concept': {
      title: 'PROFIT',
      subtitle: 'Homepage Concept for a Marketing Agency',
      type: 'Concept',
      imageAlt: 'Hero section of the PROFIT concept',
      summary:
        'A personal redesign concept for an agency homepage: the service structure and copy come from the current website, the presentation is new.',
      challenge:
        'Keep the structure and service copy of the agency’s current website while reimagining the presentation with more energy and a memorable first screen.',
      solution:
        'Vite and vanilla JavaScript with GSAP, ScrollTrigger, and Lenis. The hero video scrubs with scrolling; a 3D variant extrudes the photo along a depth map with Three.js. Service cards tilt in 3D, plus a speedometer forecast and an endless case carousel.',
      result:
        'The concept is published on Vercel as a showcase mockup: contacts, clients, and cases are placeholders, and the page is kept out of search indexing.',
      role: 'Concept · UI · Animation · Frontend'
    },
    'mpower-service': {
      title: 'MPower Service',
      subtitle: 'SPA for an Independent BMW Service Center',
      type: 'React / Service Landing Page',
      imageAlt: 'Dark interface of the MPower auto service website',
      summary:
        'A service landing page with strong typography, a clear booking flow, and a form that prepares an enquiry for Telegram.',
      challenge:
        'Present the service center’s technical expertise without the visual clutter common to automotive websites, and guide a customer from a symptom to a booking.',
      solution:
        'I built a component-based React interface, a responsive service grid, a four-step workflow, enquiry validation, and legal modal dialogs.',
      result:
        'A production-ready GitHub Pages build with SEO files and dedicated desktop and mobile layouts.',
      role: 'UI · React Development · Responsive Design'
    },
    'fullstack-landing': {
      title: 'REON Fullstack Landing',
      subtitle: 'Form, Server-side APIs, and an AI Workflow',
      type: 'Full-stack / Test Project',
      imageAlt: 'Hero section of the REON full-stack landing page',
      summary:
        'A test project where the frontend works with server-side functions: email enquiries, validation, and an AI-generated task summary.',
      challenge:
        'Make the form functional rather than decorative and show the complete data flow—from browser validation to the server response and a clear interface state.',
      solution:
        'I separated the client and server logic, added a Vercel-compatible API, Resend for email, an AI endpoint, and dry-run modes for safe testing without secret keys.',
      result:
        'The project can be deployed to Vercel and tested locally with its built-in verification script.',
      role: 'Frontend · API · Validation · Documentation'
    },
    techbearing: {
      title: 'TechBearing',
      subtitle: 'Technical Product Catalog',
      type: 'Catalog / Vanilla JavaScript',
      imageAlt: 'TechBearing catalog interface',
      summary:
        'A B2B/B2C catalog with filters, search, enquiries, and a demo admin area for managing products.',
      challenge:
        'Fit several groups of technical products into a fast static website and give users a convenient way to find the right item without a backend.',
      solution:
        'I built the catalog, search, and filters in vanilla JavaScript. To demonstrate data handling, I added enquiries, product management, and a localStorage-based admin area.',
      result:
        'A lightweight, dependency-free GitHub Pages project with legal pages and persisted user preferences.',
      role: 'Structure · UI · JavaScript'
    },
    'lawyer-landing': {
      title: 'Alexey Kazantsev',
      subtitle: 'Landing Page for an Independent Lawyer',
      type: 'Landing Page / Professional Services',
      imageAlt: 'Hero section of Alexey Kazantsev’s legal services landing page',
      summary:
        'A calm, expert-led landing page covering legal practice, consultation, meeting preparation, FAQs, and legal documents.',
      challenge:
        'Build trust without loud promises while preserving a clear hierarchy across a large number of content sections.',
      solution:
        'I developed a responsive structure, light and dark themes, a booking flow, FAQs, cookie consent, and a complete set of technical SEO files.',
      result:
        'A publication-ready static website that is easy to hand over and maintain without a build tool.',
      role: 'UI · Frontend Development · JavaScript · Responsive Design'
    },
    'apex-select': {
      title: 'Apex Select',
      subtitle: 'Editorial Watchlist for Rare Cars',
      type: 'Editorial Interface / Concept',
      imageAlt: 'Dark editorial interface of Apex Select',
      summary:
        'An English-language concept with distinctive art direction, vehicle filters, and a system of visual risk notes.',
      challenge:
        'Move away from a conventional vehicle catalog grid and create an interface that feels like a private working desk where documents and risks matter.',
      solution:
        'I built an asymmetric editorial grid, categories, scroll reveals, a mobile menu, and local brief validation in vanilla JavaScript.',
      result:
        'A standalone visual concept published on GitHub Pages without frameworks.',
      role: 'Art Direction · UI · Frontend'
    }
  }
};

export function localizeProject(project, language = 'ru') {
  if (!project) {
    return null;
  }

  const normalizedLanguage = language.toLowerCase().split('-')[0];
  const translation = projectTranslations[normalizedLanguage]?.[project.slug] ?? {};

  return {
    ...project,
    ...translation,
    categories: [...project.categories],
    stack: [...project.stack]
  };
}
