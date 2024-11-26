import ExcelJS from 'exceljs';

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
    
    // Ширина столбцов
    const columnWidths = {
        "Уровень ошибки": 16,
        "Идентификатор уязвимости": 26,
        "Название уязвимости": 30,
        "Описание": 40,
        "Возможные меры по устранению": 50,
        "Ссылки на источники": 60
    };

    // Создаем новую книгу
    const workbook = new ExcelJS.Workbook();

    // Добавляем информацию о компьютере на отдельный лист
    const infoSheet = workbook.addWorksheet("Информация");
    infoSheet.addRow(["Идентификатор компьютера", selectedComputer]);
    infoSheet.addRow(["Номер отчёта", selectedReportNumber]);
    infoSheet.addRow(["Дата формирования отчёта", selectedDate]);
    infoSheet.addRow(["Дата загрузки отчёта с сервера", Date_now]);

    // Создаем стили для каждого уровня ошибок
    // const styles = {
    //     "Критический": { type: 'pattern', pattern: 'solid', fgColor: { argb: '80FF0000' } }, // Красный
    //     "Высокий": { type: 'pattern', pattern: 'solid', fgColor: { argb: '80FFA500' } }, // Оранжевый
    //     "Средний": { type: 'pattern', pattern: 'solid', fgColor: { argb: '80FFFF00' } }, // Желтый
    //     "Низкий": { type: 'pattern', pattern: 'solid', fgColor: { argb: '80008000' } }, // Зеленый
    // };

    // Создаем листы для каждого уровня ошибок
    selectedErrorLevels.forEach(errorLevel => {
        const sheetName = `${errorLevel} ошибки`;
        const sheet = workbook.addWorksheet(sheetName);

        // Добавляем заголовки
        const headerRow = sheet.addRow(selectedColumns.map(column => {
            if (column === "Ссылки на источники") return "Ссылки на источники";
            return column;
        }));

        // Устанавливаем ширину столбцов
        selectedColumns.forEach((column, index) => {
            const width = columnWidths[column] || 30; // Используем ширину по умолчанию, если она не указана
            sheet.getColumn(index + 1).width = width;
        });

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
            const row = sheet.addRow(rowData);

            // Устанавливаем автоперенос текста для каждой ячейки
            row.eachCell({ includeEmpty: true }, cell => {
                cell.alignment = { wrapText: true };
                // cell.fill = styles[errorLevel];
            });
        });
    });

    // Генерируем файл и запускаем скачивание
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], {
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
    });
};

export default downloadExcel;