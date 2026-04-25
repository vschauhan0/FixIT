import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, MapPin, User, Phone, MessageCircle, Star, Briefcase } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const BookingPage = () => {
  const { workerId } = useParams()
  const navigate = useNavigate()
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    location: { address: "" },
    scheduledDate: "",
    estimatedDuration: "",
    customerBudget: { min: "", max: "" },
  })

  useEffect(() => {
    fetchWorker()
  }, [workerId])

  const fetchWorker = async () => {
    try {
      const response = await axios.get(`/api/workers/${workerId}`)
      setWorker(response.data.worker)
      if (response.data.worker.services?.length > 0) {
        setFormData((prev) => ({ ...prev, serviceType: response.data.worker.services[0] }))
      }
    } catch (error) {
      toast.error("Failed to load worker information")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const bookingData = {
        workerId,
        ...formData,
        estimatedDuration: parseFloat(formData.estimatedDuration),
        customerBudget: {
          min: parseFloat(formData.customerBudget.min),
          max: parseFloat(formData.customerBudget.max),
        },
      }
      await axios.post("/api/bookings", bookingData)
      toast.success("Booking request sent! The worker will review and respond.")
      navigate("/customer-dashboard")
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create booking"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Worker not found</h2>
          <p className="text-gray-600">Unable to load worker information.</p>
        </div>
      </div>
    )
  }

  const workerPhone = worker.userId?.phone

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Service</h1>
          <p className="text-gray-600">Send a booking request to <strong>{worker.userId?.name}</strong></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Details */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                    <select
                      name="serviceType"
                      required
                      value={formData.serviceType}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select a service</option>
                      {worker.services?.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Duration (hours)</label>
                    <input
                      type="number"
                      name="estimatedDuration"
                      required
                      min="0.5"
                      step="0.5"
                      value={formData.estimatedDuration}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 2.5"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe the Work Needed</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Be specific — e.g., 'Fix leaking bathroom tap and replace kitchen pipe under sink...'"
                  />
                </div>
              </div>

              {/* Schedule & Location */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Schedule & Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      name="scheduledDate"
                      required
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      className="input-field"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
                    <input
                      type="text"
                      name="location.address"
                      required
                      value={formData.location.address}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter the service location"
                    />
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Budget (₹)</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Set your budget range. The worker may accept it or send a counter-offer for you to review.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum (₹)</label>
                    <input
                      type="number"
                      name="customerBudget.min"
                      required
                      min="0"
                      value={formData.customerBudget.min}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum (₹)</label>
                    <input
                      type="number"
                      name="customerBudget.max"
                      required
                      min="0"
                      value={formData.customerBudget.max}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 500"
                    />
                  </div>
                </div>
              </div>

              <div className="card">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3"
                >
                  {submitting ? "Sending Request..." : "Send Booking Request"}
                </button>
              </div>
            </form>
          </div>

          {/* Worker Summary */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{worker.userId?.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {worker.rating?.average > 0
                        ? `${worker.rating.average.toFixed(1)} (${worker.rating.count} reviews)`
                        : "New Worker"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {worker.userId?.address?.city && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {worker.userId.address.city}{worker.userId.address.state ? `, ${worker.userId.address.state}` : ""}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{worker.experience} years experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{worker.completedJobs || 0} jobs completed</span>
                </div>
              </div>

              {/* Contact Buttons */}
              {workerPhone && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Contact Worker Directly:</p>
                  <a
                    href={`tel:${workerPhone}`}
                    className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-green-50 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">Call: {workerPhone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${workerPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-medium">WhatsApp</span>
                  </a>
                </div>
              )}

              {/* Service Tags */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Services Offered:</h4>
                <div className="flex flex-wrap gap-2">
                  {worker.services?.map((s) => (
                    <span key={s} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full capitalize">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="card">
              <h4 className="font-medium text-gray-900 mb-3">How Booking Works:</h4>
              <div className="space-y-3 text-sm text-gray-600">
                {[
                  "Submit your booking request with description & budget",
                  "Worker reviews and accepts OR sends a counter-offer",
                  "You can accept the offer or negotiate further",
                  "Once agreed, the worker comes to do the job",
                  "Worker marks job as complete — rating updates automatically",
                ].map((step, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
