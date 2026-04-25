import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Target, Users, Shield } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To connect skilled workers with customers in need, making quality services accessible and affordable to everyone.",
    },
    {
      icon: Users,
      title: "Our Community",
      description: "Building a trusted community of professionals and customers who value quality work and fair pricing.",
    },
    {
      icon: Shield,
      title: "Our Commitment",
      description: "Ensuring transparency, security, and fairness in every transaction between workers and customers.",
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
            <Link to="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How It Works
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
          <h1 className="text-4xl font-bold mb-4">About FixIt</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting skilled professionals with customers in need of quality services
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-600 text-lg">
            <p>
              FixIt was founded with a simple mission: to make it easier for people to find reliable, skilled service providers
              in their area. We believe that quality service should be accessible, affordable, and transparent.
            </p>
            <p>
              Whether you need an electrician to fix a wiring issue, a carpenter for a custom project, or a painter to refresh
              your home, FixIt connects you with trusted professionals who are ready to help.
            </p>
            <p>
              We've built a platform that values fairness, transparency, and quality. Every worker in our community is committed
              to delivering excellence, and every customer deserves reliable, professional service.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg p-12 mb-16 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">By The Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">100+</div>
              <p className="text-lg opacity-90">Workers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">500+</div>
              <p className="text-lg opacity-90">Customers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">1000+</div>
              <p className="text-lg opacity-90">Jobs Completed</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">4.8★</div>
              <p className="text-lg opacity-90">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <p className="text-center text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            A dedicated team of professionals working to make service booking better for everyone. We&apos;re passionate about
            connecting skilled workers with customers who need them.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How do I become a worker?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Simply register as a worker, fill in your profile with your skills and experience, and start receiving job
                  requests from customers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How does pricing work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  You can set your own rates and negotiate directly with customers. Once you agree on a price, you can proceed
                  with the job.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Is my payment secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, we use secure payment methods to protect both customers and workers. Payments are processed after job
                  completion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I cancel a booking?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can cancel bookings, but please note that cancellations may affect your rating on the platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How are ratings calculated?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ratings are based on customer reviews and feedback after job completion. A higher rating helps build trust
                  with potential customers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Is there customer support?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, we offer 24/7 customer support to help resolve any issues or questions you may have about using FixIt.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join FixIt Today</h2>
          <p className="text-lg opacity-90 mb-6">Be part of a trusted community of professionals and customers</p>
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
