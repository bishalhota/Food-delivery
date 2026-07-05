import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import restaurantRoutes from "./routes/restaurant.js";

dotenv.config();


const app = express();

const PORT = process.env.PORT || 5001;

app.use("/api/restaurant", restaurantRoutes);;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
