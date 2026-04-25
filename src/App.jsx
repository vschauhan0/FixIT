import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import HomePage from "./components/HomePage"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import CustomerDashboard from "./components/dashboard/CustomerDashboard"
import WorkerDashboard from "./components/dashboard/WorkerDashboard"
import BookingPage from "./components/booking/BookingPage"
import ServicesPage from "./components/pages/ServicesPage"
import HowItWorksPage from "./components/pages/HowItWorksPage"
import AboutPage from "./components/pages/AboutPage"
import { dataStore } from "./utils/dataStore"
import "./App.css"

function App() {
  useEffect(() => {
    // Initialize data store without dummy data
    dataStore.initializeStore()
  }, [])

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/worker" element={<WorkerDashboard />} />
          <Route path="/booking/:workerId" element={<BookingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
