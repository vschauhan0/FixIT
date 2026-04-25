const express = require("express")
const Booking = require("../models/Booking")
const Worker = require("../models/Worker")
const User = require("../models/User")
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
      .populate({ path: "workerId", populate: { path: "userId", select: "name email phone" } })

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
      .populate({ path: "workerId", populate: { path: "userId", select: "name email phone" } })
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
// @desc    Add negotiation offer (both worker and customer can negotiate)
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

    const populated = await Booking.findById(booking._id)
      .populate("customerId", "name email phone")
      .populate({ path: "workerId", populate: { path: "userId", select: "name email phone" } })

    res.json({
      success: true,
      message: "Negotiation offer added",
      booking: populated,
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
// @desc    Accept booking (worker accepts customer request or counter-offer)
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
    booking.pricing.finalPrice = finalPrice || booking.pricing.customerBudget?.max || 0
    await booking.save()

    const populated = await Booking.findById(booking._id)
      .populate("customerId", "name email phone")
      .populate({ path: "workerId", populate: { path: "userId", select: "name email phone" } })

    res.json({
      success: true,
      message: "Booking accepted",
      booking: populated,
    })
  } catch (error) {
    console.error("Accept booking error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT /api/bookings/:id/accept-offer
// @desc    Customer accepts worker's counter-offer
// @access  Private (Customer only)
router.put("/:id/accept-offer", auth, async (req, res) => {
  try {
    if (req.userDoc.userType !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Customer account required.",
      })
    }

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }

    if (booking.customerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Access denied" })
    }

    // Accept the last worker quote as final price
    const finalPrice = booking.pricing.workerQuote || booking.pricing.customerBudget?.max || 0
    booking.status = "accepted"
    booking.pricing.finalPrice = finalPrice
    await booking.save()

    const populated = await Booking.findById(booking._id)
      .populate("customerId", "name email phone")
      .populate({ path: "workerId", populate: { path: "userId", select: "name email phone" } })

    res.json({ success: true, message: "Offer accepted! Booking confirmed.", booking: populated })
  } catch (error) {
    console.error("Accept offer error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// @route   PUT /api/bookings/:id/decline
// @desc    Worker declines booking request
// @access  Private (Worker only)
router.put("/:id/decline", auth, async (req, res) => {
  try {
    if (req.userDoc.userType !== "worker") {
      return res.status(403).json({ success: false, message: "Access denied. Worker account required." })
    }

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }

    const worker = await Worker.findOne({ userId: req.user.userId })
    if (!worker || booking.workerId.toString() !== worker._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" })
    }

    booking.status = "cancelled"
    booking.cancellationReason = req.body.reason || "Declined by worker"
    booking.cancelledAt = new Date()
    await booking.save()

    res.json({ success: true, message: "Booking declined", booking })
  } catch (error) {
    console.error("Decline booking error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// @route   PUT /api/bookings/:id/complete
// @desc    Worker marks job as completed — updates revenue and rating
// @access  Private (Worker only)
router.put("/:id/complete", auth, async (req, res) => {
  try {
    if (req.userDoc.userType !== "worker") {
      return res.status(403).json({ success: false, message: "Access denied. Worker account required." })
    }

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }

    const worker = await Worker.findOne({ userId: req.user.userId })
    if (!worker || booking.workerId.toString() !== worker._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied" })
    }

    booking.status = "completed"
    booking.completedAt = new Date()
    await booking.save()

    // Recalculate worker stats
    const allCompletedBookings = await Booking.find({ workerId: worker._id, status: "completed" })
    const totalRevenue = allCompletedBookings.reduce((sum, b) => sum + (b.pricing?.finalPrice || 0), 0)
    const completedCount = allCompletedBookings.length

    worker.completedJobs = completedCount
    // Store revenue in a new field (add to schema dynamically)
    worker.revenue = totalRevenue
    await worker.save()

    res.json({
      success: true,
      message: "Job marked as completed!",
      booking,
      workerStats: {
        completedJobs: completedCount,
        revenue: totalRevenue,
      },
    })
  } catch (error) {
    console.error("Complete booking error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

// @route   POST /api/bookings/:id/review
// @desc    Customer leaves a review for a completed booking
// @access  Private (Customer only)
router.post("/:id/review", auth, async (req, res) => {
  try {
    if (req.userDoc.userType !== "customer") {
      return res.status(403).json({ success: false, message: "Access denied. Customer account required." })
    }

    const { rating, comment } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Valid rating between 1 and 5 is required" })
    }

    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" })
    }

    if (booking.customerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Access denied" })
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ success: false, message: "You can only review completed jobs" })
    }

    if (booking.review && booking.review.rating) {
      return res.status(400).json({ success: false, message: "Review already submitted for this booking" })
    }

    // Add review to booking
    booking.review = {
      rating,
      comment,
      createdAt: new Date()
    }
    await booking.save()

    // Recalculate average rating for the worker
    const workerBookings = await Booking.find({ 
      workerId: booking.workerId, 
      "review.rating": { $exists: true } 
    })

    const totalRating = workerBookings.reduce((sum, b) => sum + b.review.rating, 0)
    const reviewCount = workerBookings.length
    const averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0

    // Update worker profile
    const worker = await Worker.findById(booking.workerId)
    if (worker) {
      worker.rating.average = Number(averageRating)
      worker.rating.count = reviewCount
      await worker.save()
    }

    res.json({
      success: true,
      message: "Review submitted successfully!",
      booking
    })
  } catch (error) {
    console.error("Submit review error:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
})

module.exports = router
