import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CTable } from '@coreui/react';

const ButtonDetails = ({ visible, onClose, selectedVulnerability }) => {
    return (
        <CModal size="xl" scrollable visible={visible} onClose={onClose}>
            <CModalHeader onClose={onClose}>
                <CModalTitle>Подробная информация</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {selectedVulnerability && (
                    <CTable striped hover responsive size="sm">
                        <thead>
                            <tr>
                                <th>Идентификатор уязвимости</th>
                                <th>Название уязвимости</th>
                                <th>Описание</th>
                                <th>Возможные меры по устранению</th>
                                <th>Ссылки на источники</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td dangerouslySetInnerHTML={{ __html: selectedVulnerability.identifiers.replace(/; /g, '<br>') }}></td>
                                <td>{selectedVulnerability.name}</td>
                                <td>{selectedVulnerability.description}</td>
                                <td>{selectedVulnerability.remediation_measures}</td>
                                <td>
                                    <ul>
                                        {selectedVulnerability.source_links.map((link, index) => (
                                            <li key={index}>
                                                <a href={link} target="_blank" rel="noopener noreferrer">
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </CTable>
                )}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>
                    Закрыть
                </CButton>
            </CModalFooter>
        </CModal>
    );
};

export default ButtonDetails;