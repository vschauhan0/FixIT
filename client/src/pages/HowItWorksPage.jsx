import { Link } from "react-router-dom"
import { UserPlus, Search, MessageSquare, CheckCircle, ArrowRight, Briefcase, Star, Shield } from "lucide-react"

const customerSteps = [
  {
    icon: UserPlus,
    title: "Register as Customer",
    description: "Create your account in less than a minute. Just name, email, phone and you're in.",
  },
  {
    icon: Search,
    title: "Search & Browse Workers",
    description: "Search for plumbers, electricians, carpenters, or any service. Filter by area and rating.",
  },
  {
    icon: MessageSquare,
    title: "Send Booking Request",
    description: "Describe your work needed, set your budget range, and pick a date. The worker will receive all details.",
  },
  {
    icon: MessageSquare,
    title: "Negotiate the Price",
    description: "Worker can accept your budget or send a counter-offer. You can accept it or negotiate further — all within the app.",
  },
  {
    icon: CheckCircle,
    title: "Job Gets Done",
    description: "Once both agree, the worker comes to your location on the scheduled date and completes the job.",
  },
]

const workerSteps = [
  {
    icon: UserPlus,
    title: "Register as Worker",
    description: "Create your profile with your skills, experience, and service areas.",
  },
  {
    icon: Briefcase,
    title: "Receive Booking Requests",
    description: "Customers will send you job requests with full details — description, location, budget, and date.",
  },
  {
    icon: MessageSquare,
    title: "Accept or Negotiate",
    description: "Accept the customer's budget directly, or send a counter-offer with your price and reason.",
  },
  {
    icon: CheckCircle,
    title: "Complete the Job",
    description: "Visit the customer, complete the work, then mark the job as done from your dashboard.",
  },
  {
    icon: Star,
    title: "Earn Rating & Revenue",
    description: "Your rating increases with every completed job. Your dashboard shows real earnings and stats.",
  },
]

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How FixIt Works</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            A simple, transparent process to connect customers with trusted service workers.
          </p>
        </div>
      </section>

      {/* Customers */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-3">For Customers</span>
            <h2 className="text-3xl font-bold text-gray-900">How to Book a Service</h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-200 hidden md:block"></div>
            <div className="space-y-8">
              {customerSteps.map((step, i) => (
                <div key={i} className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                    {i + 1}
                  </div>
                  <div className="card flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <step.icon className="w-5 h-5 text-primary-600" />
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/register?type=customer" className="btn-primary inline-flex items-center space-x-2 px-8 py-3">
              <span>Register as Customer</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Workers */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-secondary-100 text-secondary-700 px-4 py-1 rounded-full text-sm font-medium mb-3">For Workers</span>
            <h2 className="text-3xl font-bold text-gray-900">How to Earn on FixIt</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-secondary-200 hidden md:block"></div>
            <div className="space-y-8">
              {workerSteps.map((step, i) => (
                <div key={i} className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary-500 text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                    {i + 1}
                  </div>
                  <div className="card flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <step.icon className="w-5 h-5 text-secondary-600" />
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <Link to="/register?type=worker" className="bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2">
              <span>Join as Worker</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 px-4 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Shield className="w-10 h-10 mx-auto mb-3 text-primary-200" />
              <h3 className="font-bold text-lg mb-1">Safe & Transparent</h3>
              <p className="text-primary-100 text-sm">Price negotiation happens openly. No hidden charges.</p>
            </div>
            <div>
              <Star className="w-10 h-10 mx-auto mb-3 text-primary-200" />
              <h3 className="font-bold text-lg mb-1">Verified Ratings</h3>
              <p className="text-primary-100 text-sm">Worker ratings are based on actual completed jobs only.</p>
            </div>
            <div>
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-primary-200" />
              <h3 className="font-bold text-lg mb-1">No Dummy Data</h3>
              <p className="text-primary-100 text-sm">Only real workers who register appear on the platform.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HowItWorksPage
