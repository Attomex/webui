import * as XLSX from "xlsx";

function getCurrentDate(separator = "") {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}${
        month < 10 ? `0${month}` : `${month}`
    }${separator}${date}`;
}

const downloadExcel = (selectedErrorLevels, selectedColumns, selectedComputer, selectedReportNumber, selectedDate, vulnerabilities) => {
    let Date_now = getCurrentDate(".");

    // Создаем рабочую книгу
    const workbook = XLSX.utils.book_new();

    // Добавляем информацию о компьютере на отдельный лист
    const infoSheet = XLSX.utils.aoa_to_sheet([
        ["Идентификатор компьютера", selectedComputer],
        ["Номер отчёта", selectedReportNumber],
        ["Дата формирования отчёта", selectedDate],
        ["Дата загрузки отчёта с сервера", Date_now],
    ]);
    XLSX.utils.book_append_sheet(workbook, infoSheet, "Информация");

    // Создаем стили для каждого уровня ошибок
    const styles = {
        "Критический": { fill: { fgColor: { rgb: "FF0000" } } }, // Красный
        "Высокий": { fill: { fgColor: { rgb: "FFA500" } } }, // Оранжевый
        "Средний": { fill: { fgColor: { rgb: "FFFF00" } } }, // Желтый
        "Низкий": { fill: { fgColor: { rgb: "008000" } } }, // Зеленый
    };

    // Создаем листы для каждого уровня ошибок
    selectedErrorLevels.forEach(errorLevel => {
        const tableArray = [];
        // Добавляем заголовки
        const headerRow = selectedColumns.map(column => {
            if (column === "Ссылки на источники") return "Ссылки на источники";
            return column;
        });
        tableArray.push(headerRow);

        // Фильтруем уязвимости по уровню ошибки
        const filteredVulnerabilities = vulnerabilities.filter(vulnerability => vulnerability.error_level === errorLevel);

        // Добавляем данные
        filteredVulnerabilities.forEach(vulnerability => {
            const rowData = selectedColumns.map(column => {
                if (column === "Уровень ошибки") return vulnerability.error_level;
                if (column === "Идентификатор уязвимости") return vulnerability.identifier;
                if (column === "Название уязвимости") return vulnerability.name;
                if (column === "Описание") return vulnerability.description;
                if (column === "Возможные меры по устранению") return vulnerability.remediation_measures;
                if (column === "Ссылки на источники") return vulnerability.source_links.join("\n");
                return "";
            });
            tableArray.push(rowData);
        });

        // Создаем рабочий лист из данных
        const tableSheet = XLSX.utils.aoa_to_sheet(tableArray);

        // Устанавливаем ширину столбцов
        tableSheet["!cols"] = selectedColumns.map(column => ({ width: 30 }));

        // Формируем название листа
        let sheetName = `${errorLevel} ошибки`;
        if (errorLevel === "Критический") {
            sheetName = "Критические ошибки";
        } else if (errorLevel === "Высокий") {
            sheetName = "Высокие ошибки";
        } else if (errorLevel === "Средний") {
            sheetName = "Средние ошибки";
        } else if (errorLevel === "Низкий") {
            sheetName = "Низкие ошибки";
        }

        // Добавляем лист в книгу
        XLSX.utils.book_append_sheet(workbook, tableSheet, sheetName);
    });

    // Генерируем файл и запускаем скачивание
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });

    const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedComputer}_${selectedReportNumber}_${Date_now}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export default downloadExcel;