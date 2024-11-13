import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = ({ text }) => {
    return (
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
            <span className="sr-only">{text}</span>
        </Spinner>
        <span style={{ marginLeft: "10px" }}>{text}</span>
    </div>
)};

export default LoadingSpinner;
