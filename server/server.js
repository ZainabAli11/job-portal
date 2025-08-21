import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import { initSentry } from "./config/instrument.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { clerkMiddleware } from "@clerk/express";

const Sentry = initSentry();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Connect DB & Cloudinary
await connectDB();
await connectCloudinary();

// Sentry Request Handler (must be before routes)
app.use(Sentry.Handlers.requestHandler());

// Health check
app.get("/", (req, res) => res.send("API WORKING 🚀"));

// Debug route for Sentry
app.get("/debug-sentry", () => {
  throw new Error("My first Sentry error!");
});

// Webhooks
app.post("/webhooks", clerkWebhooks);

// Routes
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

// Sentry error handler
app.use(Sentry.Handlers.errorHandler());

// Custom JSON error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
