"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Wrench, Briefcase } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { dataStore, type Worker } from "@/lib/data-store"
import UserIcon from "@/components/icons/UserIcon" // Renamed import to avoid redeclaration

export default function RegisterPage() {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  })
  const [workerData, setWorkerData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    service: "",
    experience: "",
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const services = ["Electrician", "Carpenter", "Painter", "Plumber", "Mason", "Gardener", "Cleaner", "Other"]

  const handleCustomerRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const customer = {
      id: Date.now().toString(),
      ...customerData,
      type: "customer",
      createdAt: new Date().toISOString(),
    }

    dataStore.saveUser(customer)
    router.push("/dashboard/customer")
    setLoading(false)
  }

  const handleWorkerRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const worker: Worker = {
      id: Date.now().toString(),
      ...workerData,
      type: "worker",
      rating: 4.0,
      completedJobs: 0,
      priceRange: `₹${Math.floor(Math.random() * 200) + 200}-${Math.floor(Math.random() * 300) + 400}/hr`,
      available: true,
      createdAt: new Date().toISOString(),
    }

    dataStore.saveWorker(worker)
    router.push("/dashboard/worker")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              FixIt
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our community today</p>
        </div>

        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> {/* Replaced User with UserIcon */}
              Customer
            </TabsTrigger>
            <TabsTrigger value="worker" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Worker
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Registration</CardTitle>
                <CardDescription>Create an account to find and hire service providers</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomerRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Full Name</Label>
                    <Input
                      id="customer-name"
                      placeholder="Enter your full name"
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      placeholder="Enter your email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-password">Password</Label>
                    <Input
                      id="customer-password"
                      type="password"
                      placeholder="Create a password"
                      value={customerData.password}
                      onChange={(e) => setCustomerData({ ...customerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Phone Number</Label>
                    <Input
                      id="customer-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-address">Address</Label>
                    <Textarea
                      id="customer-address"
                      placeholder="Enter your address"
                      value={customerData.address}
                      onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Customer Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="worker">
            <Card>
              <CardHeader>
                <CardTitle>Worker Registration</CardTitle>
                <CardDescription>Join as a service provider and start earning</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWorkerRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="worker-name">Full Name</Label>
                    <Input
                      id="worker-name"
                      placeholder="Enter your full name"
                      value={workerData.name}
                      onChange={(e) => setWorkerData({ ...workerData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-email">Email</Label>
                    <Input
                      id="worker-email"
                      type="email"
                      placeholder="Enter your email"
                      value={workerData.email}
                      onChange={(e) => setWorkerData({ ...workerData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-password">Password</Label>
                    <Input
                      id="worker-password"
                      type="password"
                      placeholder="Create a password"
                      value={workerData.password}
                      onChange={(e) => setWorkerData({ ...workerData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-phone">Phone Number</Label>
                    <Input
                      id="worker-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={workerData.phone}
                      onChange={(e) => setWorkerData({ ...workerData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-service">Service Type</Label>
                    <Select
                      value={workerData.service}
                      onValueChange={(value) => setWorkerData({ ...workerData, service: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service.toLowerCase()}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-experience">Years of Experience</Label>
                    <Input
                      id="worker-experience"
                      type="number"
                      placeholder="Enter years of experience"
                      value={workerData.experience}
                      onChange={(e) => setWorkerData({ ...workerData, experience: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-address">Service Area</Label>
                    <Textarea
                      id="worker-address"
                      placeholder="Enter your service area"
                      value={workerData.address}
                      onChange={(e) => setWorkerData({ ...workerData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-description">Description</Label>
                    <Textarea
                      id="worker-description"
                      placeholder="Tell customers about your services and expertise"
                      value={workerData.description}
                      onChange={(e) => setWorkerData({ ...workerData, description: e.target.value })}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Worker Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
