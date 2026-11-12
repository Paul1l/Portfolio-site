/**
 * Перевод разметки для поисковиков (JSON-LD в конце index.html).
 * Русская версия — исходный текст скриптов, английская собирается из неё.
 */

const ENGLISH_PROJECT_DESCRIPTIONS = [
  'A React website for a shop selling auto parts and cars from Japan.',
  'A website for car wash and detailing studios in Moscow: prices by body type, online booking and a 3D garage.',
  'A full-stack test project: a form, server functions, an email and an AI summary of the request.'
];

/**
 * Готовит функцию, которая переключает язык JSON-LD на странице.
 *
 * @returns {(language: string) => void} Функция смены языка.
 */
export function createStructuredDataTranslator() {
  const personScript = document.querySelector('[data-schema-person]');
  const projectsScript = document.querySelector('[data-schema-projects]');
  const originalPersonJson = personScript?.textContent ?? '';
  const originalProjectsJson = projectsScript?.textContent ?? '';

  function restoreRussian() {
    if (personScript) personScript.textContent = originalPersonJson;
    if (projectsScript) projectsScript.textContent = originalProjectsJson;
  }

  function applyEnglish() {
    if (personScript) {
      const person = JSON.parse(originalPersonJson);
      person.name = 'Pavel Orekhov';
      person.alternateName = 'Павел Орехов';
      person.jobTitle = 'Frontend developer';
      personScript.textContent = JSON.stringify(person, null, 2);
    }

    if (projectsScript) {
      const projectList = JSON.parse(originalProjectsJson);
      projectList.name = 'Work by Pavel Orekhov';
      projectList.itemListElement.forEach((listItem, index) => {
        if (index === 0) listItem.item.name = 'MB Kuzbass';
        listItem.item.description = ENGLISH_PROJECT_DESCRIPTIONS[index];
        listItem.item.inLanguage = 'en';
      });
      projectsScript.textContent = JSON.stringify(projectList, null, 2);
    }
  }

  return (language) => {
    if (language === 'en') applyEnglish();
    else restoreRussian();
  };
}
