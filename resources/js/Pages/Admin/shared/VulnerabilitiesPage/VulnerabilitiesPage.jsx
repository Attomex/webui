import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import ButtonDetails from "../ButtonDetails/ButtonDetails";
import { AppContent, AppSidebar, AppFooter, AppHeader } from "../../components";
import "../../scss/style.scss"

const VulnerabilitiesPage = () => {
    const [selectedVulnerability, setSelectedVulnerability] = useState(null);
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState("");
    const [vulnerabilities, setVulnerabilities] = useState("");

    const openModal = (vulnerability) => {
        setSelectedVulnerability(vulnerability);
        setVisible(true);
    };

    useEffect(() => {
        // Функция для обработки входящих сообщений
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) {
                // console.log("Источник не совпадает, игнорируем событие.");
                return;
            }

            if (event.data && event.data.file && event.data.vulnerabilities) {
                setFile(event.data.file);
                setVulnerabilities(event.data.vulnerabilities);
            }
        };

        // Подписываемся на событие message
        window.addEventListener("message", handleMessage);

        // Отписываемся от события при размонтировании компонента
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    return (
        <div style={{ overflowX: "hidden" }}>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                    <div style={{ marginLeft: "10px" }}>
                        <h2>Связные уязвимости для файла: {file}</h2>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Идентификатор</th>
                                    <th>Уровень ошибки</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vulnerabilities &&
                                    vulnerabilities.map((vuln, index) => (
                                        <tr key={index}>
                                            <td>{vuln.identifiers}</td>
                                            <td>{vuln.error_level}</td>
                                            <td>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        openModal(vuln)
                                                    }
                                                >
                                                    Показать подробности
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>

                        {selectedVulnerability && (
                            <ButtonDetails
                                visible={visible}
                                selectedVulnerability={selectedVulnerability}
                                onClose={() => setVisible(false)}
                            />
                        )}
                    </div>
                </div>
                <br />
                <AppFooter />
            </div>
        </div>
    );
};

export default VulnerabilitiesPage;
