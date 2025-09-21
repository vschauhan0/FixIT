"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Star, MessageCircle, Phone, Wrench, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { dataStore, type Worker, type Booking } from "@/lib/data-store"

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [workers, setWorkers] = useState<Worker[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState("search")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)

      const userBookings = dataStore.getBookingsForCustomer(parsedUser.id)
      setBookings(userBookings)
    } else {
      router.push("/auth/login")
    }

    dataStore.initializeSampleData()
    const allWorkers = dataStore.getAllWorkers()
    setWorkers(allWorkers)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("userType")
    router.push("/")
  }

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesService = selectedService === "" || worker.service === selectedService
    return matchesSearch && matchesService
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const services = ["electrician", "carpenter", "painter", "plumber"]

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
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
            <span className="text-gray-600">Welcome, {user.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="search">Find Workers</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings ({bookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            {/* Search Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Service Providers</h1>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by name or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={selectedService === "" ? "default" : "outline"}
                    onClick={() => setSelectedService("")}
                    className="whitespace-nowrap"
                  >
                    All Services
                  </Button>
                  {services.map((service) => (
                    <Button
                      key={service}
                      variant={selectedService === service ? "default" : "outline"}
                      onClick={() => setSelectedService(service)}
                      className="whitespace-nowrap capitalize"
                    >
                      {service}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Workers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((worker) => (
                <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white">
                            {worker.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{worker.name}</CardTitle>
                          <Badge variant="secondary" className="capitalize">
                            {worker.service}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-semibold">{worker.rating}</span>
                        </div>
                        <p className="text-sm text-gray-500">{worker.completedJobs} jobs</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{worker.address}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600">{worker.priceRange}</span>
                        <Badge variant={worker.available ? "default" : "secondary"}>
                          {worker.available ? "Available" : "Busy"}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{worker.description}</p>

                      <div className="flex gap-2 pt-2">
                        <Link href={`/booking/${worker.id}`} className="flex-1">
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                            disabled={!worker.available}
                          >
                            Book Now
                          </Button>
                        </Link>
                        <Button variant="outline" size="icon">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredWorkers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No workers found matching your criteria.</p>
                <p className="text-gray-400">Try adjusting your search or filters.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {booking.workerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{booking.workerName}</CardTitle>
                          <p className="text-gray-600 capitalize">{booking.service}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-700">{booking.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Budget: {booking.budget}</span>
                        </div>
                      </div>

                      {booking.proposedPrice && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-blue-600">Proposed Price</p>
                          <p className="font-semibold text-blue-800">{booking.proposedPrice}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-4">Start by finding and booking a service provider.</p>
                  <Button
                    onClick={() => setActiveTab("search")}
                    className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                  >
                    Find Workers
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
