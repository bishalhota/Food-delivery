import express from 'express';
import { loginUser } from '../controllers/auth.js';
import { addUserRole } from '../controllers/auth.js';
import { isAuth } from '../middlewares/isAuth.js';
import { myProfile } from '../controllers/auth.js';
import { reverseLocation } from '../controllers/auth.js';

const router = express.Router();

router.post("/login", loginUser);
router.put("/add/role",isAuth, addUserRole);
router.get("/me", isAuth,myProfile);
router.get("/location/reverse", reverseLocation);

export default router;
