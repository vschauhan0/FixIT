"use client"

import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Eye, EyeOff, Wrench, User, Briefcase } from "lucide-react"

const Register = () => {
  const [searchParams] = useSearchParams()
  const initialUserType = searchParams.get("type") || "customer"

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    userType: initialUserType,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    // Worker specific fields
    services: [],
    experience: "",
    hourlyRate: { min: "", max: "" },
    description: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const serviceOptions = ["electrician", "carpenter", "painter", "plumber", "cleaner", "gardener", "mechanic"]

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleServiceChange = (service) => {
    const updatedServices = formData.services.includes(service)
      ? formData.services.filter((s) => s !== service)
      : [...formData.services, service]

    setFormData({
      ...formData,
      services: updatedServices,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await register(formData)

    if (result.success) {
      window.location.reload()
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center">
              <Wrench className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Type Selection */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">I want to:</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: "customer" })}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  formData.userType === "customer"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <User className="w-8 h-8 text-primary-600" />
                <span className="font-medium">Find Workers</span>
                <span className="text-sm text-gray-500">I need services</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: "worker" })}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  formData.userType === "worker"
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Briefcase className="w-8 h-8 text-primary-600" />
                <span className="font-medium">Offer Services</span>
                <span className="text-sm text-gray-500">I provide services</span>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pr-10"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  name="address.street"
                  type="text"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  name="address.city"
                  type="text"
                  required
                  value={formData.address.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  name="address.state"
                  type="text"
                  required
                  value={formData.address.state}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your state"
                />
              </div>
            </div>
          </div>

          {/* Worker Specific Fields */}
          {formData.userType === "worker" && (
            <>
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Services Offered</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceOptions.map((service) => (
                    <label key={service} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceChange(service)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm capitalize">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <input
                      name="experience"
                      type="number"
                      min="0"
                      value={formData.experience}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Years of experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate Range ($)</label>
                    <div className="flex space-x-2">
                      <input
                        name="hourlyRate.min"
                        type="number"
                        min="0"
                        value={formData.hourlyRate.min}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Min"
                      />
                      <input
                        name="hourlyRate.max"
                        type="number"
                        min="0"
                        value={formData.hourlyRate.max}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Tell customers about your services and experience..."
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="card">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
