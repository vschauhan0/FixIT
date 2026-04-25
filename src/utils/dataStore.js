class DataStore {
  static instance = null

  static getInstance() {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore()
    }
    return DataStore.instance
  }

  // User Management
  saveUser(user) {
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

  getCurrentUser() {
    const userData = localStorage.getItem("user")
    return userData ? JSON.parse(userData) : null
  }

  getAllUsers() {
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : []
  }

  // Worker Management
  saveWorker(worker) {
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

  getAllWorkers() {
    const workers = localStorage.getItem("workers")
    return workers ? JSON.parse(workers) : []
  }

  getWorkerById(id) {
    const workers = this.getAllWorkers()
    return workers.find((w) => w.id === id) || null
  }

  // Booking Management
  createBooking(booking) {
    const newBooking = {
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

  updateBooking(id, updates) {
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

  getAllBookings() {
    const bookings = localStorage.getItem("bookings")
    return bookings ? JSON.parse(bookings) : []
  }

  getBookingsForCustomer(customerId) {
    return this.getAllBookings().filter((b) => b.customerId === customerId)
  }

  getBookingsForWorker(workerId) {
    return this.getAllBookings().filter((b) => b.workerId === workerId)
  }

  // Update worker stats when booking is completed
  updateWorkerStats(workerId) {
    const worker = this.getWorkerById(workerId)
    if (!worker) return

    const allBookings = this.getBookingsForWorker(workerId)
    const completedBookings = allBookings.filter((b) => b.status === "completed")

    // Calculate revenue from completed jobs
    const revenue = completedBookings.reduce((total, booking) => {
      const price = parseInt(booking.proposedPrice.replace(/[^\d]/g, "")) || 0
      return total + price
    }, 0)

    const updatedWorker = {
      ...worker,
      completedJobs: completedBookings.length,
      revenue: revenue,
      rating: this.calculateWorkerRating(workerId),
    }

    this.saveWorker(updatedWorker)
  }

  calculateWorkerRating(workerId) {
    // Rating starts at 0, increases by 0.2 for each completed job up to 5.0
    const completedJobs = this.getBookingsForWorker(workerId).filter((b) => b.status === "completed").length
    return Math.min(5.0, completedJobs * 0.2)
  }

  // Initialize store without dummy data
  initializeStore() {
    // Just initialize the store structure, don't add dummy data
    // Users will register themselves
    if (!localStorage.getItem("workers")) {
      localStorage.setItem("workers", JSON.stringify([]))
    }
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]))
    }
    if (!localStorage.getItem("bookings")) {
      localStorage.setItem("bookings", JSON.stringify([]))
    }
  }
}

export const dataStore = DataStore.getInstance()
