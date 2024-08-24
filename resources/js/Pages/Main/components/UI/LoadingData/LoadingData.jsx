import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingData = () => {
    return (
        <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center">
            <Spinner animation="border" role="status" style={{ width: "2.5rem", height: "2.5rem", borderWidth: "4px" }}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
            <span style={{ marginLeft: "10px" }}>Загрузка данных с сервера...</span>
        </div>
    );
};

export default LoadingData;
