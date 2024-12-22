import express from "express";
import {
    getAllPeople,
    updateFriendStatus
} from "../controllers/friendController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAllPeople); // search or get all people

router.route("/action").put(protect, updateFriendStatus); //  cancel(0) / send(1) /accept(2)/reject(3) /unfriend (4)

export default router;
