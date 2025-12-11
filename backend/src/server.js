// server.js
import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

const app = express();
const __dirname = path.resolve();

// --- Middlewares ---
app.use(express.json());

// Simple request logger to verify incoming requests (keep in production temporarily if debugging)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

// CORS - allow browser to include cookies when calling your API
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// Clerk middleware (ensure @clerk/express is installed and configured via env vars)
app.use(clerkMiddleware());

// --- Mount API routes FIRST so they are not shadowed by static/catch-all ---
app.use("/api/inngest", serve({ client: inngest, functions }));

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// --- Static front-end serving (only in production) ---
if (ENV.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(staticPath));

  // Proper Express catch-all for client-side routing (must come after API routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Start server with a safe port fallback
const startServer = async () => {
  try {
    await connectDB();
    const port = ENV.PORT || process.env.PORT || 3000;
    app.listen(port, () => console.log("Server is running on port:", port));
  } catch (error) {
    console.error("💥 Error starting the server", error);
    process.exit(1);
  }
};

startServer();
