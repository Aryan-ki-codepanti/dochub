import express from "express";
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    googleAuthUser,
    searchUsers
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);

router.route("/").get(protect, searchUsers);
router.post("/auth", authUser);
router.post("/auth/google", googleAuthUser);
router.post("/logout", logoutUser);
router
    .route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

export default router;
