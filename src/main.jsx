import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProfileList from './components/ProfileList'
import ProfileForm from './components/ProfileForm'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ProfileForm />} />
          <Route path="profiles" element={<ProfileList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
