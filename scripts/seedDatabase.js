const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../server/models/User")
const Worker = require("../server/models/Worker")
const Booking = require("../server/models/Booking")
const Review = require("../server/models/Review")

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fixit", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ MongoDB connected for seeding")
  } catch (error) {
    console.error("❌ MongoDB connection error:", error)
    process.exit(1)
  }
}

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({})
    await Worker.deleteMany({})
    await Booking.deleteMany({})
    await Review.deleteMany({})
    console.log("🧹 Cleared existing data")
  } catch (error) {
    console.error("Error clearing data:", error)
  }
}

// Create dummy users and workers
const createUsers = async () => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("password123", salt)

    // Create customers
    const customers = await User.create([
      {
        name: "John Smith",
        email: "john@example.com",
        password: hashedPassword,
        phone: "+1234567890",
        userType: "customer",
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        isVerified: true,
      },
      {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        password: hashedPassword,
        phone: "+1234567891",
        userType: "customer",
        address: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          coordinates: { lat: 34.0522, lng: -118.2437 },
        },
        isVerified: true,
      },
      {
        name: "Mike Davis",
        email: "mike@example.com",
        password: hashedPassword,
        phone: "+1234567892",
        userType: "customer",
        address: {
          street: "789 Pine St",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          coordinates: { lat: 41.8781, lng: -87.6298 },
        },
        isVerified: true,
      },
    ])

    // Create worker users
    const workerUsers = await User.create([
      {
        name: "Alex Rodriguez",
        email: "alex@example.com",
        password: hashedPassword,
        phone: "+1234567893",
        userType: "worker",
        address: {
          street: "321 Elm St",
          city: "New York",
          state: "NY",
          zipCode: "10002",
          coordinates: { lat: 40.7589, lng: -73.9851 },
        },
        profileImage: "/professional-electrician-headshot.jpg",
        isVerified: true,
      },
      {
        name: "Maria Garcia",
        email: "maria@example.com",
        password: hashedPassword,
        phone: "+1234567894",
        userType: "worker",
        address: {
          street: "654 Maple Dr",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90211",
          coordinates: { lat: 34.0736, lng: -118.4004 },
        },
        profileImage: "/professional-carpenter-woman.jpg",
        isVerified: true,
      },
      {
        name: "David Wilson",
        email: "david@example.com",
        password: hashedPassword,
        phone: "+1234567895",
        userType: "worker",
        address: {
          street: "987 Cedar Ln",
          city: "Chicago",
          state: "IL",
          zipCode: "60602",
          coordinates: { lat: 41.8819, lng: -87.6278 },
        },
        profileImage: "/professional-painter-man.jpg",
        isVerified: true,
      },
      {
        name: "Lisa Chen",
        email: "lisa@example.com",
        password: hashedPassword,
        phone: "+1234567896",
        userType: "worker",
        address: {
          street: "147 Birch Ave",
          city: "New York",
          state: "NY",
          zipCode: "10003",
          coordinates: { lat: 40.7282, lng: -73.9942 },
        },
        profileImage: "/professional-plumber-woman.jpg",
        isVerified: true,
      },
      {
        name: "Robert Brown",
        email: "robert@example.com",
        password: hashedPassword,
        phone: "+1234567897",
        userType: "worker",
        address: {
          street: "258 Spruce St",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90212",
          coordinates: { lat: 34.0669, lng: -118.3959 },
        },
        profileImage: "/professional-electrician-man.jpg",
        isVerified: true,
      },
    ])

    // Create worker profiles
    const workers = await Worker.create([
      {
        userId: workerUsers[0]._id, // Alex Rodriguez
        services: ["electrician"],
        experience: 8,
        hourlyRate: { min: 45, max: 75 },
        availability: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          hours: { start: "08:00", end: "18:00" },
        },
        rating: { average: 4.8, count: 127 },
        description:
          "Licensed electrician with 8+ years of experience. Specializing in residential and commercial electrical work, panel upgrades, and smart home installations.",
        portfolio: [
          {
            title: "Smart Home Installation",
            description: "Complete smart home electrical setup with automated lighting and security systems",
            images: ["/smart-home-electrical-installation.jpg"],
            completedDate: new Date("2024-01-15"),
          },
          {
            title: "Commercial Panel Upgrade",
            description: "Upgraded electrical panel for small business to meet current safety standards",
            images: ["/electrical-panel-upgrade-commercial.jpg"],
            completedDate: new Date("2024-02-20"),
          },
        ],
        certifications: ["Licensed Electrician", "OSHA Safety Certified", "Smart Home Specialist"],
        completedJobs: 127,
        isActive: true,
      },
      {
        userId: workerUsers[1]._id, // Maria Garcia
        services: ["carpenter"],
        experience: 12,
        hourlyRate: { min: 40, max: 65 },
        availability: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
          hours: { start: "07:00", end: "17:00" },
        },
        rating: { average: 4.9, count: 203 },
        description:
          "Master carpenter with over 12 years of experience in custom furniture, kitchen cabinets, and home renovations. Attention to detail and quality craftsmanship guaranteed.",
        portfolio: [
          {
            title: "Custom Kitchen Cabinets",
            description: "Handcrafted solid wood kitchen cabinets with soft-close hinges and custom storage solutions",
            images: ["/custom-kitchen-cabinets-wood.jpg"],
            completedDate: new Date("2024-01-10"),
          },
          {
            title: "Built-in Bookshelf",
            description: "Floor-to-ceiling built-in bookshelf with integrated lighting and hidden storage",
            images: ["/built-in-bookshelf-custom.jpg"],
            completedDate: new Date("2024-02-28"),
          },
        ],
        certifications: ["Master Carpenter License", "Cabinet Making Certification", "Safety Training"],
        completedJobs: 203,
        isActive: true,
      },
      {
        userId: workerUsers[2]._id, // David Wilson
        services: ["painter"],
        experience: 6,
        hourlyRate: { min: 30, max: 50 },
        availability: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
          hours: { start: "08:00", end: "16:00" },
        },
        rating: { average: 4.6, count: 89 },
        description:
          "Professional painter specializing in interior and exterior painting, color consultation, and decorative finishes. Clean, efficient work with premium materials.",
        portfolio: [
          {
            title: "Modern Living Room",
            description: "Complete interior painting with accent walls and decorative textures",
            images: ["/modern-living-room-painted.jpg"],
            completedDate: new Date("2024-01-25"),
          },
        ],
        certifications: ["Professional Painter License", "Color Theory Certification"],
        completedJobs: 89,
        isActive: true,
      },
      {
        userId: workerUsers[3]._id, // Lisa Chen
        services: ["plumber"],
        experience: 10,
        hourlyRate: { min: 50, max: 80 },
        availability: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          hours: { start: "08:00", end: "17:00" },
        },
        rating: { average: 4.7, count: 156 },
        description:
          "Licensed master plumber with 10+ years of experience. Emergency repairs, bathroom renovations, and water heater installations. Available for urgent calls.",
        portfolio: [
          {
            title: "Bathroom Renovation",
            description: "Complete bathroom plumbing renovation including new fixtures and piping",
            images: ["/bathroom-renovation-plumbing.jpg"],
            completedDate: new Date("2024-02-05"),
          },
        ],
        certifications: ["Master Plumber License", "Backflow Prevention Certified", "Green Plumbing Specialist"],
        completedJobs: 156,
        isActive: true,
      },
      {
        userId: workerUsers[4]._id, // Robert Brown
        services: ["electrician", "carpenter"],
        experience: 15,
        hourlyRate: { min: 55, max: 85 },
        availability: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          hours: { start: "07:00", end: "18:00" },
        },
        rating: { average: 4.9, count: 234 },
        description:
          "Multi-skilled craftsman with expertise in both electrical and carpentry work. Perfect for complex projects requiring multiple trades. 15+ years of experience.",
        portfolio: [
          {
            title: "Workshop Build-out",
            description: "Complete workshop construction with electrical, lighting, and custom storage solutions",
            images: ["/workshop-construction-electrical.jpg"],
            completedDate: new Date("2024-01-30"),
          },
        ],
        certifications: ["Master Electrician", "Journeyman Carpenter", "Project Management Certified"],
        completedJobs: 234,
        isActive: true,
      },
    ])

    console.log("👥 Created users and workers")
    return { customers, workers }
  } catch (error) {
    console.error("Error creating users:", error)
  }
}

// Create sample bookings
const createBookings = async (customers, workers) => {
  try {
    const bookings = await Booking.create([
      {
        customerId: customers[0]._id,
        workerId: workers[0]._id,
        serviceType: "electrician",
        description: "Need to install new ceiling fan in living room and fix flickering lights in kitchen",
        location: {
          address: "123 Main St, New York, NY 10001",
          coordinates: { lat: 40.7128, lng: -74.006 },
        },
        scheduledDate: new Date("2024-03-15T10:00:00Z"),
        estimatedDuration: 3,
        status: "pending",
        pricing: {
          customerBudget: 300,
          workerQuote: 275,
          negotiationHistory: [
            {
              from: "customer",
              amount: 300,
              message: "Looking to get this done within budget",
              timestamp: new Date("2024-03-01T09:00:00Z"),
            },
            {
              from: "worker",
              amount: 275,
              message: "I can do this for $275 including materials",
              timestamp: new Date("2024-03-01T10:30:00Z"),
            },
          ],
        },
      },
      {
        customerId: customers[1]._id,
        workerId: workers[1]._id,
        serviceType: "carpenter",
        description: "Custom built-in shelving unit for home office",
        location: {
          address: "456 Oak Ave, Los Angeles, CA 90210",
          coordinates: { lat: 34.0522, lng: -118.2437 },
        },
        scheduledDate: new Date("2024-03-20T08:00:00Z"),
        estimatedDuration: 8,
        status: "accepted",
        pricing: {
          customerBudget: 800,
          workerQuote: 750,
          finalPrice: 750,
          negotiationHistory: [
            {
              from: "customer",
              amount: 800,
              message: "Need custom shelving with specific dimensions",
              timestamp: new Date("2024-03-02T14:00:00Z"),
            },
            {
              from: "worker",
              amount: 750,
              message: "I can create exactly what you need for $750",
              timestamp: new Date("2024-03-02T15:30:00Z"),
            },
          ],
        },
      },
      {
        customerId: customers[2]._id,
        workerId: workers[2]._id,
        serviceType: "painter",
        description: "Paint two bedrooms and hallway, need color consultation",
        location: {
          address: "789 Pine St, Chicago, IL 60601",
          coordinates: { lat: 41.8781, lng: -87.6298 },
        },
        scheduledDate: new Date("2024-03-25T09:00:00Z"),
        estimatedDuration: 12,
        status: "completed",
        pricing: {
          customerBudget: 600,
          workerQuote: 580,
          finalPrice: 580,
          negotiationHistory: [
            {
              from: "customer",
              amount: 600,
              message: "Two bedrooms and hallway, including primer",
              timestamp: new Date("2024-02-28T11:00:00Z"),
            },
            {
              from: "worker",
              amount: 580,
              message: "Including color consultation and premium paint",
              timestamp: new Date("2024-02-28T12:15:00Z"),
            },
          ],
        },
      },
    ])

    console.log("📋 Created sample bookings")
    return bookings
  } catch (error) {
    console.error("Error creating bookings:", error)
  }
}

// Create sample reviews
const createReviews = async (customers, workers, bookings) => {
  try {
    const reviews = await Review.create([
      {
        customerId: customers[2]._id,
        workerId: workers[2]._id,
        bookingId: bookings[2]._id,
        rating: 5,
        comment:
          "David did an amazing job! Very professional, clean work, and great color advice. The rooms look fantastic and he finished on time. Highly recommend!",
        response: "Thank you so much! It was a pleasure working with you. Enjoy your newly painted rooms!",
      },
      {
        customerId: customers[0]._id,
        workerId: workers[0]._id,
        rating: 5,
        comment:
          "Alex is incredibly skilled and professional. Fixed all our electrical issues quickly and explained everything clearly. Will definitely hire again!",
        response: "Thanks for the great review! Happy to help with any future electrical needs.",
      },
      {
        customerId: customers[1]._id,
        workerId: workers[1]._id,
        rating: 5,
        comment:
          "Maria created the most beautiful custom shelving unit. Her attention to detail is incredible and the craftsmanship is top-notch. Worth every penny!",
        response: "Thank you! I loved working on this project. The shelving unit turned out exactly as we envisioned.",
      },
    ])

    console.log("⭐ Created sample reviews")
    return reviews
  } catch (error) {
    console.error("Error creating reviews:", error)
  }
}

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB()
    await clearData()

    const { customers, workers } = await createUsers()
    const bookings = await createBookings(customers, workers)
    const reviews = await createReviews(customers, workers, bookings)

    console.log("🎉 Database seeded successfully!")
    console.log(`Created:`)
    console.log(`- ${customers.length} customers`)
    console.log(`- ${workers.length} workers`)
    console.log(`- ${bookings.length} bookings`)
    console.log(`- ${reviews.length} reviews`)

    console.log("\n📝 Test Accounts:")
    console.log("Customer: john@example.com / password123")
    console.log("Worker: alex@example.com / password123")
    console.log("All accounts use password: password123")

    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  }
}

// Run the seeding
seedDatabase()
