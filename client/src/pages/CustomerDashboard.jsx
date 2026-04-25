import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, MapPin, Star, Clock, User, Calendar, MessageSquare, CheckCircle, Phone } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"
import { useAuth } from "../contexts/AuthContext"

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [workers, setWorkers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({ service: "", city: "" })
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
      const response = await axios.get(`/api/workers?${params}`)
      setWorkers(response.data.workers || [])
    } catch (error) {
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

  const handleAcceptOffer = async (bookingId) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/accept-offer`)
      toast.success("Offer accepted! Booking confirmed.")
      fetchBookings()
    } catch (error) {
      toast.error("Failed to accept offer")
    }
  }

  const handleCounterOffer = async (bookingId, amount, message) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/negotiate`, { amount, message })
      toast.success("Counter-offer sent to worker!")
      fetchBookings()
    } catch (error) {
      toast.error("Failed to send counter-offer")
    }
  }

  const handleReviewSubmit = async (bookingId, rating, comment) => {
    try {
      await axios.post(`/api/bookings/${bookingId}/review`, { rating, comment })
      toast.success("Review submitted successfully!")
      fetchBookings()
      fetchWorkers() // refresh worker ratings in search tab
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review")
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

  const serviceOptions = ["electrician", "carpenter", "painter", "plumber", "cleaner", "gardener", "mechanic"]

  // Filter workers by search query on the client side
  const filteredWorkers = workers.filter((w) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      w.userId?.name?.toLowerCase().includes(q) ||
      w.services?.some((s) => s.toLowerCase().includes(q)) ||
      w.description?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}! Find and hire trusted service providers.</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["search", "bookings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab === "search" ? "Find Workers" : `My Bookings (${bookings.length})`}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* SEARCH TAB */}
        {activeTab === "search" && (
          <>
            {/* Search and Filters */}
            <div className="card mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Workers</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Search by name or service..."
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
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={handleSearch} className="btn-primary w-full flex items-center justify-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search</span>
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
                {filteredWorkers.map((worker) => (
                  <div key={worker._id} className="card hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{worker.userId?.name}</h3>
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className={`w-4 h-4 ${worker.rating?.average > 0 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                          <span className="text-sm text-gray-600">
                            {worker.rating?.average > 0
                              ? `${worker.rating.average.toFixed(1)} (${worker.rating.count} reviews)`
                              : "No Reviews"}
                          </span>
                        </div>
                        {worker.userId?.address?.city && (
                          <div className="flex items-center space-x-1 mb-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {worker.userId.address.city}{worker.userId.address.state ? `, ${worker.userId.address.state}` : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      {/* Service Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {worker.services?.map((service) => (
                          <span key={service} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full capitalize">
                            {service}
                          </span>
                        ))}
                      </div>

                      {/* Experience only — NO price shown */}
                      <div className="flex items-center space-x-1 mb-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{worker.experience} years experience</span>
                      </div>

                      {worker.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{worker.description}</p>
                      )}

                      <div className="flex space-x-2">
                        <Link to={`/worker/${worker._id}`} className="flex-1 btn-secondary text-center text-sm">
                          View Profile
                        </Link>
                        <Link to={`/book/${worker._id}`} className="flex-1 btn-primary text-center text-sm">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filteredWorkers.length === 0 && (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
                <p className="text-gray-600">Try adjusting your search criteria.</p>
              </div>
            )}
          </>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {bookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Start by finding and booking a service provider.</p>
                <button onClick={() => setActiveTab("search")} className="btn-primary">Find Workers</button>
              </div>
            )}
            {bookings.map((booking) => (
              <CustomerBookingCard
                key={booking._id}
                booking={booking}
                getStatusColor={getStatusColor}
                onAcceptOffer={handleAcceptOffer}
                onCounterOffer={handleCounterOffer}
                onReviewSubmit={handleReviewSubmit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const CustomerBookingCard = ({ booking, getStatusColor, onAcceptOffer, onCounterOffer, onReviewSubmit }) => {
  const [showCounter, setShowCounter] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [counterData, setCounterData] = useState({ amount: "", message: "" })
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" })

  const workerPhone = booking.workerId?.userId?.phone
  const latestOffer = booking.pricing?.negotiationHistory?.slice(-1)[0]
  const workerHasMadeOffer = latestOffer?.from === "worker"

  const handleCounterSubmit = (e) => {
    e.preventDefault()
    onCounterOffer(booking._id, parseFloat(counterData.amount), counterData.message)
    setShowCounter(false)
    setCounterData({ amount: "", message: "" })
  }

  const handleReviewSubmitLocal = (e) => {
    e.preventDefault()
    onReviewSubmit(booking._id, reviewData.rating, reviewData.comment)
    setShowReviewForm(false)
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.serviceType?.charAt(0).toUpperCase() + booking.serviceType?.slice(1)} Service
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
            </span>
          </div>

          <p className="text-gray-600 mb-3">{booking.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Worker: <strong>{booking.workerId?.userId?.name || "Assigned"}</strong></span>
            </div>
            {workerPhone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-500" />
                <a href={`tel:${workerPhone}`} className="text-green-600 font-medium hover:underline">
                  Call: {workerPhone}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{booking.location?.address}</span>
            </div>
          </div>

          {/* Final agreed price */}
          {booking.pricing?.finalPrice > 0 && (
            <div className="mt-2 inline-flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Agreed Price: ₹{booking.pricing.finalPrice}</span>
            </div>
          )}

          {/* Negotiation history */}
          {booking.pricing?.negotiationHistory?.length > 0 && booking.status !== "completed" && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">Price Negotiation:</h4>
              <div className="space-y-1">
                {booking.pricing.negotiationHistory.map((nego, i) => (
                  <div key={i} className={`text-sm p-2 rounded ${nego.from === "customer" ? "bg-primary-50 text-primary-800 ml-4" : "bg-secondary-50 text-secondary-800"}`}>
                    <span className="font-medium capitalize">{nego.from === "customer" ? "You" : "Worker"}:</span> ₹{nego.amount}
                    {nego.message && <span className="ml-1 text-gray-600">— {nego.message}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Display */}
          {booking.review && booking.review.rating && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Your Review</h4>
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= booking.review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              {booking.review.comment && <p className="text-sm text-gray-700 italic">"{booking.review.comment}"</p>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 ml-4 min-w-[130px]">
          {/* If worker sent a counter-offer, customer can accept or counter */}
          {booking.status === "negotiating" && workerHasMadeOffer && (
            <>
              <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded text-center">
                Worker offered: ₹{latestOffer.amount}
              </div>
              <button
                onClick={() => onAcceptOffer(booking._id)}
                className="btn-primary text-sm flex items-center justify-center space-x-1"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Accept Offer</span>
              </button>
              <button
                onClick={() => setShowCounter(!showCounter)}
                className="btn-secondary text-sm flex items-center justify-center space-x-1"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Counter</span>
              </button>
            </>
          )}

          {booking.status === "accepted" && (
            <div className="text-center text-green-600 font-medium text-sm">✅ Accepted</div>
          )}
          
          {booking.status === "completed" && (
            <div className="flex flex-col items-center space-y-2">
              <div className="text-center text-gray-600 font-medium text-sm">✅ Completed</div>
              {!booking.review?.rating && (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn-secondary text-sm w-full"
                >
                  <Star className="w-4 h-4 inline mr-1 text-yellow-500" />
                  Leave Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && !booking.review?.rating && (
        <form onSubmit={handleReviewSubmitLocal} className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-medium text-gray-900 mb-3">Rate your experience</h4>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${star <= reviewData.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">{reviewData.rating} out of 5</span>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              className="input-field"
              rows="2"
              placeholder="How was the service?"
            />
          </div>
          <div className="flex space-x-2 mt-3">
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
              Submit Review
            </button>
            <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Counter form */}
      {showCounter && (
        <form onSubmit={handleCounterSubmit} className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Your Counter-Offer</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={counterData.amount}
                onChange={(e) => setCounterData({ ...counterData, amount: e.target.value })}
                className="input-field"
                placeholder="Enter your offer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <input
                type="text"
                value={counterData.message}
                onChange={(e) => setCounterData({ ...counterData, message: e.target.value })}
                className="input-field"
                placeholder="Reason for counter..."
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-3">
            <button type="submit" className="btn-primary text-sm">Send Counter</button>
            <button type="button" onClick={() => setShowCounter(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CustomerDashboard
