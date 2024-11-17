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
import "./layoutModules/ViewReports.css";
import c from "../layout/layoutModules/ViewReports.module.css";
import axios from "axios";

import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import MessageAlert from "../shared/MessageAlert/MessageAlert";

import { useComputerOptions } from "../hooks/useReportsData";
import useComparisonReportData from "../hooks/useComparisonReportData";
import ButtonDetails from "../shared/ButtonDetails/ButtonDetails";
import SelectField from "../shared/SelectField/SelectField";
import VulnerabilityCard from "../shared/VulnerabilityCard/VulnerabilityCard";
import ComparisonVulnerability from "../shared/ComparisonVulnerability/ComparisonVulnerability";

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
    const computerOptions = useComputerOptions();
    const {
        newDateOptions,
        oldDateOptions,
        newReportNumberOptions,
        oldReportNumberOptions,
    } = useComparisonReportData(
        selectedComputer,
        selectedNewDate,
        selectedOldDate
    );
    // Сообщения
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Статус сравнения
    const [comparisonStatus, setComparisonStatus] = useState(false);

    const [visible, setVisible] = useState(false);
    const [selectedVulnerability, setSelectedVulnerability] = useState(null);

    const openModal = (vulnerability) => {
        setSelectedVulnerability(vulnerability);
        setVisible(true);
    };

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
                    <div style={{ marginLeft: "10px", marginRight: "15px" }}>
                        <h2>Сравнение двух отчётов</h2>
                        <h1 style={{ color: "grey", fontSize: "12px" }}>
                            * Сравнение производится по одному идентификатору
                            компьютера
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
                                    <br />
                                    <SelectField
                                        label="Дата нового отчёта"
                                        option="дату нового отчёта"
                                        id="report_date"
                                        value={selectedNewDate}
                                        onChange={handleNewDateChange}
                                        options={newDateOptions}
                                        required
                                        disabled={!selectedComputer}
                                    />
                                    <SelectField
                                        label="Номер нового отчёта"
                                        option="номер нового отчёта"
                                        id="report_number"
                                        value={selectedNewReportNumber}
                                        onChange={handleNewReportNumberChange}
                                        options={newReportNumberOptions}
                                        required
                                        disabled={!selectedNewDate}
                                    />
                                    <br />
                                    {/* прошлые */}
                                    <SelectField
                                        label="Дата прошлого отчёта"
                                        option="дату прошлого отчёта"
                                        id="report_date"
                                        value={selectedOldDate}
                                        onChange={handleOldDateChange}
                                        options={selectedNewDate}
                                        required
                                        disabled={!selectedNewReportNumber}
                                        filterOptions={filterOldDates}
                                    />
                                    <SelectField
                                        label="Номер прошлого отчёта"
                                        option="номер прошлого отчёта"
                                        id="report_number"
                                        value={selectedOldReportNumber}
                                        onChange={handleOldReportNumberChange}
                                        options={selectedNewReportNumber}
                                        required
                                        disabled={!selectedOldDate}
                                        filterOptions={filterOldReportNumbers}
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
                                value="Сравнить отчёты"
                            />
                        </form>
                        {comparisonStatus && (
                            <LoadingSpinner text="Происходит сравнение отчётов, пожалуйста подождите немного" />
                        )}
                        {message && (
                            <MessageAlert
                                message={message}
                                variant={"success"}
                            />
                        )}
                        {error && (
                            <MessageAlert message={error} variant={"danger"} />
                        )}
                        {message && (
                            <>
                                <CRow>
                                    <ComparisonVulnerability
                                        text="Появившиеся уязвимости"
                                        selectedVulnerability={
                                            newVulnerabilities
                                        }
                                        openModal={openModal}
                                    />

                                    <ComparisonVulnerability
                                        text="Неисправленные уязвимости"
                                        selectedVulnerability={
                                            oldVulnerabilities
                                        }
                                        openModal={openModal}
                                    />

                                    <ComparisonVulnerability
                                        text="Исправленные уязвимости"
                                        selectedVulnerability={
                                            fixedVulnerabilities
                                        }
                                        openModal={openModal}
                                    />
                                </CRow>
                                <ButtonDetails
                                    visible={visible}
                                    onClose={() => setVisible(false)}
                                    selectedVulnerability={
                                        selectedVulnerability
                                    }
                                />
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
