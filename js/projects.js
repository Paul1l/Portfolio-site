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
