import React, { useState } from "react";
import {
    AppContent,
    AppSidebar,
    AppFooter,
    AppHeader,
} from "../components/index";
import "../scss/style.scss";
import { Button } from "react-bootstrap";
import "./layoutModules/ViewReports.css";

import { handleDeleteReport } from "../utils/deleteReport";
import {
    useComputerOptions,
    useDateOptions,
    useReportNumberOptions,
} from "../hooks/useReportsData";
import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import MessageAlert from "../shared/MessageAlert/MessageAlert";

import axios from "axios";
import SelectField from "../shared/SelectField/SelectField";
import ButtonDetails from "../shared/ButtonDetails/ButtonDetails";
import VulnerabilityCard from "../shared/VulnerabilityCard/VulnerabilityCard";
import ButtonDelete from "../shared/ButtonDelete/ButtonDelete";
import VulnerabilityInfo from "../shared/VulnerabilityInfo/VulnerabilityInfo";
import FileTable from "../shared/FileTable/FileTable";

const ViewReports = () => {
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
    const [vulnerabilities, setVulnerabilities] = useState({});

    const [visible, setVisible] = useState(false);
    const [selectedVulnerability, setSelectedVulnerability] = useState(null);
    //Удаление отчета
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const handleShowModal = () => setShowModalDelete(true);
    const handleCloseModal = () => setShowModalDelete(false);

    const handleDelete = () => {
        handleDeleteReport(
            selectedReportNumber,
            selectedDate,
            handleCloseModal,
            setError,
            setMessage
        );
    };
    // конец удаления отчета

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
        setVisibleDelete(false);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        if (selectedComputer !== "") {
            setSelectedReportNumber("");
            setVulnerabilities([]);
            setError("");
            setMessage("");
            setVisibleDelete(false);
        }
    };

    const handleReportNumberChange = (event) => {
        setSelectedReportNumber(event.target.value);
        setVulnerabilities([]);
        setError("");
        setMessage("");
        setVisibleDelete(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            setMessage("");
            setError("");
            setVulnerabilities([]);
            const response = await axios.post("/admin/view", {
                computer_identifier: selectedComputer,
                report_date: selectedDate,
                report_number: selectedReportNumber,
            });
            setVulnerabilities(response.data.vulnerabilities);
            setMessage(response.data.message);
            setError(response.data.error);
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
                                        id="report_date"
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
                            {visibleDelete && (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={handleShowModal}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Удалить
                                    </Button>
                                    <ButtonDelete
                                        visible={showModalDelete}
                                        onClose={handleCloseModal}
                                        onDelete={handleDelete}
                                        selectedComputer={selectedComputer}
                                        selectedDate={selectedDate}
                                    />
                                </>
                            )}
                        </form>
                        {loading && <LoadingSpinner text={"Загружается..."} />}
                        {message && (
                            <MessageAlert
                                message={message}
                                variant={"success"}
                            />
                        )}
                        {error && (
                            <MessageAlert message={error} variant={"danger"} />
                        )}
                        {Object.keys(vulnerabilities || {}).length > 0 && (
                            <FileTable 
                                files={vulnerabilities}
                                selectedComputer={selectedComputer}
                                selectedDate={selectedDate}
                                selectedReportNumber={selectedReportNumber} />
                        )}

                        {/* {vulnerabilities.length > 0 && (
                            <VulnerabilityInfo
                                vulnerabilities={vulnerabilities}
                                selectedComputer={selectedComputer}
                                selectedDate={selectedDate}
                                selectedReportNumber={selectedReportNumber}
                                openModal={openModal}
                            />
                        )} */}
                        {/* <ButtonDetails
                            visible={visible}
                            onClose={() => setVisible(false)}
                            selectedVulnerability={selectedVulnerability}
                        /> */}
                    </div>
                </div>
                <br />
                <AppFooter />
            </div>
            
        </div>
    );
};

export default React.memo(ViewReports);
