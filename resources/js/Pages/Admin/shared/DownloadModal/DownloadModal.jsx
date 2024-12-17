import React, { useState } from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle, CModalFooter, CButton } from '@coreui/react';

const DownloadModal = ({ visible, onClose, onDownload, selectedErrorLevels, setSelectedErrorLevels, selectedColumns, setSelectedColumns }) => {
    const handleErrorLevelChange = (level) => {
        if (selectedErrorLevels.includes(level)) {
            setSelectedErrorLevels(selectedErrorLevels.filter(l => l !== level));
        } else {
            setSelectedErrorLevels([...selectedErrorLevels, level]);
        }
    };

    const handleColumnChange = (column) => {
        if (selectedColumns.includes(column)) {
            setSelectedColumns(selectedColumns.filter(c => c !== column));
        } else {
            setSelectedColumns([...selectedColumns, column]);
        }
    };

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader onClose={onClose}>
                <CModalTitle>Выберите параметры отчета</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div>
                    <h5>Уровни ошибок:</h5>
                    {["Критический", "Высокий", "Средний", "Низкий"].map(level => (
                        <div key={level}>
                            <input
                                type="checkbox"
                                checked={selectedErrorLevels.includes(level)}
                                onChange={() => handleErrorLevelChange(level)}
                            />
                            {level}
                        </div>
                    ))}
                </div>
                <div>
                    <h5>Столбцы:</h5>
                    {[
                        "Уровень ошибки",
                        "Идентификатор уязвимости",
                        "Название уязвимости",
                        "Описание",
                        "Возможные меры по устранению",
                        "Ссылки на источники",
                        "Ссылки на файлы",
                    ].map(column => (
                        <div key={column}>
                            <input
                                type="checkbox"
                                checked={selectedColumns.includes(column)}
                                onChange={() => handleColumnChange(column)}
                            />
                            {column}
                        </div>
                    ))}
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Закрыть
                </CButton>
                <CButton color="primary" onClick={onDownload}>
                    Скачать отчёт
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default DownloadModal;