import React from "react";
import { Table, Button } from "react-bootstrap";
import { Inertia } from "@inertiajs/inertia";

const FileTable = ({
    files,
    selectedComputer,
    selectedDate,
    selectedReportNumber,
}) => {
    const handleViewVulnerabilities = (file, vulnerabilities) => {
        // Открываем новую вкладку
        const newTab = window.open("/admin/view/vulnerabilities", "_blank");

        // Ждем, пока новая вкладка загрузится
        if (newTab) {
            // Отправляем данные в новую вкладку
            newTab.onload = () => {
                console.log("Отправляем данные:", { file, vulnerabilities });
                newTab.postMessage(
                    { file, vulnerabilities },
                    window.location.origin
                );
            };
        } else{
            console.log("Не удалось открыть новую вкладку!")
        }
    };
    return (
        <div>
            <p>Идентификатор компьютера: {selectedComputer}</p>
            <p>Дата отчёта: {selectedDate}</p>
            <p>Номер отчёта: {selectedReportNumber}</p>

            <h2>Файлы с уязвимостями</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Ссылка на файл</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(files).map((file, index) => (
                        <tr key={index}>
                            <td>{file}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        handleViewVulnerabilities(
                                            file,
                                            files[file]
                                        )
                                    }
                                >
                                    Посмотреть связные уязвимости
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default FileTable;
