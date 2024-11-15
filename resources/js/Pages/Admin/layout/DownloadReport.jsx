import React, { useState } from "react";
import {
    AppContent,
    AppSidebar,
    AppFooter,
    AppHeader,
} from "../components/index";
import "../scss/style.scss";
import { Button } from "react-bootstrap";
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CTable,
} from "@coreui/react";
import c from "./layoutModules/ViewReports.module.css";
import * as XLSX from "xlsx";
import "./layoutModules/ViewReports.css";

import axios from "axios";

import { 
    useComputerOptions,
    useDateOptions,
    useReportNumberOptions
 } from "../hooks/useReportsData";

import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import MessageAlert from "../shared/MessageAlert/MessageAlert";
import ButtonDelete from "../shared/ButtonDelete/ButtonDelete";
import ButtonDetails from "../shared/ButtonDetails/ButtonDetails";
import VulnerabilityCard from "../shared/VulnerabilityCard/VulnerabilityCard";
import SelectField from "../shared/SelectField/SelectField";
import VulnerabilityInfo from "../shared/VulnerabilityInfo/VulnerabilityInfo";

const DownloadReport = () => {
    const [selectedComputer, setSelectedComputer] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedReportNumber, setSelectedReportNumber] = useState("");

    const computerOptions = useComputerOptions();
    const dateOptions = useDateOptions(selectedComputer);
    const reportNumberOptions = useReportNumberOptions(selectedComputer, selectedDate);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [download, setDownload] = useState(true);
    const [vulnerabilities, setVulnerabilities] = useState([]);

    const [visible, setVisible] = useState(false);
    const [selectedVulnerability, setSelectedVulnerability] = useState(null);

    const openModal = (vulnerability) => {
        setSelectedVulnerability(vulnerability);
        setVisible(true);
    };

    const handleComputerChange = (event) => {
        const selectedIdentifier = event.target.value;
        setSelectedComputer(selectedIdentifier);
        setSelectedDate("");
        setSelectedReportNumber("");
        setVulnerabilities([]);
        setError("");
        setMessage("");
        setDownload(true);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        if (selectedComputer !== "") {
            setSelectedReportNumber("");
            setVulnerabilities([]);
            setError("");
            setMessage("");
            setDownload(true);
        }
    };

    const handleReportNumberChange = (event) => {
        setSelectedReportNumber(event.target.value);
        setVulnerabilities([]);
        setError("");
        setMessage("");
        setDownload(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            setMessage("");
            setError("");
            setVulnerabilities([]);
            setDownload(true);
            const response = await axios.post("/admin/download", {
                computer_identifier: selectedComputer,
                report_date: selectedDate,
                report_number: selectedReportNumber,
            });
            setVulnerabilities(response.data.vulnerabilities);
            setMessage(response.data.message);
            setError("");
            setDownload(false);
        } catch (error) {
            setError(error.response.data.error);
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    const clearFields = () => {
        setSelectedComputer("");
        setSelectedDate("");
        setSelectedReportNumber("");
    };

    function getCurrentDate(separator = "") {
        let newDate = new Date();
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        return `${year}${separator}${
            month < 10 ? `0${month}` : `${month}`
        }${separator}${date}`;
    }

    const downloadExcel = () => {
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

        // Преобразуем данные из vulnerabilities в рабочий лист
        const tableArray = [];
        // Добавляем заголовки
        tableArray.push([
            "Идентификатор уязвимости",
            "Название уязвимости",
            "Описание",
            "Возможные меры по устранению",
            "Ссылки на источники",
        ]);
        // Добавляем данные
        vulnerabilities.forEach((vulnerability) => {
            const rowData = [
                vulnerability.identifier,
                vulnerability.name,
                vulnerability.description,
                vulnerability.remediation_measures,
                vulnerability.source_links.join("\n"), // Объединяем ссылки с новой строки
            ];
            tableArray.push(rowData);
        });

        // Создаем рабочий лист из данных
        const tableSheet = XLSX.utils.aoa_to_sheet(tableArray);

        // Устанавливаем ширину столбцов
        tableSheet["!cols"] = [
            { width: 30 }, // Ширина для столбца A
            { width: 30 }, // Ширина для столбца B
            { width: 30 }, // Ширина для столбца C
            { width: 45 }, // Ширина для столбца D
            { width: 50 }, // Ширина для столбца E
        ];

        // Применяем перенос текста и высоту строк для лучшего отображения
        const rows = tableArray.length;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < 5; c++) {
                const cellAddress = XLSX.utils.encode_cell({ c: c, r: r });
                const cell = tableSheet[cellAddress];
                if (cell) {
                    if (!cell.s) cell.s = {};
                    cell.s.alignment = { wrapText: true };
                }
            }
        }

        // Добавляем лист в книгу
        XLSX.utils.book_append_sheet(workbook, tableSheet, "Уязвимости");

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

    return (
        <div style={{ overflowX: "hidden" }}>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                    <div style={{ marginLeft: "10px" }}>
                        <h2>Скачивание отчёта</h2>
                        <h1 style={{ color: "grey", fontSize: "12px" }}>
                            * Перед скачиванием отчёта необходимо просмотреть
                            отчёт
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <table>
                                <tbody>
                                    <SelectField
                                        label="Идентификатор компьютера"
                                        option="компьютер"
                                        id="computer_identifier"
                                        value={selectedComputer}
                                        onChange={handleComputerChange}
                                        options={computerOptions}
                                        required
                                    />
                                    <SelectField
                                        label="Дата отчёта"
                                        option="дату отчёта"
                                        id="report_number"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        options={dateOptions}
                                        required
                                        disabled={!selectedComputer}
                                    />
                                    <SelectField
                                        label="Номер отчёта"
                                        option="номер отчёта"
                                        id="report_number"
                                        value={selectedReportNumber}
                                        onChange={handleReportNumberChange}
                                        options={reportNumberOptions}
                                        required
                                        disabled={!selectedDate}
                                    />
                                </tbody>
                            </table>
                            <Button
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    width: "200px",
                                }}
                                as="input"
                                type="submit"
                                value="Посмотреть отчёт"
                                disabled={loading}
                            />
                            <Button
                                variant="secondary"
                                style={{ marginLeft: "10px" }}
                                as="input"
                                className="downloadExcel"
                                type="button"
                                onClick={downloadExcel}
                                disabled={download}
                                value="Скачать отчёт"
                            ></Button>
                        </form>
                        {loading && <LoadingSpinner text="Загружается..."/>}
                        {message && <MessageAlert message={message} variant={"success"}/>}
                        {error && <MessageAlert message={error} variant={"danger"}/>}

                        {vulnerabilities.length > 0 && <VulnerabilityInfo
                            vulnerabilities={vulnerabilities}
                            selectedComputer={selectedComputer}
                            selectedDate={selectedDate}
                            selectedReportNumber={selectedReportNumber}
                            openModal={openModal}
                            />
                        }
                        <ButtonDetails
                            visible={visible}
                            onClose={() => setVisible(false)}
                            selectedVulnerability={selectedVulnerability}
                        />
                    </div>
                </div>
                <br />
                <AppFooter />
            </div>
        </div>
    );
};

export default DownloadReport;
