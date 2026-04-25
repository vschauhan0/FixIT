import { Link } from "react-router-dom"
import { Wrench, Target, Heart, Shield, ArrowRight, Users, Star, Zap } from "lucide-react"

const values = [
  { icon: Shield, title: "Trust & Safety", description: "Every worker is real — registered themselves with verifiable contact information." },
  { icon: Target, title: "Transparency", description: "No hidden charges. Customers set their budget, workers can negotiate, and both agree before work starts." },
  { icon: Heart, title: "Fair to Everyone", description: "Workers keep 100% of what they earn. We help them find customers, not take a cut." },
  { icon: Zap, title: "Fast & Simple", description: "Book in under 2 minutes. No complicated processes — just describe the work and submit." },
]

const stats = [
  { value: "0", label: "Dummy Workers" },
  { value: "100%", label: "Real Users" },
  { value: "5★", label: "Max Rating" },
  { value: "Free", label: "For Workers" },
]

const faqs = [
  {
    q: "Are the workers verified?",
    a: "Workers register with their real name, phone, and email. They are not anonymous — customers can call or WhatsApp them directly.",
  },
  {
    q: "Do you show fake worker profiles?",
    a: "No. We removed all dummy data. Only real users who register on the platform appear as workers.",
  },
  {
    q: "How does pricing work?",
    a: "Customers set a budget range when booking. The worker can accept it directly or send a counter-offer. Both parties negotiate until they agree — then the job proceeds.",
  },
  {
    q: "How is the worker rating calculated?",
    a: "Rating starts at 0 for every new worker. It increases by 0.2 for each completed job, up to a maximum of 5.0. There are no fake ratings.",
  },
  {
    q: "How do I contact a worker?",
    a: "On the booking page, you can call the worker directly or open WhatsApp with their number. The number is displayed clearly.",
  },
  {
    q: "Is my data safe?",
    a: "All data is stored securely in MongoDB Atlas. Passwords are hashed with bcrypt and never stored in plain text.",
  },
]

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About FixIt</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            A platform that connects real customers with real skilled workers — transparently, simply, and fairly.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            FixIt was built to solve a simple problem: finding a reliable, honest local service worker is hard. Most platforms show fake ratings, inflated prices, and dummy profiles.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We built FixIt differently. Only real registered workers appear. Prices are negotiated openly. Ratings are calculated from actual completed jobs. No fake data, no hidden fees.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-white border-y">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-primary-600 mb-1">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 bg-white border-t">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join FixIt Today</h2>
          <p className="text-primary-100 mb-8">Whether you need a service or want to offer one — we're built for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?type=customer" className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Register as Customer</span>
            </Link>
            <Link to="/register?type=worker" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center space-x-2 bg-transparent">
              <Wrench className="w-5 h-5" />
              <span>Join as Worker</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
