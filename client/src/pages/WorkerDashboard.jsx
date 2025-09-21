"use client"

import { useState, useEffect } from "react"
import { Calendar, DollarSign, Star, Clock, User, MapPin, MessageSquare, CheckCircle } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const WorkerDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    averageRating: 0,
    pendingBookings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("bookings")

  useEffect(() => {
    fetchBookings()
    calculateStats()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/bookings")
      setBookings(response.data.bookings || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    // This would typically come from the backend
    const completedBookings = bookings.filter((b) => b.status === "completed")
    const pendingBookings = bookings.filter((b) => b.status === "pending")

    setStats({
      totalEarnings: completedBookings.reduce((sum, b) => sum + (b.pricing?.finalPrice || 0), 0),
      completedJobs: completedBookings.length,
      averageRating: 4.8, // This would come from reviews
      pendingBookings: pendingBookings.length,
    })
  }

  const handleAcceptBooking = async (bookingId, finalPrice) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/accept`, { finalPrice })
      toast.success("Booking accepted!")
      fetchBookings()
    } catch (error) {
      console.error("Error accepting booking:", error)
      toast.error("Failed to accept booking")
    }
  }

  const handleNegotiate = async (bookingId, amount, message) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/negotiate`, { amount, message })
      toast.success("Negotiation offer sent!")
      fetchBookings()
    } catch (error) {
      console.error("Error sending negotiation:", error)
      toast.error("Failed to send negotiation")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      negotiating: "bg-blue-100 text-blue-800",
      accepted: "bg-green-100 text-green-800",
      "in-progress": "bg-purple-100 text-purple-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Worker Dashboard</h1>
          <p className="text-gray-600">Manage your bookings and track your earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Booking Requests ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile Settings
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "bookings" && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onAccept={handleAcceptBooking}
                onNegotiate={handleNegotiate}
                getStatusColor={getStatusColor}
              />
            ))}

            {bookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No booking requests</h3>
                <p className="text-gray-600">New booking requests will appear here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && <ProfileSettings />}
      </div>
    </div>
  )
}

const BookingCard = ({ booking, onAccept, onNegotiate, getStatusColor }) => {
  const [showNegotiation, setShowNegotiation] = useState(false)
  const [negotiationData, setNegotiationData] = useState({
    amount: "",
    message: "",
  })

  const handleNegotiationSubmit = (e) => {
    e.preventDefault()
    onNegotiate(booking._id, Number.parseFloat(negotiationData.amount), negotiationData.message)
    setShowNegotiation(false)
    setNegotiationData({ amount: "", message: "" })
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1)} Service
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <p className="text-gray-600 mb-3">{booking.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Customer: {booking.customerId?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{booking.location?.address}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{booking.estimatedDuration} hours</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Customer Budget: ${booking.pricing?.customerBudget?.min}-${booking.pricing?.customerBudget?.max}
              </span>
            </div>
          </div>

          {booking.pricing?.negotiationHistory && booking.pricing.negotiationHistory.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Negotiation History:</h4>
              <div className="space-y-2">
                {booking.pricing.negotiationHistory.map((nego, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium capitalize">{nego.from}:</span> ${nego.amount}
                    {nego.message && <span className="text-gray-600"> - {nego.message}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          {booking.status === "pending" && (
            <>
              <button
                onClick={() => onAccept(booking._id, booking.pricing?.customerBudget?.max)}
                className="btn-primary text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept
              </button>
              <button onClick={() => setShowNegotiation(!showNegotiation)} className="btn-secondary text-sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                Negotiate
              </button>
            </>
          )}

          {booking.status === "negotiating" && (
            <button onClick={() => setShowNegotiation(!showNegotiation)} className="btn-primary text-sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              Continue Negotiation
            </button>
          )}
        </div>
      </div>

      {showNegotiation && (
        <form onSubmit={handleNegotiationSubmit} className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Send Counter Offer</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={negotiationData.amount}
                onChange={(e) => setNegotiationData({ ...negotiationData, amount: e.target.value })}
                className="input-field"
                placeholder="Enter your price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
              <input
                type="text"
                value={negotiationData.message}
                onChange={(e) => setNegotiationData({ ...negotiationData, message: e.target.value })}
                className="input-field"
                placeholder="Add a message..."
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-3">
            <button type="submit" className="btn-primary text-sm">
              Send Offer
            </button>
            <button type="button" onClick={() => setShowNegotiation(false)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    services: [],
    experience: "",
    hourlyRate: { min: "", max: "" },
    description: "",
    availability: {
      days: [],
      hours: { start: "", end: "" },
    },
  })
  const [loading, setLoading] = useState(false)

  const serviceOptions = ["electrician", "carpenter", "painter", "plumber", "cleaner", "gardener", "mechanic"]
  const dayOptions = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  const handleServiceChange = (service) => {
    const updatedServices = profileData.services.includes(service)
      ? profileData.services.filter((s) => s !== service)
      : [...profileData.services, service]

    setProfileData({ ...profileData, services: updatedServices })
  }

  const handleDayChange = (day) => {
    const updatedDays = profileData.availability.days.includes(day)
      ? profileData.availability.days.filter((d) => d !== day)
      : [...profileData.availability.days, day]

    setProfileData({
      ...profileData,
      availability: { ...profileData.availability, days: updatedDays },
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.put("/api/workers/profile", profileData)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {serviceOptions.map((service) => (
            <label key={service} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.services.includes(service)}
                onChange={() => handleServiceChange(service)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm capitalize">{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input
              type="number"
              min="0"
              value={profileData.experience}
              onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
              className="input-field"
              placeholder="Years of experience"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate Range ($)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={profileData.hourlyRate.min}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    hourlyRate: { ...profileData.hourlyRate, min: e.target.value },
                  })
                }
                className="input-field"
                placeholder="Min"
              />
              <input
                type="number"
                min="0"
                value={profileData.hourlyRate.max}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    hourlyRate: { ...profileData.hourlyRate, max: e.target.value },
                  })
                }
                className="input-field"
                placeholder="Max"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="3"
              value={profileData.description}
              onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
              className="input-field"
              placeholder="Tell customers about your services and experience..."
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {dayOptions.map((day) => (
                <label key={day} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profileData.availability.days.includes(day)}
                    onChange={() => handleDayChange(day)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm capitalize">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={profileData.availability.hours.start}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    availability: {
                      ...profileData.availability,
                      hours: { ...profileData.availability.hours, start: e.target.value },
                    },
                  })
                }
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={profileData.availability.hours.end}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    availability: {
                      ...profileData.availability,
                      hours: { ...profileData.availability.hours, end: e.target.value },
                    },
                  })
                }
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating Profile..." : "Update Profile"}
        </button>
      </div>
    </form>
  )
}

export default WorkerDashboard
