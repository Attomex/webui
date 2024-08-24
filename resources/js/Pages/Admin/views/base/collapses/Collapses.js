import React, { useState } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'


const Collapses = () => {
  const [visible, setVisible] = useState(false)
  const [visibleHorizontal, setVisibleHorizontal] = useState(false)
  const [visibleA, setVisibleA] = useState(false)
  const [visibleB, setVisibleB] = useState(false)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Collapse</strong>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">You can use a link or a button component.</p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Collapse</strong> <small> Horizontal</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">You can use a link or a button component.</p>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>React Collapse</strong> <small> multi target</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-body-secondary small">
              A <code>&lt;CButton&gt;</code> can show and hide multiple elements.
            </p>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Collapses
