import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import AccountView from './components/views/AccountView'
import DashboardView from './components/views/DashboardView'
import IndexView from './components/views/IndexView'
import LoginView from './components/views/LoginView'
import SITE_URL from './site'

function App() {
  useEffect(function () {
    (async function () {
      await fetch(`${SITE_URL}/api/auth/token/csrf`, {
        method: 'GET',
        credentials: "include"
      })
    })();
  }, [])

  return (
    <Routes>
      <Route index element={<IndexView />} />
      <Route path="login" element={<LoginView />} />
      <Route path="reset-password">
        <Route index element={<div />} />
        <Route path=":uidb64/:token" element={<div />} />
        <Route path="submitted" element={<div />} />
        <Route path="error" element={<div />} />
        <Route path="done" element={<div />} />
      </Route>
      <Route path="dashboard">
        <Route index element={<DashboardView />} />
        <Route path="account">
          <Route index element={<AccountView />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
