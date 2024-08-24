import moment from 'moment';

export function parseHTML(htmlContent, computerIdentifier) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const Identifier = computerIdentifier;

  function getNextSiblingTextContent(element, text) {
    const tdElements = doc.querySelectorAll(element);
    for (let i = 0; i < tdElements.length; i++) {
      if (tdElements[i].textContent.includes(text)) {
        return tdElements[i].nextElementSibling.textContent.trim();
      }
    }
    return '';
  }

  const reportNumber = getNextSiblingTextContent('td.key', '№ отчета');
  let reportDate = getNextSiblingTextContent('td.key', 'Формирование отчета');

  reportDate = moment(reportDate, 'DD.MM.YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

  const vulnerabilities = [];

  const tables = doc.querySelectorAll('.vulnerabilitiesListTbl');

  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    let error_level = '';
    rows.forEach(row => {
      const errorLevelElem = row.querySelector('td.valueMargin');
      if (errorLevelElem && errorLevelElem.textContent.includes('Уровень опасности:')) {
        error_level = errorLevelElem.textContent.replace('Уровень опасности:', '').trim();
      }
      const idElem = row.querySelector('td.font10pt.title.key');
      if (idElem) {
        const id = idElem.textContent.trim();
        const titleElem = row.querySelector('td.font10pt.bold.value.valueMargin');
        const title = titleElem ? titleElem.textContent.trim() : '';
        const descriptionElem = row.nextElementSibling?.nextElementSibling?.querySelector('td');
        const description = descriptionElem ? descriptionElem.textContent.trim() : '';
        const measuresElem = row.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.querySelector('td');
        const measuresHtml = measuresElem ? measuresElem.innerHTML.trim() : '';
        const measures = measuresHtml.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

        const references = [];
        const refElems = row.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.nextElementSibling?.querySelectorAll('.ref_ref a');
        refElems?.forEach(refElem => {
          references.push(refElem.getAttribute('href'));
        });

        vulnerabilities.push({
          id: id,
          error_level: error_level,
          title: title,
          description: description,
          measures: measures,
          references: references
        });
      }
    });
  });

  return {
    computerIdentifier: Identifier,
    reportNumber: reportNumber,
    reportDate: reportDate,
    vulnerabilities: vulnerabilities
  };
}
