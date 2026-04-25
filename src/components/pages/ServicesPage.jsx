import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Hammer, Paintbrush, Droplet, Leaf, Zap } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      id: "electrician",
      name: "Electrician",
      icon: Zap,
      description: "Expert electrical services including wiring, repairs, installations, and emergency fixes.",
      features: ["Home wiring", "Repairs & maintenance", "LED installations", "Safety inspections"],
    },
    {
      id: "carpenter",
      name: "Carpenter",
      icon: Hammer,
      description: "Professional carpentry for custom furniture, renovations, and woodwork projects.",
      features: ["Custom furniture", "Kitchen cabinets", "Shelving units", "Home renovations"],
    },
    {
      id: "painter",
      name: "Painter",
      icon: Paintbrush,
      description: "Quality painting services for interior and exterior walls with professional finishes.",
      features: ["Interior painting", "Exterior painting", "Wall textures", "Surface preparation"],
    },
    {
      id: "plumber",
      name: "Plumber",
      icon: Droplet,
      description: "Complete plumbing solutions for repairs, installations, and maintenance.",
      features: ["Pipe repairs", "Leak detection", "Faucet installation", "Emergency services"],
    },
    {
      id: "gardener",
      name: "Gardener",
      icon: Leaf,
      description: "Lawn care and gardening services to keep your outdoor spaces beautiful.",
      features: ["Lawn maintenance", "Plant care", "Landscaping", "Garden design"],
    },
    {
      id: "cleaner",
      name: "Cleaner",
      icon: Wrench,
      description: "Professional cleaning services for homes and offices.",
      features: ["House cleaning", "Deep cleaning", "Office cleaning", "Specialized cleaning"],
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
            <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How It Works
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
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We connect you with skilled professionals across various trades. Choose from our diverse range of services.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{service.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold">What we offer:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg p-8 text-center text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg opacity-90 mb-6">Find the perfect service provider for your needs</p>
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
