import React from 'react';
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from "@coreui/react";
import { Button } from "react-bootstrap";

const ButtonDelete = ({ visible, onClose, onDelete, selectedComputer, selectedDate }) => {
    return (
        <CModal alignment="center" visible={visible} onClose={onClose}>
            <CModalHeader>
                <CModalTitle>Подтверждение удаления</CModalTitle>
            </CModalHeader>
            <CModalBody>
                Вы уверены, что хотите удалить отчет {selectedComputer} от {selectedDate}?
            </CModalBody>
            <CModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Отмена
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Удалить
                </Button>
            </CModalFooter>
        </CModal>
    );
};

export default ButtonDelete;