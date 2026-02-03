import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import AccountView from './components/views/AccountView'
import DashboardView from './components/views/DashboardView'
import IndexView from './components/views/IndexView'
import LoginView from './components/views/LoginView'
import PasswordResetConfirmView from './components/views/password-reset/PasswordResetConfirmView'
import PasswordResetRequestView from './components/views/password-reset/PasswordResetRequestView'
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
        <Route index element={<PasswordResetRequestView />} />
        <Route path=":uidb64/:token" element={<PasswordResetConfirmView />} />
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
