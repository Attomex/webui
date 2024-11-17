import React, { useEffect } from 'react'
import './scss/style.scss'

import Main from './Main'

 const AdminPanel = ({ latest }) => {
  return (
    <Main latest={latest}></Main>
  )
}

export default AdminPanel
