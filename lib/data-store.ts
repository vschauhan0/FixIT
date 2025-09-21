export interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  type: "customer" | "worker"
  createdAt: string
}

export interface Worker extends User {
  type: "worker"
  service: string
  experience: string
  description: string
  rating: number
  completedJobs: number
  priceRange: string
  available: boolean
}

export interface Booking {
  id: string
  customerId: string
  workerId: string
  customerName: string
  workerName: string
  service: string
  description: string
  location: string
  budget: string
  proposedPrice: string
  status: "pending" | "accepted" | "rejected" | "completed"
  urgency: "normal" | "urgent" | "emergency"
  createdAt: string
  updatedAt: string
}

class DataStore {
  private static instance: DataStore

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore()
    }
    return DataStore.instance
  }

  // User Management
  saveUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("userType", user.type)

    // Also save to users list
    const users = this.getAllUsers()
    const existingIndex = users.findIndex((u) => u.id === user.id)
    if (existingIndex >= 0) {
      users[existingIndex] = user
    } else {
      users.push(user)
    }
    localStorage.setItem("users", JSON.stringify(users))
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  }

  getAllUsers(): User[] {
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : []
  }

  // Worker Management
  saveWorker(worker: Worker): void {
    this.saveUser(worker)

    const workers = this.getAllWorkers()
    const existingIndex = workers.findIndex((w) => w.id === worker.id)
    if (existingIndex >= 0) {
      workers[existingIndex] = worker
    } else {
      workers.push(worker)
    }
    localStorage.setItem("workers", JSON.stringify(workers))
  }

  getAllWorkers(): Worker[] {
    const workers = localStorage.getItem("workers")
    return workers ? JSON.parse(workers) : []
  }

  getWorkerById(id: string): Worker | null {
    const workers = this.getAllWorkers()
    return workers.find((w) => w.id === id) || null
  }

  // Booking Management
  createBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Booking {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const bookings = this.getAllBookings()
    bookings.push(newBooking)
    localStorage.setItem("bookings", JSON.stringify(bookings))

    return newBooking
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const bookings = this.getAllBookings()
    const index = bookings.findIndex((b) => b.id === id)

    if (index >= 0) {
      bookings[index] = {
        ...bookings[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("bookings", JSON.stringify(bookings))
      return bookings[index]
    }

    return null
  }

  getAllBookings(): Booking[] {
    const bookings = localStorage.getItem("bookings")
    return bookings ? JSON.parse(bookings) : []
  }

  getBookingsForCustomer(customerId: string): Booking[] {
    return this.getAllBookings().filter((b) => b.customerId === customerId)
  }

  getBookingsForWorker(workerId: string): Booking[] {
    return this.getAllBookings().filter((b) => b.workerId === workerId)
  }

  // Update worker stats when booking is completed
  updateWorkerStats(workerId: string): void {
    const worker = this.getWorkerById(workerId)
    if (!worker) return

    const completedBookings = this.getBookingsForWorker(workerId).filter((b) => b.status === "completed")

    const updatedWorker: Worker = {
      ...worker,
      completedJobs: completedBookings.length,
      rating: this.calculateWorkerRating(workerId),
    }

    this.saveWorker(updatedWorker)
  }

  private calculateWorkerRating(workerId: string): number {
    // Simple rating calculation - in real app this would be based on customer reviews
    const completedJobs = this.getBookingsForWorker(workerId).filter((b) => b.status === "completed").length

    // Base rating starts at 4.0, increases with completed jobs
    return Math.min(5.0, 4.0 + completedJobs * 0.1)
  }

  // Initialize with some sample data if empty
  initializeSampleData(): void {
    if (this.getAllWorkers().length === 0) {
      const sampleWorkers: Worker[] = [
        {
          id: "1",
          name: "John Smith",
          email: "john@example.com",
          phone: "+91 9876543210",
          address: "Downtown Area",
          type: "worker",
          service: "electrician",
          experience: "8",
          description:
            "Certified electrician with 8+ years experience. Specializing in home wiring, repairs, and installations.",
          rating: 4.8,
          completedJobs: 156,
          priceRange: "₹200-400/hr",
          available: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Mike Johnson",
          email: "mike@example.com",
          phone: "+91 9876543211",
          address: "Uptown Area",
          type: "worker",
          service: "carpenter",
          experience: "10",
          description: "Expert carpenter specializing in custom furniture, kitchen cabinets, and home renovations.",
          rating: 4.9,
          completedJobs: 203,
          priceRange: "₹300-500/hr",
          available: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          phone: "+91 9876543212",
          address: "Midtown Area",
          type: "worker",
          service: "painter",
          experience: "5",
          description: "Professional painter with expertise in interior and exterior painting, wall textures.",
          rating: 4.7,
          completedJobs: 89,
          priceRange: "₹250-350/hr",
          available: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "David Brown",
          email: "david@example.com",
          phone: "+91 9876543213",
          address: "Eastside Area",
          type: "worker",
          service: "plumber",
          experience: "6",
          description: "Licensed plumber offering pipe repairs, installations, and emergency services.",
          rating: 4.6,
          completedJobs: 134,
          priceRange: "₹200-300/hr",
          available: true,
          createdAt: new Date().toISOString(),
        },
      ]

      sampleWorkers.forEach((worker) => this.saveWorker(worker))
    }
  }
}

export const dataStore = DataStore.getInstance()
