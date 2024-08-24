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
import "./layoutModules/ViewReports.css";
import c from "../layout/layoutModules/ViewReports.module.css";
import { useForm } from "@inertiajs/inertia-react";
import axios from "axios";

const Comparison = () => {
    // Базовые состояния
    const [selectedComputer, setSelectedComputer] = useState("");
    //Даты новые и старые
    const [selectedNewDate, setSelectedNewDate] = useState("");
    const [selectedOldDate, setSelectedOldDate] = useState("");
    // Номера отчётов новые и старые
    const [selectedNewReportNumber, setSelectedNewReportNumber] = useState("");
    const [selectedOldReportNumber, setSelectedOldReportNumber] = useState("");
    // Списки уязвимостей новые
    const [newVulnerabilities, setNewVulnerabilities] = useState([]);
    const [oldVulnerabilities, setOldVulnerabilities] = useState([]);
    const [fixedVulnerabilities, setFixedVulnerabilities] = useState([]);
    // Списки
    const [computerOptions, setComputerOptions] = useState([]);
    // Опции дат новые и старые
    const [newDateOptions, setNewDateOptions] = useState([]);
    const [oldDateOptions, setOldDateOptions] = useState([]);
    // Опции номеров отчётов новые и старые
    const [newReportNumberOptions, setNewReportNumberOptions] = useState([]);
    const [oldReportNumberOptions, setOldReportNumberOptions] = useState([]);

    // Сообщения
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Статус сравнения
    const [comparisonStatus, setComparisonStatus] = useState(false);

    const [visible, setVisible] = useState(false);
    const [selectedVulnerability, setSelectedVulnerability] = useState(null);

    const [number, setNumber] = useState(0);

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
                        setNewDateOptions(uniqueDates);
                        setOldDateOptions(uniqueDates);
                    })
                    .catch((error) => {
                        console.error("Error loading dates", error);
                    });
            } else {
                setNewDateOptions([]);
                setOldDateOptions([]);
            }
        };

        getUniqueDates();
    }, [selectedComputer]);

    useEffect(() => {
        const getNewReportNumbers = async () => {
            if (selectedNewDate) {
                // Загрузка списка номеров отчетов для выбранной новой даты
                await axios
                    .get(
                        `/admin/getReportsByComputer?computer_identifier=${selectedComputer}&report_date=${selectedNewDate}`
                    )
                    .then((response) => {
                        setNewReportNumberOptions(
                            response.data.map((report) => report.report_number)
                        );
                    })
                    .catch((error) => {
                        console.error("Error loading report numbers", error);
                    });
            } else {
                setNewReportNumberOptions([]);
            }
        };

        getNewReportNumbers();
    }, [selectedNewDate]);

    useEffect(() => {
        const getOldReportNumbers = async () => {
            if (selectedOldDate) {
                // Загрузка списка номеров отчетов для выбранной  прошлой даты
                await axios
                    .get(
                        `/admin/getReportsByComputer?computer_identifier=${selectedComputer}&report_date=${selectedOldDate}`
                    )
                    .then((response) => {
                        setOldReportNumberOptions(
                            response.data.map((report) => report.report_number)
                        );
                    })
                    .catch((error) => {
                        console.error("Error loading report numbers", error);
                    });
            } else {
                setOldReportNumberOptions([]);
            }
        };

        getOldReportNumbers();
    }, [selectedOldDate]);

    const handleComputerChange = (event) => {
        const selectedIdentifier = event.target.value;
        setSelectedComputer(selectedIdentifier);
        setSelectedNewDate("");
        setSelectedOldDate("");
        setSelectedNewReportNumber("");
        setSelectedOldReportNumber("");
        setNewVulnerabilities([]);
        setOldVulnerabilities([]);
        setError("");
        setMessage("");
    };

    const handleNewDateChange = (event) => {
        setSelectedNewDate(event.target.value);
        if (selectedComputer !== "") {
            setSelectedOldDate("");
            setSelectedNewReportNumber("");
            setSelectedOldReportNumber("");
            setNewVulnerabilities([]);
            setError("");
            setMessage("");
        }
    };

    const handleOldDateChange = (event) => {
        setSelectedOldDate(event.target.value);
        if (selectedComputer !== "") {
            setSelectedOldReportNumber("");
            setOldVulnerabilities([]);
            setError("");
            setMessage("");
        }
    };

    const handleNewReportNumberChange = (event) => {
        setSelectedNewReportNumber(event.target.value);
        setSelectedOldDate("");
        setSelectedOldReportNumber("");
        setNewVulnerabilities([]);
        setError("");
        setMessage("");
    };

    const handleOldReportNumberChange = (event) => {
        setSelectedOldReportNumber(event.target.value);
        setOldVulnerabilities([]);
        setError("");
        setMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setComparisonStatus(true);
            setMessage("");
            setError("");
            const response = await axios.post("/admin/comparison", {
                computer_identifier: selectedComputer,
                new_report_date: selectedNewDate,
                new_report_number: selectedNewReportNumber,
                old_report_date: selectedOldDate,
                old_report_number: selectedOldReportNumber,
            });
            setNewVulnerabilities(response.data.appeared_vulnerabilities); // новые
            setFixedVulnerabilities(response.data.fixed_vulnerabilities); // исправленные
            setOldVulnerabilities(response.data.remaining_vulnerabilities); // старые
            setMessage(response.data.message);
            setError("");
        } catch (error) {
            setError(error.response.data.error);
            setMessage("");
        } finally {
            setComparisonStatus(false);
        }
    };

    // Парочку фильтор на сайтик
    const filterOldDates = (newDate) => {
        return oldDateOptions.filter((date) => date <= newDate);
    };

    const filterOldReportNumbers = (newReportNumber) => {
        return oldReportNumberOptions.filter(
            (number) => number !== newReportNumber
        );
    };

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                    <div style={{ marginLeft: "10px",  marginRight: "15px" }}>
                        <h2>Сравнение двух отчётов</h2>
                        <h1 style={{ color: "grey", fontSize: "12px" }}>
                            * Сравнение производится по одному идентификатору
                            компьютера
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
                                    <br />
                                    <tr>
                                        <td>
                                            <label className={c.label__field}>
                                                Дата нового отчёта:
                                            </label>
                                        </td>
                                        <td>
                                            <select
                                                className={c.select__field}
                                                id="report_date"
                                                value={selectedNewDate}
                                                onChange={handleNewDateChange}
                                                required
                                                disabled={!selectedComputer}
                                            >
                                                <option value="">
                                                    Выберите дату нового отчёта
                                                </option>
                                                {newDateOptions.map(
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
                                                Номер нового отчёта:
                                            </label>
                                        </td>
                                        <td>
                                            <select
                                                className={c.select__field}
                                                id="report_number"
                                                value={selectedNewReportNumber}
                                                onChange={
                                                    handleNewReportNumberChange
                                                }
                                                required
                                                disabled={!selectedNewDate}
                                            >
                                                <option value="">
                                                    Выберите номер отчёта
                                                </option>
                                                {newReportNumberOptions.map(
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
                                    <br />
                                    {/* прошлые */}
                                    <tr>
                                        <td>
                                            <label className={c.label__field}>
                                                Дата прошлого отчёта:
                                            </label>
                                        </td>
                                        <td>
                                            <select
                                                className={c.select__field}
                                                id="report_date"
                                                value={selectedOldDate}
                                                onChange={handleOldDateChange}
                                                required
                                                disabled={
                                                    !selectedNewReportNumber
                                                }
                                            >
                                                <option value="">
                                                    Выберите дату прошлого
                                                    отчёта
                                                </option>
                                                {filterOldDates(
                                                    selectedNewDate
                                                ).map((date, index) => (
                                                    <option
                                                        key={index}
                                                        value={date}
                                                    >
                                                        {date}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label className={c.label__field}>
                                                Номер прошлого отчёта:
                                            </label>
                                        </td>
                                        <td>
                                            <select
                                                className={c.select__field}
                                                id="report_number"
                                                value={selectedOldReportNumber}
                                                onChange={
                                                    handleOldReportNumberChange
                                                }
                                                required
                                                disabled={!selectedOldDate}
                                            >
                                                <option value="">
                                                    Выберите номер отчёта
                                                </option>
                                                {filterOldReportNumbers(
                                                    selectedNewReportNumber
                                                ).map((number, index) => (
                                                    <option
                                                        key={index}
                                                        value={number}
                                                    >
                                                        {number}
                                                    </option>
                                                ))}
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
                                value="Сравнить отчёты"
                            />
                        </form>
                        {comparisonStatus && (
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
                                        Происходит сравнение отчётов, пожалуйста
                                        подождите немного
                                    </span>
                                </Spinner>
                                <span style={{ marginLeft: "10px" }}>
                                    Происходит сравнение отчётов, пожалуйста
                                    подождите немного
                                </span>
                            </div>
                        )}
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && (
                            <>
                                <CRow>
                                    <CCol>
                                        <CCard>
                                            <CCardBody>
                                                <h4>Появившиеся уязвимости</h4>
                                                {newVulnerabilities.length >
                                                    0 && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: "11px",
                                                            overflowX: "hidden",
                                                        }}
                                                    >
                                                        {newVulnerabilities.map(
                                                            (vulnerability) => (
                                                                <div
                                                                    key={
                                                                        vulnerability.id
                                                                    }
                                                                    style={{
                                                                        flex: "1 1 calc(33.33% - 6px)",
                                                                        maxWidth:
                                                                            "400px",
                                                                    }}
                                                                >
                                                                    <CCard>
                                                                        <CCardBody>
                                                                            <h5>
                                                                                Код
                                                                                ошибки:{" "}
                                                                                {
                                                                                    vulnerability.identifier
                                                                                }
                                                                            </h5>
                                                                            <p>
                                                                                Уровень
                                                                                ошибки:{" "}
                                                                            </p>
                                                                            <p>
                                                                                {
                                                                                    vulnerability.error_level
                                                                                }
                                                                            </p>
                                                                            <div
                                                                                style={{
                                                                                    display:
                                                                                        "flex",
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
                                                                                        padding:
                                                                                            "7px",
                                                                                        borderRadius:
                                                                                            "2vh",
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                        backgroundColor:
                                                                                            "rgba(139, 157, 255, 0.5)",
                                                                                    }}
                                                                                >
                                                                                    №:{" "}
                                                                                    {
                                                                                        vulnerability.number
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </CCardBody>
                                                                    </CCard>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol>
                                        <CCard>
                                            <CCardBody>
                                                <h4>Неисправленные уязвимости</h4>
                                                {oldVulnerabilities.length >
                                                    0 && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: "11px",
                                                            overflowX: "hidden",
                                                        }}
                                                    >
                                                        {oldVulnerabilities.map(
                                                            (vulnerability) => (
                                                                <div
                                                                    key={
                                                                        vulnerability.id
                                                                    }
                                                                    style={{
                                                                        flex: "1 1 calc(33.33% - 6px)",
                                                                        maxWidth:
                                                                            "400px",
                                                                    }}
                                                                >
                                                                    <CCard>
                                                                        <CCardBody>
                                                                            <h5>
                                                                                Код
                                                                                ошибки:{" "}
                                                                                {
                                                                                    vulnerability.identifier
                                                                                }
                                                                            </h5>
                                                                            <p>
                                                                                Уровень
                                                                                ошибки:{" "}
                                                                            </p>
                                                                            <p>
                                                                                {
                                                                                    vulnerability.error_level
                                                                                }
                                                                            </p>
                                                                            <div
                                                                                style={{
                                                                                    display:
                                                                                        "flex",
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
                                                                                        padding:
                                                                                            "7px",
                                                                                        borderRadius:
                                                                                            "2vh",
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                        backgroundColor:
                                                                                            "rgba(139, 157, 255, 0.5)",
                                                                                    }}
                                                                                >
                                                                                    №:{" "}
                                                                                    {
                                                                                        vulnerability.number
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </CCardBody>
                                                                    </CCard>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                    <CCol>
                                        <CCard>
                                            <CCardBody>
                                                <h4>Исправленные уязвимости</h4>
                                                {fixedVulnerabilities.length >
                                                    0 && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            gap: "11px",
                                                            overflowX: "hidden",
                                                        }}
                                                    >
                                                        {fixedVulnerabilities.map(
                                                            (vulnerability) => (
                                                                <div
                                                                    key={
                                                                        vulnerability.id
                                                                    }
                                                                    style={{
                                                                        flex: "1 1 calc(33.33% - 6px)",
                                                                        maxWidth:
                                                                            "400px",
                                                                    }}
                                                                >
                                                                    <CCard
                                                                        style={{}}
                                                                    >
                                                                        <CCardBody>
                                                                            <h5>
                                                                                Код
                                                                                ошибки:{" "}
                                                                                {
                                                                                    vulnerability.identifier
                                                                                }
                                                                            </h5>
                                                                            <p>
                                                                                Уровень
                                                                                ошибки:{" "}
                                                                            </p>
                                                                            <p>
                                                                                {
                                                                                    vulnerability.error_level
                                                                                }
                                                                            </p>
                                                                            <div
                                                                                style={{
                                                                                    display:
                                                                                        "flex",
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
                                                                                        padding:
                                                                                            "7px",
                                                                                        borderRadius:
                                                                                            "2vh",
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                        backgroundColor:
                                                                                            "rgba(139, 157, 255, 0.5)",
                                                                                    }}
                                                                                >
                                                                                    №:{" "}
                                                                                    {
                                                                                        vulnerability.number
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </CCardBody>
                                                                    </CCard>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </CCardBody>
                                        </CCard>
                                    </CCol>
                                </CRow>
                                <CModal
                                    size="xl"
                                    scrollable
                                    visible={visible}
                                    onClose={() => setVisible(false)}
                                >
                                    <CModalHeader
                                        onClose={() => setVisible(false)}
                                    >
                                        <CModalTitle>
                                            Подробная информация
                                        </CModalTitle>
                                    </CModalHeader>
                                    <CModalBody>
                                        {selectedVulnerability && (
                                            <CTable
                                                striped
                                                hover
                                                responsive
                                                size="sm"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            Идентификатор
                                                            уязвимости
                                                        </th>
                                                        <th>
                                                            Название уязвимости
                                                        </th>
                                                        <th>Описание</th>
                                                        <th>
                                                            Возможные меры по
                                                            устранению
                                                        </th>
                                                        <th>
                                                            Ссылки на источники
                                                        </th>
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
                                                            {
                                                                selectedVulnerability.name
                                                            }
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
                                                                    (
                                                                        link,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <a
                                                                                href={
                                                                                    link
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                {
                                                                                    link
                                                                                }
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
                            </>
                        )}
                    </div>
                </div>
                <AppFooter />
            </div>
        </div>
    );
};

export default Comparison;
