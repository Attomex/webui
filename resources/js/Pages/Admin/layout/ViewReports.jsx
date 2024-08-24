import React, { useState, useEffect } from "react";
import {
    AppContent,
    AppSidebar,
    AppFooter,
    AppHeader,
} from "../components/index";
import "../scss/style.scss";
import { Button, Spinner, Alert } from "react-bootstrap";
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
import "./layoutModules/ViewReports.css";

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
    //Удаление отчета
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const handleShowModal = () => setShowModalDelete(true);
    const handleCloseModal = () => setShowModalDelete(false);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/admin/view/`, {
                data: {
                    report_number: selectedReportNumber,
                    report_date: selectedDate,
                },
            });
            handleCloseModal();
            alert(response.data.message);
            setError("");
            window.location.reload(true);
        } catch (error) {
            setError(response.data.error);
            setMessage("");
        }
    };

    // конец удаления отчета

    const openModal = (vulnerability) => {
        setSelectedVulnerability(vulnerability);
        setVisible(true);
    };

    useEffect(() => {
        const getComputersIdentifiers = async () => {
            
            try {
                const response = await axios.get("/admin/getComputersIdentifiers");
    
                setComputerOptions(response.data);
            } catch (error) {
                console.error("Error loading computers", error);
            }
    
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
        }
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
        setVisibleDelete(false);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        if (selectedComputer !== "") {
            setSelectedReportNumber("");
            setVulnerabilities([]);
            setError("");
            setMessage("");
            setDownload(true);
            setVisibleDelete(false);
        }
    };

    const handleReportNumberChange = (event) => {
        setSelectedReportNumber(event.target.value);
        setVulnerabilities([]);
        setError("");
        setMessage("");
        setDownload(true);
        setVisibleDelete(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            setMessage("");
            setError("");
            setVulnerabilities([]);
            setDownload(true);
            const response = await axios.post("/admin/view", {
                computer_identifier: selectedComputer,
                report_date: selectedDate,
                report_number: selectedReportNumber,
            });
            setVulnerabilities(response.data.vulnerabilities);
            setMessage(response.data.message);
            setError("");
            setDownload(false);
            setVisibleDelete(true);
        } catch (error) {
            setError(error.response.data.error);
            setMessage("");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{ overflowX: "hidden" }}>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                    <div style={{ marginLeft: "10px" }}>
                        <h2>Просмотр отчетов</h2>
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
                            {visibleDelete && (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={handleShowModal}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Удалить
                                    </Button>

                                    <CModal
                                        alignment="center"
                                        visible={showModalDelete}
                                        onClose={handleCloseModal}
                                    >
                                        <CModalHeader>
                                            <CModalTitle>
                                                Подтверждение удаления
                                            </CModalTitle>
                                        </CModalHeader>
                                        <CModalBody>
                                            Вы уверены, что хотите удалить отчет{" "}
                                            {selectedComputer} от {selectedDate}
                                            ?
                                        </CModalBody>
                                        <CModalFooter>
                                            <Button
                                                variant="secondary"
                                                onClick={handleCloseModal}
                                            >
                                                Отмена
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={handleDelete}
                                            >
                                                Удалить
                                            </Button>
                                        </CModalFooter>
                                    </CModal>
                                </>
                            )}
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

export default React.memo(ViewReports);
