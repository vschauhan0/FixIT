"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Star, Wrench, Paintbrush, Zap, Hammer, Users, Shield, Clock } from "lucide-react"

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const services = [
    { icon: Zap, name: "Electrician", count: "150+ workers" },
    { icon: Hammer, name: "Carpenter", count: "200+ workers" },
    { icon: Paintbrush, name: "Painter", count: "120+ workers" },
    { icon: Wrench, name: "Plumber", count: "180+ workers" },
  ]

  const features = [
    {
      icon: Users,
      title: "Verified Workers",
      description: "All service providers are background checked and verified",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing with buyer protection",
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Get responses from workers within minutes of posting",
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Transparent rating system to help you choose the best",
    },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Trusted
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              {" "}
              Service Providers{" "}
            </span>
            Near You
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with verified electricians, carpenters, painters, and more. Get quality work done at fair prices
            with our transparent bargaining system.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="What service do you need? (e.g., electrician, painter)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-primary-500 rounded-xl outline-none transition-colors"
              />
              <Link
                to="/register?type=customer"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary"
              >
                Search
              </Link>
            </div>
          </div>

          {/* Service Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary-200"
              >
                <service.icon className="w-12 h-12 mx-auto mb-3 text-primary-600" />
                <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FixIt?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding and hiring service providers simple, safe, and affordable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-500">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect service provider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register?type=customer"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-lg transition-colors"
            >
              Find Workers
            </Link>
            <Link
              to="/register?type=worker"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-medium rounded-lg transition-colors bg-transparent"
            >
              Join as Worker
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">FixIt</span>
              </div>
              <p className="text-gray-400">
                Connecting customers with trusted service providers for all your home improvement needs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Electricians</li>
                <li>Carpenters</li>
                <li>Painters</li>
                <li>Plumbers</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>How it Works</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FixIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
