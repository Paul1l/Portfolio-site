/**
 * Кейсы избранных работ — то, что открывается по кнопке «Подробнее».
 *
 * У каждой работы общие поля (картинка, стек, ссылки) и тексты на двух
 * языках в text.ru / text.en. Порядок совпадает с карточками в index.html,
 * slug — с атрибутом data-case-open у кнопки и с адресом #case/<slug>.
 * Ссылку на код показываем только там, где репозиторий открыт и мой.
 */
export const PROJECTS = [
  {
    slug: 'mb-kuzbass',
    year: '2026',
    image: 'assets/projects/mb-kuzbass.jpg',
    stack: ['React', 'Vite', 'SCSS', 'PWA', 'SEO'],
    websiteUrl: 'https://mb-kuzbass.ru/',
    codeUrl: 'https://github.com/Paul1l/MB_Kuzbass',
    text: {
      ru: {
        title: 'МБ Кузбасс',
        type: 'Коммерческий сайт на React',
        imageAlt: 'Первый экран сайта МБ Кузбасс',
        summary: 'Работающий сайт на своём домене: каталог запчастей, машины с аукционов, отзывы и быстрые способы связаться.',
        challenge: 'У компании три разных направления: запчасти, машины из Японии и поставки для авторазборов. Их нужно было показать на одном сайте и не превратить его в перегруженный интернет-магазин.',
        solution: 'Сделал сайт на React с внутренними страницами каталога, своим слайдером машин и заявками через мессенджеры. Согласие на аналитику работает отдельно. Подготовил SEO, файлы для PWA, страницы ошибок и запас на то, что каталог будет расти.',
        result: 'Сайт работает на mb-kuzbass.ru, это главная витрина компании в интернете.',
        role: 'Структура · интерфейс · фронтенд · тексты · запуск'
      },
      en: {
        title: 'MB Kuzbass',
        type: 'Client website built with React',
        imageAlt: 'Homepage of the MB Kuzbass website',
        summary: 'A live website on its own domain: an auto parts catalog, cars from auctions, reviews and quick ways to get in touch.',
        challenge: 'The company has three different lines of business: auto parts, cars from Japan and supplies for car dismantlers. They had to fit on one website without turning it into a bloated online store.',
        solution: 'I built a React website with catalog pages, my own car slider and requests through messengers. Analytics consent works separately. I also set up SEO, PWA files, error pages and room for the catalog to grow.',
        result: 'The website is live at mb-kuzbass.ru and is the company’s main storefront online.',
        role: 'Structure · interface · frontend · copy · launch'
      }
    }
  },
  {
    slug: 'meatwash',
    year: '2026',
    image: 'assets/projects/meatwash.jpg',
    stack: ['HTML', 'CSS', 'JavaScript', 'three.js', 'GitHub Actions'],
    websiteUrl: 'https://meatwash.ru/',
    codeUrl: 'https://github.com/Paul1l/MeatWash-v3.0',
    text: {
      ru: {
        title: 'MEATWASH',
        type: 'Коммерческий сайт',
        imageAlt: 'Первый экран сайта MEATWASH',
        summary: 'Работает на meatwash.ru: услуги и цены по типу кузова, запись в одну из двух студий, «до и после» и 3D-гараж.',
        challenge: 'У сети две студии. Сайт должен вести к записи в нужную, показывать цену под конкретный кузов, а 3D не должно тормозить обычный просмотр.',
        solution: 'Страницы собираются из общих кусков. Есть запись по филиалам, каталог услуг с ценами по кузову и шторки «до и после». 3D-гараж (three.js, модель Porsche 930 Turbo) загружается только по кнопке: камера показывает, где будет работа, а итог считается по ценам из каталога.',
        result: 'Сайт работает на meatwash.ru. Копия на GitHub Pages обновляется после каждого слияния в main.',
        role: 'Фронтенд · запись по филиалам · 3D-гараж · выкладка'
      },
      en: {
        title: 'MEATWASH',
        type: 'Client website',
        imageAlt: 'Homepage of the MEATWASH website',
        summary: 'Live at meatwash.ru: services and prices by body type, booking at one of two studios, before/after sliders and a 3D garage.',
        challenge: 'The network has two studios. The website has to lead people to booking the right one and show the price for their exact car, and the 3D part must not slow down normal browsing.',
        solution: 'Pages are put together from shared parts. There is booking per location, a service catalog with prices by body type and before/after sliders. The 3D garage (three.js, a Porsche 930 Turbo model) loads only when you press the button: the camera shows where the work will be done, and the total comes from the catalog prices.',
        result: 'The website is live at meatwash.ru. A copy on GitHub Pages updates after every merge into main.',
        role: 'Frontend · booking per location · 3D garage · deployment'
      }
    }
  },
  {
    slug: 'kirpich-brand',
    year: '2026',
    image: 'assets/projects/kirpich-brand.jpg',
    stack: ['Astro', 'TypeScript', 'CSS'],
    websiteUrl: 'https://nikolay-brand-stack.vercel.app/',
    text: {
      ru: {
        title: 'Кирпичный трест',
        type: 'Для клиента · демо',
        imageAlt: 'Первый экран сайта «Кирпичный трест»',
        summary: 'Сайт поставщика из Москвы: 10 направлений материалов, 4 услуги, производители и шоурумы.',
        challenge: 'Уместить десять направлений материалов и четыре услуги так, чтобы у каждого была своя понятная страница.',
        solution: 'Статический сайт на Astro и TypeScript, 19 страниц. Данные по направлениям лежат в отдельных файлах. На главной каталог «стопкой карточек» и сцена, где при прокрутке из материалов компании собирается дом.',
        result: 'Демо выложено на Vercel и закрыто от поисковиков до запуска.',
        role: 'Интерфейс · фронтенд · анимация'
      },
      en: {
        title: 'Kirpichny Trest',
        type: 'For a client · demo',
        imageAlt: 'Homepage of the Kirpichny Trest website',
        summary: 'A website for a Moscow supplier: 10 material categories, 4 services, manufacturers and showrooms.',
        challenge: 'Fit ten material categories and four services so that each one gets its own clear page.',
        solution: 'A static Astro and TypeScript website with 19 pages. The data for each category lives in its own file. The homepage has a stacked-card catalog and a scene where a house builds itself from the company’s materials as you scroll.',
        result: 'The demo is on Vercel and hidden from search engines until launch.',
        role: 'Interface · frontend · animation'
      }
    }
  },
  {
    slug: 'smesi-sukhie',
    year: '2026',
    image: 'assets/projects/smesi-sukhie.jpg',
    stack: ['Astro', 'TypeScript', 'three.js', 'Python'],
    websiteUrl: 'https://smesi-sukhie-hero.vercel.app/',
    text: {
      ru: {
        title: 'Сухие смеси',
        type: 'Для клиента · демо',
        imageAlt: 'Первый экран каталога сухих смесей',
        summary: '134 позиции от Perel, Dauer, Основит и других производителей с ценами и характеристиками. Смесь можно подобрать под задачу.',
        challenge: 'Каталог дилера с товарами пяти производителей. Назначение и характеристики должны совпадать с тем, что пишет сам производитель.',
        solution: 'Astro и TypeScript. Данные собрал с карточек производителей и сверил слово в слово: 13 465 цитат, 0 расхождений. Есть подбор по задаче («Что делаете?»), а на первом экране облако частиц собирается в 3D-витрину упаковок на three.js.',
        result: 'Демо выложено на Vercel и закрыто от поисковиков до запуска.',
        role: 'Данные · интерфейс · фронтенд · 3D'
      },
      en: {
        title: 'Dry Mixes',
        type: 'For a client · demo',
        imageAlt: 'Homepage of the dry mix catalog',
        summary: '134 products from Perel, Dauer, Osnovit and other manufacturers, with prices and specs. You can pick a mix by the job.',
        challenge: 'A dealer catalog with products from five manufacturers. What each product is for and its specs must match what the manufacturer says.',
        solution: 'Astro and TypeScript. I collected the data from the manufacturers’ product pages and checked it word for word: 13,465 quotes, 0 mismatches. There is a finder by job (“What are you doing?”), and on the first screen a cloud of particles turns into a 3D shelf of packages built with three.js.',
        result: 'The demo is on Vercel and hidden from search engines until launch.',
        role: 'Data · interface · frontend · 3D'
      }
    }
  },
  {
    slug: 'profit-concept',
    year: '2026',
    image: 'assets/projects/profit.jpg',
    stack: ['Vite', 'JavaScript', 'GSAP', 'three.js'],
    websiteUrl: 'https://profit-concept.vercel.app/',
    text: {
      ru: {
        title: 'PROFIT',
        type: 'Концепт',
        imageAlt: 'Первый экран концепта PROFIT',
        summary: 'Моя версия главной страницы агентства. Структуру и тексты услуг взял с их сайта, подачу сделал заново.',
        challenge: 'Оставить структуру и тексты услуг как есть, но сделать подачу живее, а первый экран запоминающимся.',
        solution: 'Vite и чистый JavaScript, GSAP со ScrollTrigger и Lenis. Видео первого экрана перематывается прокруткой. В 3D-варианте фото «выдавлено» по карте глубины на three.js. Ещё карточки услуг с наклоном, спидометр-прогноз и бесконечная лента кейсов.',
        result: 'Концепт лежит на Vercel как макет для показа. Контакты, клиенты и кейсы в нём выдуманные, страница закрыта от поисковиков.',
        role: 'Идея · интерфейс · анимация · фронтенд'
      },
      en: {
        title: 'PROFIT',
        type: 'Concept',
        imageAlt: 'Homepage of the PROFIT concept',
        summary: 'My version of an agency homepage. I took the structure and service copy from their website and redid the presentation.',
        challenge: 'Keep the structure and service copy as they are, but make the page livelier and the first screen memorable.',
        solution: 'Vite and plain JavaScript, GSAP with ScrollTrigger and Lenis. The hero video rewinds as you scroll. In the 3D version the photo is pushed out along a depth map with three.js. There are also tilting service cards, a speedometer forecast and an endless case carousel.',
        result: 'The concept is on Vercel as a demo mockup. Contacts, clients and cases in it are made up, and the page is hidden from search engines.',
        role: 'Idea · interface · animation · frontend'
      }
    }
  },
  {
    slug: 'fullstack-landing',
    year: '2026',
    image: 'assets/projects/fullstack.jpg',
    stack: ['JavaScript', 'Node.js', 'REST API', 'Resend', 'OpenAI API'],
    codeUrl: 'https://github.com/Paul1l/Fullstack-landing',
    text: {
      ru: {
        title: 'REON Fullstack Landing',
        type: 'Тестовый fullstack-проект',
        imageAlt: 'Первый экран fullstack-лендинга REON',
        summary: 'Тестовый проект, где фронтенд работает с серверными функциями: заявка на почту, проверка данных и короткая сводка задачи от нейросети.',
        challenge: 'Сделать форму, которая правда работает, и показать весь путь данных: от проверки в браузере до ответа сервера и понятного состояния на экране.',
        solution: 'Разделил код для браузера и для сервера. Сделал API под Vercel, письма через Resend, отдельный адрес для нейросети и режим «без отправки», чтобы всё можно было проверить без секретных ключей.',
        result: 'Проект разворачивается на Vercel, а локально проверяется встроенным скриптом.',
        role: 'Фронтенд · API · проверка данных · документация'
      },
      en: {
        title: 'REON Fullstack Landing',
        type: 'Full-stack test project',
        imageAlt: 'Homepage of the REON full-stack landing page',
        summary: 'A test project where the frontend works with server functions: a request sent by email, data checks and a short task summary from an AI model.',
        challenge: 'Make a form that actually works and show the whole path of the data: from the check in the browser to the server response and a clear state on the screen.',
        solution: 'I split the browser code from the server code. I made a Vercel API, emails through Resend, a separate endpoint for the AI model and a “don’t send” mode, so everything can be tested without secret keys.',
        result: 'The project deploys to Vercel and can be checked locally with a built-in script.',
        role: 'Frontend · API · data checks · documentation'
      }
    }
  }
];

/**
 * Находит работу по slug и возвращает её поля вместе с текстами нужного языка.
 *
 * @param {string} slug Идентификатор работы, например «meatwash».
 * @param {string} language Код языка: «ru» или «en».
 * @returns {object | null} Работа с полями title, summary и т. д. или null, если такой нет.
 */
export function getProjectBySlug(slug, language) {
  const project = PROJECTS.find((item) => item.slug === slug);
  if (!project) return null;

  const { text, ...commonFields } = project;
  return { ...commonFields, ...(text[language] ?? text.ru) };
}
