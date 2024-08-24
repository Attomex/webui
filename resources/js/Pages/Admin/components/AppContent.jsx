import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
    </CContainer>
  )
}

export default React.memo(AppContent)
