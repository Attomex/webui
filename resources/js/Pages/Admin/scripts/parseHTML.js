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
  const vulnerabilityFiles = {};

  // Парсинг первой таблицы с уязвимостями
  const vulnerabilitiesTable = doc.querySelector('.vulnerabilitiesTbl');
  const vulnerabilityRows = vulnerabilitiesTable.querySelectorAll('tr');

  let currentVulnerabilityId = null;

  vulnerabilityRows.forEach(row => {
    const idElem = row.querySelector('td.bdu');
    if (idElem) {
      currentVulnerabilityId = idElem.textContent.trim();
      vulnerabilityFiles[currentVulnerabilityId] = [];
    }

    const filesElem = row.querySelector('td.desc.fileslist');
    if (filesElem && currentVulnerabilityId) {
      const fileInfo = filesElem.innerHTML.trim().split(/<br\s*\/?>/gi).map(file => file.trim());
      vulnerabilityFiles[currentVulnerabilityId].push(...fileInfo);
    }
  });

  // Парсинг второй таблицы с деталями уязвимостей
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
        const id = idElem.innerHTML.replace(/<br\s*\/?>/gi, '; ').trim();
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

        const files = vulnerabilityFiles[id] || [];

        vulnerabilities.push({
          id: id,
          error_level: error_level,
          title: title,
          description: description,
          measures: measures,
          references: references,
          files: files
        });
      }
    });
  });

  // Парсинг таблицы статистики
  const statTable = doc.querySelector('.statTable');
  const statRows = statTable.querySelectorAll('tr');
  let totalCritical = 0;
  let totalHigh = 0;
  let totalMedium = 0;
  let totalLow = 0;

  statRows.forEach(row => {
    const keyElem = row.querySelector('td.key');
    if (keyElem) {
      const keyText = keyElem.textContent.trim();
      const valueElem = row.querySelector('td:nth-child(2)');
      const value = valueElem ? parseInt(valueElem.textContent.trim(), 10) : 0;

      if (keyText.includes('Критический')) {
        totalCritical = value;
      } else if (keyText.includes('Высокий')) {
        totalHigh = value;
      } else if (keyText.includes('Средний')) {
        totalMedium = value;
      } else if (keyText.includes('Низкий')) {
        totalLow = value;
      }
    }
  });

  return {
    computerIdentifier: Identifier,
    reportNumber: reportNumber,
    reportDate: reportDate,
    vulnerabilities: vulnerabilities,
    totalCritical: totalCritical,
    totalHigh: totalHigh,
    totalMedium: totalMedium,
    totalLow: totalLow
  };
}