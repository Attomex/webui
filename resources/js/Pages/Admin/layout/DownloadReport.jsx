import React, { useState, useEffect } from "react";
import {
    AppContent,
    AppSidebar,
    AppFooter,
    AppHeader,
} from "../components/index";
import "../scss/style.scss";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
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

import { useForm } from "@inertiajs/inertia-react";
import axios from "axios";

const ViewReports = () => {
    const [selectedComputer, setSelectedComputer] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedReportNumber, setSelectedReportNumber] = useState("");

    const [computerOptions, setComputerOptions] = useState([]);
    const [dateOptions, setDateOptions] = useState([]);
    const [reportNumberOptions, setReportNumberOptions] = useState([]);

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

    useEffect(() => {
        const getComputersIdentifiers = async () => {
            await axios
                .get("/admin/getComputersIdentifiers")
                .then((response) => {
                    setComputerOptions(response.data);
                })
                .catch((error) => {
                    console.error("Error loading computers", error);
                });
        };

        getComputersIdentifiers();
    }, []);

    useEffect(() => {
        const getUniqueDates = async () => {
            if (selectedComputer) {
                await axios
                    .get(
                        `/admin/getReportsByComputer?computer_identifier=${selectedComputer}`
                    )
                    .then((response) => {
                        const uniqueDates = [
                            ...new Set(
                                response.data.map(
                                    (report) => report.report_date
                                )
                            ),
                        ];
                        setDateOptions(uniqueDates);
                    })
                    .catch((error) => {
                        console.error("Error loading dates", error);
                    });
            } else {
                setDateOptions([]);
                setReportNumberOptions([]);
            }
        };

        getUniqueDates();
    }, [selectedComputer]);

    useEffect(() => {
        const getReportNumbers = async () => {
            if (selectedDate) {
                // Загрузка списка номеров отчетов для выбранной даты
                await axios
                    .get(
                        `/admin/getReportsByComputer?computer_identifier=${selectedComputer}&report_date=${selectedDate}`
                    )
                    .then((response) => {
                        setReportNumberOptions(
                            response.data.map((report) => report.report_number)
                        );
                    })
                    .catch((error) => {
                        console.error("Error loading report numbers", error);
                    });
            } else {
                setReportNumberOptions([]);
            }
        };

        getReportNumbers();
    }, [selectedDate]);

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
                                    <tr>
                                        <td>
                                            <label className={c.label__field}>
                                                Идентификатор компьютера:
                                            </label>
                                        </td>
                                        <td>
                                            <select
                                                className={c.select__field}
                                                id="computer_identifier"
                                                value={selectedComputer}
                                                onChange={handleComputerChange}
                                                required
                                            >
                                                <option value="">
                                                    Выберите компьютер
                                                </option>
                                                {computerOptions.map(
                                                    (computer) => (
                                                        <option
                                                            key={computer.id}
                                                            value={
                                                                computer.identifier
                                                            }
                                                        >
                                                            {
                                                                computer.identifier
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label className={c.label__field}>
                                                Дата отчёта:
                                            </label>
                                        </td>
                                        <td>
                                            <select
                                                className={c.select__field}
                                                id="report_date"
                                                value={selectedDate}
                                                onChange={handleDateChange}
                                                required
                                                disabled={!selectedComputer}
                                            >
                                                <option value="">
                                                    Выберите дату отчёта
                                                </option>
                                                {dateOptions.map(
                                                    (date, index) => (
                                                        <option
                                                            key={index}
                                                            value={date}
                                                        >
                                                            {date}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label className={c.label__field}>
                                                Номер отчёта:
                                            </label>
                                        </td>
                                        <td>
                                            <select
                                                className={c.select__field}
                                                id="report_number"
                                                value={selectedReportNumber}
                                                onChange={
                                                    handleReportNumberChange
                                                }
                                                required
                                                disabled={!selectedDate}
                                            >
                                                <option value="">
                                                    Выберите номер отчёта
                                                </option>
                                                {reportNumberOptions.map(
                                                    (number, index) => (
                                                        <option
                                                            key={index}
                                                            value={number}
                                                        >
                                                            {number}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>
                                    </tr>
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
                        {loading && (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "10px",
                                }}
                            >
                                <Spinner
                                    animation="grow"
                                    variant="warning"
                                    role="status"
                                    style={{
                                        width: "2rem",
                                        height: "2rem",
                                    }}
                                >
                                    <span className="sr-only">
                                        Загружается...
                                    </span>
                                </Spinner>
                                <span style={{ marginLeft: "10px" }}>
                                    Загружается...
                                </span>
                            </div>
                        )}
                        {message && (
                            <Alert
                                style={{ width: "max-content" }}
                                variant="success"
                            >
                                {message}
                            </Alert>
                        )}
                        {error && (
                            <Alert
                                style={{ width: "max-content" }}
                                variant="danger"
                            >
                                {error}
                            </Alert>
                        )}

                        {vulnerabilities.length > 0 && (
                            <div>
                                <p>
                                    Идентификатор компьютера: {selectedComputer}
                                </p>
                                <p>Дата отчёта: {selectedDate}</p>
                                <p>Номер отчёта: {selectedReportNumber}</p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "11px",
                                        overflowX: "hidden",
                                    }}
                                >
                                    {vulnerabilities.map((vulnerability) => (
                                        <div
                                            key={vulnerability.number}
                                            style={{
                                                flex: "1 1 calc(33.33% - 6px)",
                                                maxWidth: "400px",
                                            }}
                                        >
                                            <CCard>
                                                <CCardBody>
                                                    <h5>
                                                        Код ошибки:{" "}
                                                        {
                                                            vulnerability.identifier
                                                        }
                                                    </h5>
                                                    <p>
                                                        Уровень ошибки:{" "}
                                                        {
                                                            vulnerability.error_level
                                                        }
                                                    </p>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            alignItems:
                                                                "center",
                                                        }}
                                                    >
                                                        <CButton
                                                            color="primary"
                                                            onClick={() =>
                                                                openModal(
                                                                    vulnerability
                                                                )
                                                            }
                                                        >
                                                            Подробнее
                                                        </CButton>
                                                        <span
                                                            style={{
                                                                border: "1px solid rgba(139, 157, 255, 0.58)",
                                                                padding: "7px",
                                                                borderRadius:
                                                                    "2vh",
                                                                fontWeight:
                                                                    "bold",
                                                                backgroundColor:
                                                                    "rgba(139, 157, 255, 0.5)",
                                                            }}
                                                        >
                                                            Номер:{" "}
                                                            {
                                                                vulnerability.number
                                                            }
                                                        </span>
                                                    </div>
                                                </CCardBody>
                                            </CCard>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <CModal
                            size="xl"
                            scrollable
                            visible={visible}
                            onClose={() => setVisible(false)}
                        >
                            <CModalHeader onClose={() => setVisible(false)}>
                                <CModalTitle>Подробная информация</CModalTitle>
                            </CModalHeader>
                            <CModalBody>
                                {selectedVulnerability && (
                                    <CTable striped hover responsive size="sm">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Идентификатор уязвимости
                                                </th>
                                                <th>Название уязвимости</th>
                                                <th>Описание</th>
                                                <th>
                                                    Возможные меры по устранению
                                                </th>
                                                <th>Ссылки на источники</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {
                                                        selectedVulnerability.identifier
                                                    }
                                                </td>
                                                <td>
                                                    {selectedVulnerability.name}
                                                </td>
                                                <td>
                                                    {
                                                        selectedVulnerability.description
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        selectedVulnerability.remediation_measures
                                                    }
                                                </td>
                                                <td>
                                                    <ul>
                                                        {selectedVulnerability.source_links.map(
                                                            (link, index) => (
                                                                <li key={index}>
                                                                    <a
                                                                        href={
                                                                            link
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {link}
                                                                    </a>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </CTable>
                                )}
                            </CModalBody>
                            <CModalFooter>
                                <CButton
                                    color="secondary"
                                    onClick={() => setVisible(false)}
                                >
                                    Закрыть
                                </CButton>
                            </CModalFooter>
                        </CModal>
                    </div>
                </div>
                <br />
                <AppFooter />
            </div>
        </div>
    );
};

export default ViewReports;
