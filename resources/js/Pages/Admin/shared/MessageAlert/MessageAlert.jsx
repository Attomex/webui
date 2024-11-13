import React from "react";
import { Alert } from "react-bootstrap";

const MessageAlert = ({ message, variant }) => {
    return (
        <Alert style ={{ width: "max-content" }} variant={variant}>
            {message}
        </Alert>
    );
};

export default MessageAlert;