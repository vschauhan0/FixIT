"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wrench,
  Search,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  LogOut,
} from "lucide-react"
import { dataStore } from "../../utils/dataStore"

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [workers, setWorkers] = useState([])
  const [bookings, setBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState("all")

  useEffect(() => {
    const user = dataStore.getCurrentUser()
    if (!user || user.type !== "customer") {
      navigate("/login")
      return
    }

    setCurrentUser(user)
    loadData()
  }, [navigate])

  const loadData = () => {
    const allWorkers = dataStore.getAllWorkers()
    const userBookings = dataStore.getBookingsForCustomer(currentUser?.id || "")

    setWorkers(allWorkers)
    setBookings(userBookings)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("userType")
    navigate("/")
  }

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesService = selectedService === "all" || worker.service === selectedService

    return matchesSearch && matchesService && worker.available
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              FixIt
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-gray-500">Customer</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Find Service Providers</CardTitle>
                <CardDescription>Search for workers based on service type and location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search workers, services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="electrician">Electrician</SelectItem>
                      <SelectItem value="carpenter">Carpenter</SelectItem>
                      <SelectItem value="painter">Painter</SelectItem>
                      <SelectItem value="plumber">Plumber</SelectItem>
                      <SelectItem value="cleaner">Cleaner</SelectItem>
                      <SelectItem value="gardener">Gardener</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Workers List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Available Workers ({filteredWorkers.length})</h2>
              {filteredWorkers.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-gray-500">No workers found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredWorkers.map((worker) => (
                  <Card key={worker.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16">
                            <AvatarFallback className="text-lg">
                              {worker.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold">{worker.name}</h3>
                              <Badge variant="secondary" className="capitalize">
                                {worker.service}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{worker.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                <span>{worker.completedJobs} jobs</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{worker.address}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{worker.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                <span>{worker.phone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <span>{worker.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Link to={`/booking/${worker.id}`}>
                            <Button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600">
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* My Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  My Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{booking.workerName}</h4>
                          <Badge className={getStatusColor(booking.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(booking.status)}
                              <span className="capitalize">{booking.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 capitalize">{booking.service}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                    {bookings.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">+{bookings.length - 5} more bookings</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-semibold">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">
                      {bookings.filter((b) => b.status === "completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-semibold text-yellow-600">
                      {bookings.filter((b) => b.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Workers</span>
                    <span className="font-semibold text-blue-600">{workers.filter((w) => w.available).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
