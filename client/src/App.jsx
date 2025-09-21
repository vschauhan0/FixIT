"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"

// Components
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CustomerDashboard from "./pages/CustomerDashboard"
import WorkerDashboard from "./pages/WorkerDashboard"
import WorkerProfile from "./pages/WorkerProfile"
import BookingPage from "./pages/BookingPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.userType}-dashboard`} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.userType}-dashboard`} /> : <Register />} />

        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute userType="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute userType="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/worker/:id" element={<WorkerProfile />} />
        <Route
          path="/book/:workerId"
          element={
            <ProtectedRoute userType="customer">
              <BookingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
