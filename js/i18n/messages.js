/**
 * Сообщения, которые скрипты показывают на лету: подписи кнопок, статусы
 * формы, уведомления. В разметке их нет, поэтому оба языка лежат здесь.
 * Ключ берётся через translator.translate('form.sending').
 */
export const MESSAGES = {
  ru: {
    menu: {
      open: 'Открыть меню',
      close: 'Закрыть меню'
    },
    languageSwitch: {
      toEnglish: 'Переключить сайт на английский',
      toRussian: 'Переключить сайт на русский'
    },
    captions: {
      pause: 'Остановить субтитры',
      play: 'Продолжить субтитры',
      replay: 'Показать субтитры ещё раз'
    },
    caseStudy: {
      openWebsite: 'Открыть сайт',
      openCode: 'Посмотреть код',
      challenge: '01 / Задача',
      solution: '02 / Что сделал',
      result: '03 / Что получилось',
      role: 'Что делал я'
    },
    form: {
      fieldEmpty: 'Это поле нужно заполнить.',
      contactInvalid: 'Нужен email, ник в Telegram (@username) или телефон.',
      checkFields: 'Что-то не заполнено. Проверьте поля и галочку согласия.',
      fillFirst: 'Сначала заполните поля и отметьте согласие.',
      sending: 'Отправляю…',
      sent: 'Готово, заявка у меня. Отвечу на контакт, который вы оставили.',
      sendError: 'Не отправилось. Напишите мне в Telegram или на почту.',
      copied: 'Скопировал текст заявки и открываю Telegram.',
      telegramOpened: 'Открываю Telegram.',
      telegramGreeting: 'Здравствуйте! Хочу обсудить сайт.',
      telegramName: 'Имя',
      telegramContact: 'Контакт',
      telegramFormat: 'Что нужно',
      telegramTask: 'Задача'
    },
    toast: {
      sent: 'Отправлено.',
      sendError: 'Форма не сработала. Напишите напрямую.',
      copied: 'Текст заявки скопирован. Вставьте его в чат.',
      telegramOpened: 'Открываю Telegram. Текст можно скопировать из формы.'
    }
  },
  en: {
    menu: {
      open: 'Open menu',
      close: 'Close menu'
    },
    languageSwitch: {
      toEnglish: 'Switch the website to English',
      toRussian: 'Switch the website to Russian'
    },
    captions: {
      pause: 'Pause captions',
      play: 'Resume captions',
      replay: 'Show captions again'
    },
    caseStudy: {
      openWebsite: 'Open website',
      openCode: 'View code',
      challenge: '01 / The task',
      solution: '02 / What I did',
      result: '03 / How it turned out',
      role: 'My part'
    },
    form: {
      fieldEmpty: 'Please fill in this field.',
      contactInvalid: 'I need an email, a Telegram @username or a phone number.',
      checkFields: 'Something is missing. Check the fields and the consent box.',
      fillFirst: 'Fill in the fields and tick the consent box first.',
      sending: 'Sending…',
      sent: 'Done, I’ve got your request. I’ll reply to the contact you left.',
      sendError: 'It didn’t go through. Write to me on Telegram or by email.',
      copied: 'I copied your request and I’m opening Telegram.',
      telegramOpened: 'Opening Telegram.',
      telegramGreeting: 'Hi! I’d like to talk about a website.',
      telegramName: 'Name',
      telegramContact: 'Contact',
      telegramFormat: 'What I need',
      telegramTask: 'Task'
    },
    toast: {
      sent: 'Sent.',
      sendError: 'The form didn’t work. Please write to me directly.',
      copied: 'Request copied. Paste it into the chat.',
      telegramOpened: 'Opening Telegram. You can copy the text from the form.'
    }
  }
};
