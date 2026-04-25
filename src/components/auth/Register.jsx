"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, User, Mail, Phone, MapPin, Briefcase, Clock } from "lucide-react"
import { dataStore } from "../../utils/dataStore"

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialUserType = searchParams.get("type") || "customer"

  const [userType, setUserType] = useState(initialUserType)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    // Worker specific fields
    service: "",
    experience: "",
    description: "",
    priceRange: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const services = [
    { value: "electrician", label: "Electrician" },
    { value: "carpenter", label: "Carpenter" },
    { value: "painter", label: "Painter" },
    { value: "plumber", label: "Plumber" },
    { value: "cleaner", label: "Cleaner" },
    { value: "gardener", label: "Gardener" },
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password) {
        setError("Please fill in all required fields")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      if (userType === "worker" && (!formData.service || !formData.experience || !formData.description)) {
        setError("Please fill in all worker-specific fields")
        return
      }

      // Check if user already exists
      const existingUsers = dataStore.getAllUsers()
      if (existingUsers.find((u) => u.email === formData.email)) {
        setError("User with this email already exists")
        return
      }

      // Create user object with unique ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const newUser = {
        id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
        type: userType,
        createdAt: new Date().toISOString(),
      }

      if (userType === "worker") {
        const workerData = {
          ...newUser,
          service: formData.service,
          experience: formData.experience,
          description: formData.description,
          rating: 0,
          completedJobs: 0,
          revenue: 0,
          available: true,
        }
        dataStore.saveWorker(workerData)
      } else {
        dataStore.saveUser(newUser)
      }

      // Redirect to appropriate dashboard
      if (userType === "worker") {
        navigate("/dashboard/worker")
      } else {
        navigate("/dashboard/customer")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              FixIt
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join our community of service providers and customers</CardDescription>
        </CardHeader>

        <CardContent>
          {/* User Type Selection */}
          <div className="mb-6">
            <Label className="text-base font-medium">I want to:</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                type="button"
                variant={userType === "customer" ? "default" : "outline"}
                onClick={() => setUserType("customer")}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <User className="w-6 h-6" />
                <span>Find Workers</span>
                <span className="text-xs opacity-70">I need services</span>
              </Button>
              <Button
                type="button"
                variant={userType === "worker" ? "default" : "outline"}
                onClick={() => setUserType("worker")}
                className="h-auto p-4 flex flex-col items-center gap-2"
              >
                <Briefcase className="w-6 h-6" />
                <span>Offer Services</span>
                <span className="text-xs opacity-70">I provide services</span>
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Worker Specific Fields */}
            {userType === "worker" && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Type *</Label>
                    <Select onValueChange={(value) => handleSelectChange("service", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="experience"
                        name="experience"
                        placeholder="e.g., 5"
                        value={formData.experience}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range (Optional)</Label>
                  <Input
                    id="priceRange"
                    name="priceRange"
                    placeholder="e.g., ₹200-400/hr"
                    value={formData.priceRange}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your services, expertise, and what makes you unique..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
