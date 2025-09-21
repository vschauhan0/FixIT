"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin, Phone, MessageCircle, ArrowLeft, Wrench } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { dataStore } from "@/lib/data-store"

export default function BookingPage() {
  const [user, setUser] = useState<any>(null)
  const [worker, setWorker] = useState<any | null>(null)
  const [bookingData, setBookingData] = useState({
    description: "",
    budget: "",
    proposedPrice: "",
    urgency: "normal",
  })
  const [loading, setLoading] = useState(false)
  const [showBargaining, setShowBargaining] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/auth/login")
    }

    const foundWorker = dataStore.getWorkerById(params.workerId as string)
    if (foundWorker) {
      setWorker(foundWorker)
    }
  }, [params.workerId, router])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (user && worker) {
      const booking = dataStore.createBooking({
        customerId: user.id,
        workerId: worker.id,
        customerName: user.name,
        workerName: worker.name,
        service: worker.service,
        description: bookingData.description,
        location: user.address,
        budget: bookingData.budget,
        proposedPrice: bookingData.proposedPrice || bookingData.budget,
        status: "pending",
        urgency: bookingData.urgency as "normal" | "urgent" | "emergency",
      })

      console.log("[v0] Booking created:", booking)
      alert("Booking request sent successfully! The worker will respond soon.")
      router.push("/dashboard/customer")
    }

    setLoading(false)
  }

  const handleBargaining = () => {
    setShowBargaining(true)
  }

  const submitBargain = () => {
    alert(`Bargain proposal of ₹${bookingData.proposedPrice} sent to ${worker?.name}!`)
    setShowBargaining(false)
  }

  if (!user || !worker) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/customer">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                FixIt
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Worker Profile */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-orange-500 text-white text-lg">
                      {worker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{worker.name}</CardTitle>
                    <Badge variant="secondary" className="capitalize">
                      {worker.service}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold text-lg">{worker.rating}</span>
                  </div>
                  <p className="text-gray-600">{worker.completedJobs} jobs completed</p>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{worker.location}</span>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Price Range</p>
                  <p className="text-lg font-bold text-green-800">{worker.priceRange}</p>
                </div>

                <p className="text-gray-700">{worker.description}</p>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Book {worker.name}</CardTitle>
                <CardDescription>Provide details about your service requirements</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description">Service Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what work you need done..."
                      value={bookingData.description}
                      onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Your Budget Range</Label>
                      <Input
                        id="budget"
                        placeholder="e.g., ₹200-300"
                        value={bookingData.budget}
                        onChange={(e) => setBookingData({ ...bookingData, budget: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency</Label>
                      <select
                        id="urgency"
                        value={bookingData.urgency}
                        onChange={(e) => setBookingData({ ...bookingData, urgency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="normal">Normal (1-2 days)</option>
                        <option value="urgent">Urgent (Same day)</option>
                        <option value="emergency">Emergency (ASAP)</option>
                      </select>
                    </div>
                  </div>

                  {/* Bargaining Section */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Price Negotiation</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      Worker's rate: {worker.priceRange}. You can propose your own price.
                    </p>

                    {!showBargaining ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBargaining}
                        className="border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                      >
                        Propose Different Price
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Your proposed price (e.g., 250)"
                            value={bookingData.proposedPrice}
                            onChange={(e) => setBookingData({ ...bookingData, proposedPrice: e.target.value })}
                          />
                          <Button type="button" onClick={submitBargain} className="bg-blue-600 hover:bg-blue-700">
                            Send Proposal
                          </Button>
                        </div>
                        <p className="text-xs text-blue-600">The worker can accept, reject, or counter your proposal</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                      disabled={loading}
                    >
                      {loading ? "Sending Request..." : "Send Booking Request"}
                    </Button>
                    <Link href="/dashboard/customer">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
