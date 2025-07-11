import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProfileList from './components/ProfileList'
import ProfileForm from './components/ProfileForm'
import WorkScheduleMatcher from './components/WorkScheduleMatcher'
import WeeklySchedule from './components/WeeklySchedule'
import Reserved from './components/Reserved'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<ProfileForm />} />
          <Route path="profiles" element={<ProfileList />} />
          <Route path="schedule-matcher" element={<WorkScheduleMatcher />} />
          <Route path="weekly-schedule" element={<WeeklySchedule />} />
          <Route path="reserved" element={<Reserved />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
