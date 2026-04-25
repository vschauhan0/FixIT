const express = require("express")
const Review = require("../models/Review")
const Worker = require("../models/Worker")
const Booking = require("../models/Booking")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   POST /api/reviews
// @desc    Create review
// @access  Private (Customer only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.userDoc.userType !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Customer account required.",
      })
    }

    const { bookingId, workerId, rating, comment, categories, images } = req.body

    // Verify booking exists and belongs to customer
    const booking = await Booking.findById(bookingId)
    if (!booking || booking.customerId.toString() !== req.user.userId) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or access denied",
      })
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already exists for this booking",
      })
    }

    const review = new Review({
      bookingId,
      customerId: req.user.userId,
      workerId,
      rating,
      comment,
      categories,
      images,
    })

    await review.save()

    // Update worker's rating
    const worker = await Worker.findById(workerId)
    if (worker) {
      const totalRating = worker.rating.average * worker.rating.count + rating
      worker.rating.count += 1
      worker.rating.average = totalRating / worker.rating.count
      await worker.save()
    }

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    })
  } catch (error) {
    console.error("Create review error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   GET /api/reviews/worker/:workerId
// @desc    Get reviews for a worker
// @access  Public
router.get("/worker/:workerId", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const reviews = await Review.find({ workerId: req.params.workerId })
      .populate("customerId", "name profileImage")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Review.countDocuments({ workerId: req.params.workerId })

    res.json({
      success: true,
      reviews,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get reviews error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
