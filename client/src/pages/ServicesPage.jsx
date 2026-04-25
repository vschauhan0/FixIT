import { Link } from "react-router-dom"
import { Zap, Hammer, Paintbrush, Wrench, Droplets, Leaf, Settings, ArrowRight } from "lucide-react"

const services = [
  {
    icon: Zap,
    name: "Electrician",
    color: "bg-yellow-100 text-yellow-600",
    description: "Wiring, repairs, installations, short circuits, switch boards, and all electrical work.",
    tasks: ["Wiring & Rewiring", "Switch & Socket Installation", "MCB / Fuse Box Repair", "Fan & Light Fitting", "Inverter Setup"],
  },
  {
    icon: Hammer,
    name: "Carpenter",
    color: "bg-amber-100 text-amber-600",
    description: "Furniture making, repairs, door/window fitting, and all woodwork.",
    tasks: ["Furniture Assembly", "Door & Window Fitting", "Wardrobe & Cabinet Work", "Wood Polish & Repair", "False Ceiling"],
  },
  {
    icon: Paintbrush,
    name: "Painter",
    color: "bg-blue-100 text-blue-600",
    description: "Interior and exterior painting, wall textures, and waterproofing.",
    tasks: ["Interior Painting", "Exterior Painting", "Wall Texture & Design", "Wood Painting", "Waterproofing"],
  },
  {
    icon: Wrench,
    name: "Plumber",
    color: "bg-cyan-100 text-cyan-600",
    description: "Pipe fitting, leak repairs, bathroom fixtures, and water tank work.",
    tasks: ["Pipe Leak Repair", "Tap & Shower Installation", "Toilet Fitting", "Water Tank Cleaning", "Drainage Unclogging"],
  },
  {
    icon: Droplets,
    name: "Cleaner",
    color: "bg-green-100 text-green-600",
    description: "Home, office, and deep cleaning services.",
    tasks: ["Home Deep Cleaning", "Kitchen Cleaning", "Bathroom Sanitization", "Sofa & Carpet Cleaning", "Post-Renovation Cleanup"],
  },
  {
    icon: Leaf,
    name: "Gardener",
    color: "bg-lime-100 text-lime-600",
    description: "Garden maintenance, lawn care, and plant care services.",
    tasks: ["Lawn Mowing", "Plant Trimming", "Garden Design", "Soil & Fertilizer Work", "Pest Control for Plants"],
  },
  {
    icon: Settings,
    name: "Mechanic",
    color: "bg-gray-100 text-gray-600",
    description: "Appliance repair, AC servicing, and general maintenance.",
    tasks: ["AC Servicing & Repair", "Washing Machine Repair", "Refrigerator Repair", "Water Heater Repair", "TV Repair"],
  },
]

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Find skilled professionals for every home repair and maintenance need — all in one place.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.name} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="space-y-1">
                      {service.tasks.map((task) => (
                        <li key={task} className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-white border-t">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Book a Service?</h2>
          <p className="text-gray-600 mb-8">Register as a customer and find the right professional for your needs in minutes.</p>
          <Link
            to="/register?type=customer"
            className="inline-flex items-center space-x-2 btn-primary text-lg px-8 py-3"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
