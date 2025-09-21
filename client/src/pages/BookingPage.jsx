"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, MapPin, DollarSign, User } from "lucide-react"
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
    location: {
      address: "",
    },
    scheduledDate: "",
    estimatedDuration: "",
    customerBudget: {
      min: "",
      max: "",
    },
  })

  useEffect(() => {
    fetchWorker()
  }, [workerId])

  const fetchWorker = async () => {
    try {
      const response = await axios.get(`/api/workers/${workerId}`)
      setWorker(response.data.worker)

      // Set default service type if worker has services
      if (response.data.worker.services && response.data.worker.services.length > 0) {
        setFormData((prev) => ({
          ...prev,
          serviceType: response.data.worker.services[0],
        }))
      }
    } catch (error) {
      console.error("Error fetching worker:", error)
      toast.error("Failed to load worker information")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const bookingData = {
        workerId,
        ...formData,
        estimatedDuration: Number.parseFloat(formData.estimatedDuration),
        customerBudget: {
          min: Number.parseFloat(formData.customerBudget.min),
          max: Number.parseFloat(formData.customerBudget.max),
        },
      }

      const response = await axios.post("/api/bookings", bookingData)

      toast.success("Booking request sent successfully!")
      navigate("/customer-dashboard")
    } catch (error) {
      console.error("Error creating booking:", error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Service</h1>
          <p className="text-gray-600">Request a service from {worker.userId?.name}</p>
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
                      {worker.services?.map((service) => (
                        <option key={service} value={service}>
                          {service.charAt(0).toUpperCase() + service.slice(1)}
                        </option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Describe the work you need done in detail..."
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Range</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Budget ($)</label>
                    <input
                      type="number"
                      name="customerBudget.min"
                      required
                      min="0"
                      value={formData.customerBudget.min}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Min amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Budget ($)</label>
                    <input
                      type="number"
                      name="customerBudget.max"
                      required
                      min="0"
                      value={formData.customerBudget.max}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Max amount"
                    />
                  </div>
                </div>

                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Worker's Rate:</strong> ${worker.hourlyRate?.min}-${worker.hourlyRate?.max}/hour
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Your budget will be used as a starting point for price negotiation.
                  </p>
                </div>
              </div>

              <div className="card">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <span className="text-sm text-gray-600">
                      ⭐ {worker.rating?.average?.toFixed(1) || "0.0"} ({worker.rating?.count || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {worker.userId?.address?.city}, {worker.userId?.address?.state}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    ${worker.hourlyRate?.min}-${worker.hourlyRate?.max}/hour
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{worker.experience} years experience</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Services Offered:</h4>
                <div className="flex flex-wrap gap-2">
                  {worker.services?.map((service) => (
                    <span
                      key={service}
                      className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full capitalize"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="font-medium text-gray-900 mb-3">How it works:</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <span>Submit your booking request with details</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <span>Worker reviews and may negotiate price</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <span>Once agreed, work gets scheduled</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <span>Leave a review after completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
