import express from "express";
import { addRestaurant } from "../controllers/restaurant.js";
import { isAuth, isSeller } from "../middlewares/isAuth.js";
import { fetchMyRestaurant } from "../controllers/restaurant.js";


const router = express.Router();

router.post("/new", isAuth, isSeller, addRestaurant);
router.get("/my",isAuth,isSeller, fetchMyRestaurant);

export default router;
