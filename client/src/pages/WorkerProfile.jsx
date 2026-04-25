"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Star, MapPin, Clock, DollarSign, User, Phone, Mail, Award } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const WorkerProfile = () => {
  const { id } = useParams()
  const [worker, setWorker] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkerProfile()
    fetchReviews()
  }, [id])

  const fetchWorkerProfile = async () => {
    try {
      const response = await axios.get(`/api/workers/${id}`)
      setWorker(response.data.worker)
    } catch (error) {
      console.error("Error fetching worker profile:", error)
      toast.error("Failed to load worker profile")
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/worker/${id}`)
      setReviews(response.data.reviews || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
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
          <p className="text-gray-600 mb-4">The worker profile you're looking for doesn't exist.</p>
          <Link to="/customer-dashboard" className="btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="card mb-8">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary-600" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{worker.userId?.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {renderStars(worker.rating?.average || 0)}
                  <span className="text-sm text-gray-600 ml-2">
                    {worker.rating?.average?.toFixed(1) || "0.0"} ({worker.rating?.count || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {worker.userId?.address?.city}, {worker.userId?.address?.state}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {worker.services?.map((service) => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full capitalize"
                  >
                    {service}
                  </span>
                ))}
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{worker.experience} years experience</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    ${worker.hourlyRate?.min}-${worker.hourlyRate?.max}/hour
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{worker.completedJobs || 0} jobs completed</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Link to={`/book/${worker._id}`} className="btn-primary">
                Book Now
              </Link>
              <button className="btn-secondary">
                <Phone className="w-4 h-4 mr-2" />
                Contact
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{worker.description || "No description provided."}</p>
            </div>

            {/* Portfolio */}
            {worker.portfolio && worker.portfolio.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {worker.portfolio.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-xs text-gray-500">
                        Completed: {new Date(item.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews ({reviews.length})</h2>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">{review.customerId?.name || "Anonymous"}</span>
                            <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p className="text-gray-600">{review.comment}</p>

                          {review.categories && (
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              {Object.entries(review.categories).map(([category, rating]) => (
                                <div key={category} className="flex items-center space-x-1">
                                  <span className="text-gray-500 capitalize">{category}:</span>
                                  <span className="font-medium">{rating}/5</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{worker.userId?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{worker.userId?.phone}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <div>{worker.userId?.address?.street}</div>
                    <div>
                      {worker.userId?.address?.city}, {worker.userId?.address?.state}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            {worker.availability && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-2">
                  {worker.availability.days?.map((day) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="capitalize text-gray-600">{day}</span>
                      <span className="text-gray-900">
                        {worker.availability.hours?.start} - {worker.availability.hours?.end}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {worker.certifications && worker.certifications.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                <div className="space-y-2">
                  {worker.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-gray-600">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkerProfile
