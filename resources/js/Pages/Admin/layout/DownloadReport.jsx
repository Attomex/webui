import React, { useState, useEffect } from "react";
import {
    AppContent,
    AppSidebar,
    AppFooter,
    AppHeader,
} from "../components/index";
import "../scss/style.scss";
import { Button } from "react-bootstrap";
import * as XLSX from "xlsx";
import "./layoutModules/ViewReports.css";

import axios from "axios";

import {
    useComputerOptions,
    useDateOptions,
    useReportNumberOptions,
} from "../hooks/useReportsData";

import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import MessageAlert from "../shared/MessageAlert/MessageAlert";
import ButtonDetails from "../shared/ButtonDetails/ButtonDetails";
import SelectField from "../shared/SelectField/SelectField";
import VulnerabilityInfo from "../shared/VulnerabilityInfo/VulnerabilityInfo";
import downloadExcel from "../scripts/downloadExcel";
import DownloadModal from "../shared/DownloadModal/DownloadModal";

const DownloadReport = () => {
    const [selectedComputer, setSelectedComputer] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedReportNumber, setSelectedReportNumber] = useState("");

    const computerOptions = useComputerOptions();
    const dateOptions = useDateOptions(selectedComputer);
    const reportNumberOptions = useReportNumberOptions(
        selectedComputer,
        selectedDate
    );

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [download, setDownload] = useState(true);
    const [vulnerabilities, setVulnerabilities] = useState([]);

    const [visible, setVisible] = useState(false);
    const [selectedVulnerability, setSelectedVulnerability] = useState(null);

    // Модальное окно скачивания отчёта
    const [visibleModalDwnld, setVisibleModalDwnld] = useState(false);
    const [selectedErrorLevels, setSelectedErrorLevels] = useState(["Критический", "Высокий", "Средний", "Низкий"]);
    const [selectedColumns, setSelectedColumns] = useState([
        "Уровень ошибки",
        "Идентификатор уязвимости",
        "Название уязвимости",
        "Описание",
        "Возможные меры по устранению",
        "Ссылки на источники",
    ]);


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

    const toggleModal = () => {
        setVisibleModalDwnld(true);
    };

    // Используем useEffect для управления состоянием visible
    useEffect(() => {
        if (visibleModalDwnld) {
            // Если модальное окно открыто, ничего не делаем
            return;
        }
        // Если модальное окно закрыто, сбрасываем выбранные параметры
        setSelectedErrorLevels(["Критический", "Высокий", "Средний", "Низкий"]);
        setSelectedColumns([
            "Уровень ошибки",
            "Идентификатор уязвимости",
            "Название уязвимости",
            "Описание",
            "Возможные меры по устранению",
            "Ссылки на источники",
        ]);
    }, [visibleModalDwnld]);

    const handleDownload = () => {
        downloadExcel(selectedErrorLevels, selectedColumns, selectedComputer, selectedReportNumber, selectedDate, vulnerabilities);
        setVisibleModalDwnld(false);
    }

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
                                onClick={toggleModal}
                                disabled={download}
                                value="Скачать отчёт"
                            ></Button>
                        </form>
                        <DownloadModal
                            visible={visibleModalDwnld}
                            onClose={() => setVisibleModalDwnld(false)}
                            onDownload={handleDownload}
                            selectedErrorLevels={selectedErrorLevels}
                            setSelectedErrorLevels={setSelectedErrorLevels}
                            selectedColumns={selectedColumns}
                            setSelectedColumns={setSelectedColumns}
                        />
                        {loading && <LoadingSpinner text="Загружается..." />}
                        {message && (
                            <MessageAlert
                                message={message}
                                variant={"success"}
                            />
                        )}
                        {error && (
                            <MessageAlert message={error} variant={"danger"} />
                        )}

                        {vulnerabilities.length > 0 && (
                            <VulnerabilityInfo
                                vulnerabilities={vulnerabilities}
                                selectedComputer={selectedComputer}
                                selectedDate={selectedDate}
                                selectedReportNumber={selectedReportNumber}
                                openModal={openModal}
                            />
                        )}
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
