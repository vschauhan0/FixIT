const express = require("express")
const Worker = require("../models/Worker")
const User = require("../models/User")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/workers
// @desc    Get all workers with filters
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { service, city, minRating, maxRate, page = 1, limit = 10 } = req.query

    const query = { isActive: true }
    const userQuery = {}

    // Filter by service
    if (service) {
      query.services = { $in: [service] }
    }

    // Filter by city
    if (city) {
      userQuery["address.city"] = new RegExp(city, "i")
    }

    // Filter by rating
    if (minRating) {
      query["rating.average"] = { $gte: Number.parseFloat(minRating) }
    }

    // Filter by hourly rate
    if (maxRate) {
      query["hourlyRate.min"] = { $lte: Number.parseFloat(maxRate) }
    }

    const workers = await Worker.find(query)
      .populate({
        path: "userId",
        select: "name email phone address profileImage",
        match: userQuery,
      })
      .sort({ "rating.average": -1, completedJobs: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    // Filter out workers whose user didn't match the city filter
    const filteredWorkers = workers.filter((worker) => worker.userId)

    const total = await Worker.countDocuments(query)

    res.json({
      success: true,
      workers: filteredWorkers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get workers error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   GET /api/workers/:id
// @desc    Get worker by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).populate("userId", "name email phone address profileImage")

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      })
    }

    res.json({
      success: true,
      worker,
    })
  } catch (error) {
    console.error("Get worker error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

// @route   PUT /api/workers/profile
// @desc    Update worker profile
// @access  Private (Worker only)
router.put("/profile", auth, async (req, res) => {
  try {
    if (req.userDoc.userType !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Worker account required.",
      })
    }

    const { services, experience, hourlyRate, availability, description, certifications } = req.body

    const worker = await Worker.findOne({ userId: req.user.userId })
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      })
    }

    // Update worker fields
    if (services) worker.services = services
    if (experience !== undefined) worker.experience = experience
    if (hourlyRate) worker.hourlyRate = hourlyRate
    if (availability) worker.availability = availability
    if (description) worker.description = description
    if (certifications) worker.certifications = certifications

    await worker.save()

    res.json({
      success: true,
      message: "Worker profile updated successfully",
      worker,
    })
  } catch (error) {
    console.error("Update worker profile error:", error)
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
})

module.exports = router
