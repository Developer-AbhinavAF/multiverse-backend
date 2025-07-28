import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"

// Import all routes
import movieRoutes from "./routes/movieRoutes.js";
import pcGamesRoutes from "./routes/pcGamesRoutes.js";
import pcAppsRoutes from "./routes/pcAppsRoutes.js";
import animeMovieRoutes from "./routes/animeMovieRoutes.js";
import animeSeriesRoutes from "./routes/animeSeriesRoutes.js";
import iosGamesRoutes from "./routes/iosGamesRoutes.js";
import androidAppsRoutes from "./routes/androidAppsRoutes.js";
import webSeriesRoutes from "./routes/webSeriesRoutes.js";
import modApksRoutes from "./routes/modApksRoutes.js";
import androidGamesRoutes from "./routes/androidGamesRoutes.js";

const app = express();

// Enhanced CORS configuration
app.use(cors());


app.use(express.json());
dotenv.config(); // Make sure to call this at the top

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1);
}
// Connect to MongoDB with better error handling
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected ✅"))
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/pcGames", pcGamesRoutes);
app.use("/api/pcApps", pcAppsRoutes);
app.use("/api/animeMovie", animeMovieRoutes);
app.use("/api/animeSeries", animeSeriesRoutes);
app.use("/api/iosGames", iosGamesRoutes);
app.use("/api/androidApps", androidAppsRoutes);
app.use("/api/webSeries", webSeriesRoutes);
app.use("/api/modApks", modApksRoutes);
app.use("/api/androidGames", androidGamesRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = 5000;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

// Handle shutdown gracefully
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
