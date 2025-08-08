import { Route, Routes } from 'react-router'
import './App.css'

function App() {
  return (
    <Routes>
      <Route index element={<div />} />
      <Route path="login" element={<div />} />
      <Route path="logout" element={<div />} />
      <Route path="reset-password">
        <Route index element={<div />} />
        <Route path="confirm" element={<div />} />
        <Route path="done" element={<div />} />
      </Route>
      <Route path="dashboard">
        <Route index element={<div />} />
        <Route path="account">
          <Route index element={<div />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
