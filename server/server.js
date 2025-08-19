import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./config/db.js";
import { initSentry } from "./config/instrument.js";
import {clerkWebhooks} from "./controllers/webhooks.js"

const Sentry = initSentry();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to DB
await connectDB();

// RequestHandler must be before all routes
app.use(Sentry.Handlers.requestHandler());

// Simple test route
app.get("/", (req, res) => res.send("API WORKING 🚀"));

// Debug Sentry route
app.get("/debug-sentry", function mainHandler(req,res){
  throw new Error("My first Sentry error!");
});


// Error handlers (Sentry first)
app.use(Sentry.Handlers.errorHandler());

// Custom JSON error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

app.post('/webhooks',clerkWebhooks)
