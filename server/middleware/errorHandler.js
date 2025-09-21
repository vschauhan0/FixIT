const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    })
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message)
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    })
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    })
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  })
}

module.exports = errorHandler
