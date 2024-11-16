import React, { useState } from "react";
import axios from "axios";
import {
    AppContent,
    AppSidebar,
    AppFooter,
    AppHeader,
} from "../components/index";
import { Button } from "react-bootstrap";
import "../scss/style.scss";
import { parseHTML } from "../scripts/parseHTML";
import c from "./layoutModules/Uploading.module.css"
import UploadingOptions from "../components/UploadingOptions";

import { useComputerOptions } from "../hooks/useReportsData";

import LoadingSpinner from "../shared/LoadingSpinner/LoadingSpinner";
import MessageAlert from "../shared/MessageAlert/MessageAlert";

const Uploading = () => {
    const [report_file, setFile] = useState(null);
    const [computerIdentifier, setComputerIdentifier] = useState("");
    const [newIdentifier, setNewIdentifier] = useState("");
    const computerOptions = useComputerOptions();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

            if (fileExtension === "html") {
                setFile(selectedFile);
                setError("");
            } else {
                setError("Пожалуйста, выберите файл с расширением .html");
                setFile(null);
                document.getElementById("report_file").value = "";
            }
        }
    };

    const handleIdentifierChange = (event) => {
        setComputerIdentifier(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const reader = new FileReader();

        reader.onload = async (e) => {
            const content = e.target.result;
            const identifier = computerIdentifier;
            const parsedData = parseHTML(content, identifier);

            try {
                setLoading(true);
                setMessage("");
                setError("");
                const response = await axios.post("/admin/upload", parsedData, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                setMessage(response.data.message);
                setError("");
            } catch (error) {
                if (error.response && error.response.data.status === "400") {
                    setError(error.response.data.message);
                } else {
                    setError(
                        "Произошла неизвестная ошибка. Пожалуйста, обратитесь к администратору."
                    );
                }
                setMessage("");
            } finally {
                setLoading(false);
                clearFields();
            }
        };
        reader.readAsText(report_file);
    };

    const clearFields = () => {
        setFile(null);
        setComputerIdentifier("");
        setNewIdentifier("");
        document.getElementById("report_file").value = "";
    };

    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                    <AppContent />
                    <div style={{ marginLeft: "10px" }}>
                        <h2>Загрузка отчётов</h2>
                        <form onSubmit={handleSubmit}>
                            <table>
                                <tbody>
                                    <tr>
                                        <UploadingOptions
                                            computerOptions={computerOptions}
                                            handleIdentifierChange={
                                                handleIdentifierChange
                                            }
                                            computerIdentifier={
                                                computerIdentifier
                                            }
                                            setterComputerIdentifier={
                                                setComputerIdentifier
                                            }
                                            newIdentifier={newIdentifier}
                                            setNewIdentifier={setNewIdentifier}
                                        />
                                    </tr>
                                    <tr>
                                        <td>
                                            <label
                                                htmlFor="report_file"
                                                className={c.form__label}
                                            >
                                                Файл отчета:
                                            </label>
                                        </td>
                                        <td>
                                            <input
                                                type="file"
                                                id="report_file"
                                                onChange={handleFileChange}
                                                className={
                                                    c.form__input +
                                                    " " +
                                                    c.form__input__file
                                                }
                                                required
                                            />
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
                                value="Загрузить"
                                disabled={loading}
                            />

                            <Button
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "10px",
                                    marginLeft: "10px",
                                    width: "200px",
                                }}
                                variant="secondary"
                                onClick={clearFields}
                                disabled={loading}
                            >
                                Очистить поля
                            </Button>
                        </form>
                        {loading && <LoadingSpinner text="Загружается..."/>}
                        {message && <MessageAlert message={message} variant={"success"}/>}
                        {error && <MessageAlert message={error} variant={"danger"}/>}
                    </div>
                </div>
                <AppFooter />
            </div>
        </div>
    );
};

export default Uploading;
