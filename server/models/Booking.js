const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    estimatedDuration: {
      type: Number, // in hours
      required: true,
    },
    pricing: {
      customerBudget: {
        min: Number,
        max: Number,
      },
      workerQuote: Number,
      finalPrice: Number,
      negotiationHistory: [
        {
          from: {
            type: String,
            enum: ["customer", "worker"],
          },
          amount: Number,
          message: String,
          timestamp: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    status: {
      type: String,
      enum: ["pending", "negotiating", "accepted", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    images: [String], // Before/after photos
    notes: String,
    completedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Booking", bookingSchema)
