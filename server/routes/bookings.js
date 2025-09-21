const express = require("express")
const Booking = require("../models/Booking")
const Worker = require("../models/Worker")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private (Customer only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.userDoc.userType !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Customer account required.",
      })
    }

    const { workerId, serviceType, description, location, scheduledDate, estimatedDuration, customerBudget } = req.body

    // Verify worker exists
    const worker = await Worker.findById(workerId)
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      })
    }

    const booking = new Booking({
      customerId: req.user.userId,
      workerId,
      serviceType,
      description,
      location,
      scheduledDate,
      estimatedDuration,
      pricing: {
        customerBudget,
      },
    })

    await booking.save()

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customerId", "name email phone")
      .populate("workerId")

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    })
  } catch (error) {
    console.error("Create booking error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const query = {}

    if (req.userDoc.userType === "customer") {
      query.customerId = req.user.userId
    } else if (req.userDoc.userType === "worker") {
      const worker = await Worker.findOne({ userId: req.user.userId })
      if (worker) {
        query.workerId = worker._id
      }
    }

    const bookings = await Booking.find(query)
      .populate("customerId", "name email phone")
      .populate("workerId")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      bookings,
    })
  } catch (error) {
    console.error("Get bookings error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT /api/bookings/:id/negotiate
// @desc    Add negotiation offer
// @access  Private
router.put("/:id/negotiate", auth, async (req, res) => {
  try {
    const { amount, message } = req.body

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    // Check if user is involved in this booking
    const worker = await Worker.findOne({ userId: req.user.userId })
    const isCustomer = booking.customerId.toString() === req.user.userId
    const isWorker = worker && booking.workerId.toString() === worker._id.toString()

    if (!isCustomer && !isWorker) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    const from = isCustomer ? "customer" : "worker"

    booking.pricing.negotiationHistory.push({
      from,
      amount,
      message,
      timestamp: new Date(),
    })

    if (from === "worker") {
      booking.pricing.workerQuote = amount
    }

    booking.status = "negotiating"
    await booking.save()

    res.json({
      success: true,
      message: "Negotiation offer added",
      booking,
    })
  } catch (error) {
    console.error("Negotiate booking error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT /api/bookings/:id/accept
// @desc    Accept booking
// @access  Private (Worker only)
router.put("/:id/accept", auth, async (req, res) => {
  try {
    if (req.userDoc.userType !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Worker account required.",
      })
    }

    const { finalPrice } = req.body

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      })
    }

    const worker = await Worker.findOne({ userId: req.user.userId })
    if (!worker || booking.workerId.toString() !== worker._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    booking.status = "accepted"
    booking.pricing.finalPrice = finalPrice
    await booking.save()

    res.json({
      success: true,
      message: "Booking accepted",
      booking,
    })
  } catch (error) {
    console.error("Accept booking error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
