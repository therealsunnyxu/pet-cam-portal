import { Route, Routes } from 'react-router'
import './App.css'
import AccountView from './components/views/AccountView'
import IndexView from './components/views/IndexView'
import LoginView from './components/views/LoginView'

function App() {
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
        <Route index element={<div />} />
        <Route path="account">
          <Route index element={<AccountView />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
