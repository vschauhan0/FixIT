import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Search, DollarSign, CheckCircle, MessageCircle, Star } from "lucide-react"

export default function HowItWorksPage() {
  const customerSteps = [
    {
      number: 1,
      title: "Create Account",
      description: "Sign up as a customer and build your profile.",
      icon: Search,
    },
    {
      number: 2,
      title: "Browse Workers",
      description: "Search and browse skilled workers in your area by service type.",
      icon: Search,
    },
    {
      number: 3,
      title: "Post Job",
      description: "Describe your work and set your budget.",
      icon: DollarSign,
    },
    {
      number: 4,
      title: "Negotiate Price",
      description: "Discuss and finalize the price with the worker.",
      icon: MessageCircle,
    },
    {
      number: 5,
      title: "Track Work",
      description: "Monitor the progress of your work in real-time.",
      icon: CheckCircle,
    },
    {
      number: 6,
      title: "Rate & Review",
      description: "Leave feedback and rating after the work is completed.",
      icon: Star,
    },
  ]

  const workerSteps = [
    {
      number: 1,
      title: "Register as Worker",
      description: "Create an account and showcase your skills and experience.",
      icon: Wrench,
    },
    {
      number: 2,
      title: "Build Profile",
      description: "Add your service details, rates, and portfolio.",
      icon: Search,
    },
    {
      number: 3,
      title: "Receive Orders",
      description: "Get booking requests from customers in your service area.",
      icon: MessageCircle,
    },
    {
      number: 4,
      title: "Propose Price",
      description: "Accept orders and negotiate the final price with customers.",
      icon: DollarSign,
    },
    {
      number: 5,
      title: "Complete Work",
      description: "Perform the service professionally and mark it complete.",
      icon: CheckCircle,
    },
    {
      number: 6,
      title: "Earn & Grow",
      description: "Receive payments and build your reputation with ratings.",
      icon: Star,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              FixIt
            </span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/services" className="text-gray-600 hover:text-gray-900">
              Services
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How FixIt Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to connect customers with skilled service providers
          </p>
        </div>

        {/* For Customers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">For Customers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerSteps.map((step) => {
              const IconComponent = step.icon
              return (
                <Card key={step.number} className="relative">
                  {step.number < customerSteps.length && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-1 bg-gradient-to-r from-blue-600 to-orange-500"></div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {step.number}
                      </div>
                      <CardTitle>{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* For Workers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">For Workers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workerSteps.map((step) => {
              const IconComponent = step.icon
              return (
                <Card key={step.number} className="relative">
                  {step.number < workerSteps.length && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-1 bg-gradient-to-r from-blue-600 to-orange-500"></div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {step.number}
                      </div>
                      <CardTitle>{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg p-12 mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose FixIt?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-gray-600">Skilled Workers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
              <p className="text-gray-600">Available Support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">Verified</div>
              <p className="text-gray-600">Trusted Professionals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">Secure</div>
              <p className="text-gray-600">Safe Transactions</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <div className="flex gap-4 justify-center">
            <Link to="/register?type=customer">
              <Button variant="secondary" size="lg">
                Find a Worker
              </Button>
            </Link>
            <Link to="/register?type=worker">
              <Button variant="secondary" size="lg">
                Become a Worker
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
