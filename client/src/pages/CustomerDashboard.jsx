"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, MapPin, Star, Clock, DollarSign, User, Calendar } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const CustomerDashboard = () => {
  const [workers, setWorkers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    service: "",
    city: "",
    minRating: "",
    maxRate: "",
  })
  const [activeTab, setActiveTab] = useState("search")

  useEffect(() => {
    fetchWorkers()
    fetchBookings()
  }, [])

  const fetchWorkers = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.service) params.append("service", filters.service)
      if (filters.city) params.append("city", filters.city)
      if (filters.minRating) params.append("minRating", filters.minRating)
      if (filters.maxRate) params.append("maxRate", filters.maxRate)

      const response = await axios.get(`/api/workers?${params}`)
      setWorkers(response.data.workers || [])
    } catch (error) {
      console.error("Error fetching workers:", error)
      toast.error("Failed to load workers")
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/bookings")
      setBookings(response.data.bookings || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
    }
  }

  const handleSearch = () => {
    setLoading(true)
    fetchWorkers()
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

  const serviceOptions = ["electrician", "carpenter", "painter", "plumber", "cleaner", "gardener", "mechanic"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Dashboard</h1>
          <p className="text-gray-600">Find and hire trusted service providers in your area</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("search")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "search"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Find Workers
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "bookings"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Bookings ({bookings.length})
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "search" && (
          <>
            {/* Search and Filters */}
            <div className="card mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Services</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Search for services..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                  <select
                    value={filters.service}
                    onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                    className="input-field"
                  >
                    <option value="">All Services</option>
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="input-field"
                    placeholder="Enter city"
                  />
                </div>

                <div className="flex items-end">
                  <button onClick={handleSearch} className="btn-primary w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Workers Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workers.map((worker) => (
                  <div key={worker._id} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{worker.userId?.name}</h3>
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {worker.rating?.average?.toFixed(1) || "0.0"} ({worker.rating?.count || 0} reviews)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {worker.userId?.address?.city}, {worker.userId?.address?.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {worker.services?.map((service) => (
                          <span
                            key={service}
                            className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full capitalize"
                          >
                            {service}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            ${worker.hourlyRate?.min}-${worker.hourlyRate?.max}/hr
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{worker.experience} years exp</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{worker.description}</p>

                      <div className="flex space-x-2">
                        <Link to={`/worker/${worker._id}`} className="flex-1 btn-secondary text-center">
                          View Profile
                        </Link>
                        <Link to={`/book/${worker._id}`} className="flex-1 btn-primary text-center">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && workers.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or location.</p>
              </div>
            )}
          </>
        )}

        {activeTab === "bookings" && (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="card">
                <div className="flex items-start justify-between">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Worker: {booking.workerId?.userId?.name || "TBD"}</span>
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

                    {booking.pricing?.finalPrice && (
                      <div className="mt-3 flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-green-600 font-medium">Final Price: ${booking.pricing.finalPrice}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    {booking.status === "negotiating" && (
                      <button className="btn-primary text-sm">Continue Negotiation</button>
                    )}
                    {booking.status === "completed" && <button className="btn-secondary text-sm">Leave Review</button>}
                  </div>
                </div>
              </div>
            ))}

            {bookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Start by finding and booking a service provider.</p>
                <button onClick={() => setActiveTab("search")} className="btn-primary">
                  Find Workers
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerDashboard
