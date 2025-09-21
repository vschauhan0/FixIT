const mongoose = require("mongoose")

const workerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    services: [
      {
        type: String,
        enum: ["electrician", "carpenter", "painter", "plumber", "cleaner", "gardener", "mechanic"],
        required: true,
      },
    ],
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    hourlyRate: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },
    availability: {
      days: [
        {
          type: String,
          enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        },
      ],
      hours: {
        start: String,
        end: String,
      },
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    description: {
      type: String,
      maxlength: 500,
    },
    portfolio: [
      {
        title: String,
        description: String,
        images: [String],
        completedDate: Date,
      },
    ],
    certifications: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Worker", workerSchema)
