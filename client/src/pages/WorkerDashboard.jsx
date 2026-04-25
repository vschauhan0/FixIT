import { useState, useEffect } from "react"
import { Calendar, IndianRupee, Star, Clock, User, MapPin, MessageSquare, CheckCircle, XCircle, Phone, Briefcase } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "../contexts/AuthContext"

const WorkerDashboard = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [workerProfile, setWorkerProfile] = useState(null)
  const [stats, setStats] = useState({ totalEarnings: 0, completedJobs: 0, averageRating: 0, pendingBookings: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("bookings")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bookingsRes, meRes] = await Promise.all([
        axios.get("/api/bookings"),
        axios.get("/api/auth/me"),
      ])
      const bkgs = bookingsRes.data.bookings || []
      setBookings(bkgs)

      const wp = meRes.data.workerProfile
      setWorkerProfile(wp)

      // Build stats from REAL data
      const completed = bkgs.filter((b) => b.status === "completed")
      const pending = bkgs.filter((b) => b.status === "pending")
      setStats({
        totalEarnings: wp?.revenue ?? completed.reduce((sum, b) => sum + (b.pricing?.finalPrice || 0), 0),
        completedJobs: wp?.completedJobs ?? completed.length,
        averageRating: wp?.rating?.average ?? 0,
        pendingBookings: pending.length,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptBooking = async (bookingId, finalPrice) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/accept`, { finalPrice })
      toast.success("Booking accepted!")
      fetchData()
    } catch (error) {
      toast.error("Failed to accept booking")
    }
  }

  const handleDecline = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/decline`, { reason: "Declined by worker" })
      toast.success("Booking declined")
      fetchData()
    } catch (error) {
      toast.error("Failed to decline booking")
    }
  }

  const handleNegotiate = async (bookingId, amount, message) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/negotiate`, { amount, message })
      toast.success("Counter-offer sent!")
      fetchData()
    } catch (error) {
      toast.error("Failed to send counter-offer")
    }
  }

  const handleComplete = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/complete`)
      toast.success("Job marked as completed! Earnings updated.")
      fetchData()
    } catch (error) {
      toast.error("Failed to mark as completed")
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
          <p className="text-gray-600">Welcome back, {user?.name}! Manage your bookings and track your earnings.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
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
                <p className="text-sm text-gray-600">Your Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedJobs === 0 ? "New" : `${stats.averageRating.toFixed(1)} ⭐`}
                </p>
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
              {["bookings", "profile"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab === "bookings" ? `Booking Requests (${bookings.length})` : "Profile Settings"}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === "bookings" && (
          <div className="space-y-6">
            {bookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No booking requests</h3>
                <p className="text-gray-600">New booking requests will appear here.</p>
              </div>
            )}
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onAccept={handleAcceptBooking}
                onDecline={handleDecline}
                onNegotiate={handleNegotiate}
                onComplete={handleComplete}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}

        {activeTab === "profile" && <ProfileSettings workerProfile={workerProfile} onUpdate={fetchData} />}
      </div>
    </div>
  )
}

const BookingCard = ({ booking, onAccept, onDecline, onNegotiate, onComplete, getStatusColor }) => {
  const [showNegotiation, setShowNegotiation] = useState(false)
  const [negotiationData, setNegotiationData] = useState({ amount: "", message: "" })
  const customerPhone = booking.customerId?.phone

  const handleNegotiationSubmit = (e) => {
    e.preventDefault()
    onNegotiate(booking._id, parseFloat(negotiationData.amount), negotiationData.message)
    setShowNegotiation(false)
    setNegotiationData({ amount: "", message: "" })
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.serviceType?.charAt(0).toUpperCase() + booking.serviceType?.slice(1)} Service
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
            </span>
          </div>

          {/* Job Description */}
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Job Description:</p>
            <p className="text-gray-600">{booking.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span>Customer: <strong>{booking.customerId?.name}</strong></span>
            </div>
            {customerPhone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-500" />
                <a href={`tel:${customerPhone}`} className="text-green-600 font-medium hover:underline">
                  {customerPhone}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{booking.location?.address}</span>
            </div>
          </div>

          {/* Customer Budget */}
          <div className="flex items-center space-x-4 text-sm mb-3">
            <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
              <IndianRupee className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">
                Customer Budget: ₹{booking.pricing?.customerBudget?.min}–₹{booking.pricing?.customerBudget?.max}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{booking.estimatedDuration} hrs</span>
            </div>
          </div>

          {/* Accepted / Final Price */}
          {booking.pricing?.finalPrice > 0 && (
            <div className="mb-3 flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <span className="text-green-700 font-semibold">Agreed Price: ₹{booking.pricing.finalPrice}</span>
            </div>
          )}

          {/* Negotiation History */}
          {booking.pricing?.negotiationHistory?.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Negotiation History:</h4>
              <div className="space-y-2">
                {booking.pricing.negotiationHistory.map((nego, index) => (
                  <div key={index} className={`text-sm p-2 rounded ${nego.from === "worker" ? "bg-primary-50 text-primary-800" : "bg-secondary-50 text-secondary-800"}`}>
                    <span className="font-medium capitalize">{nego.from}:</span> ₹{nego.amount}
                    {nego.message && <span className="text-gray-600"> — {nego.message}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 ml-4 min-w-[130px]">
          {booking.status === "pending" && (
            <>
              <button
                onClick={() => onAccept(booking._id, booking.pricing?.customerBudget?.max)}
                className="btn-primary text-sm flex items-center justify-center space-x-1"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => setShowNegotiation(!showNegotiation)}
                className="btn-secondary text-sm flex items-center justify-center space-x-1"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Counter Offer</span>
              </button>
              <button
                onClick={() => onDecline(booking._id)}
                className="text-sm border border-red-300 text-red-600 hover:bg-red-50 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-1"
              >
                <XCircle className="w-4 h-4" />
                <span>Decline</span>
              </button>
            </>
          )}

          {booking.status === "negotiating" && (
            <>
              <button
                onClick={() => onAccept(booking._id, booking.pricing?.customerBudget?.max)}
                className="btn-primary text-sm"
              >
                Accept Budget
              </button>
              <button
                onClick={() => setShowNegotiation(!showNegotiation)}
                className="btn-secondary text-sm"
              >
                Counter Again
              </button>
            </>
          )}

          {booking.status === "accepted" && (
            <button
              onClick={() => onComplete(booking._id)}
              className="btn-primary text-sm flex items-center justify-center space-x-1"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Complete</span>
            </button>
          )}

          {booking.status === "completed" && (
            <div className="text-center text-green-600 font-medium text-sm">
              ✅ Completed
            </div>
          )}
        </div>
      </div>

      {/* Counter-offer form */}
      {showNegotiation && (
        <form onSubmit={handleNegotiationSubmit} className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Send Counter-Offer</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="1"
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
                placeholder="e.g., Includes materials"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-3">
            <button type="submit" className="btn-primary text-sm">Send Offer</button>
            <button type="button" onClick={() => setShowNegotiation(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}

const ProfileSettings = ({ workerProfile, onUpdate }) => {
  const [profileData, setProfileData] = useState({
    services: workerProfile?.services || [],
    experience: workerProfile?.experience || "",
    hourlyRate: {
      min: workerProfile?.hourlyRate?.min || "",
      max: workerProfile?.hourlyRate?.max || ""
    },
    description: workerProfile?.description || "",
    availability: {
      days: workerProfile?.availability?.days || [],
      hours: {
        start: workerProfile?.availability?.hours?.start || "",
        end: workerProfile?.availability?.hours?.end || ""
      }
    },
  })
  const [loading, setLoading] = useState(false)

  const serviceOptions = ["electrician", "carpenter", "painter", "plumber", "cleaner", "gardener", "mechanic"]
  const dayOptions = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  const handleServiceChange = (service) => {
    const updated = profileData.services.includes(service)
      ? profileData.services.filter((s) => s !== service)
      : [...profileData.services, service]
    setProfileData({ ...profileData, services: updated })
  }

  const handleDayChange = (day) => {
    const updated = profileData.availability.days.includes(day)
      ? profileData.availability.days.filter((d) => d !== day)
      : [...profileData.availability.days, day]
    setProfileData({ ...profileData, availability: { ...profileData.availability, days: updated } })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put("/api/workers/profile", profileData)
      toast.success("Profile updated successfully!")
      onUpdate()
    } catch (error) {
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate Range (₹)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                value={profileData.hourlyRate.min}
                onChange={(e) => setProfileData({ ...profileData, hourlyRate: { ...profileData.hourlyRate, min: e.target.value } })}
                className="input-field"
                placeholder="Min"
              />
              <input
                type="number"
                min="0"
                value={profileData.hourlyRate.max}
                onChange={(e) => setProfileData({ ...profileData, hourlyRate: { ...profileData.hourlyRate, max: e.target.value } })}
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
                onChange={(e) => setProfileData({ ...profileData, availability: { ...profileData.availability, hours: { ...profileData.availability.hours, start: e.target.value } } })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={profileData.availability.hours.end}
                onChange={(e) => setProfileData({ ...profileData, availability: { ...profileData.availability, hours: { ...profileData.availability.hours, end: e.target.value } } })}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Updating Profile..." : "Update Profile"}
        </button>
      </div>
    </form>
  )
}

export default WorkerDashboard
