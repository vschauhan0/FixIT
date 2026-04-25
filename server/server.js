const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const helmet = require("helmet")
const corsMiddleware = require("./middleware/cors")
const errorHandler = require("./middleware/errorHandler")
const { generalLimiter, authLimiter } = require("./middleware/rateLimiter")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const workerRoutes = require("./routes/workers")
const bookingRoutes = require("./routes/bookings")
const reviewRoutes = require("./routes/reviews")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(corsMiddleware)
app.use(generalLimiter)

// Middleware
app.use(cors())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fixit"
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err))

// Routes
app.use("/api/auth", authLimiter, authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/workers", workerRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/reviews", reviewRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FixIt API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🌐 API URL: http://localhost:${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log("❌ Unhandled Promise Rejection:", err.message)
  // Close server & exit process
  server.close(() => {
    process.exit(1)
  })
})
