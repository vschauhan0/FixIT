const cors = require("cors")

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5000",
      process.env.CLIENT_URL,
    ].filter(Boolean)

    // In production/Vercel, we might want to be more permissive or check the domain
    const isAllowed = allowedOrigins.some((o) => origin.startsWith(o)) || process.env.NODE_ENV === "production"

    if (isAllowed) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

module.exports = cors(corsOptions)
