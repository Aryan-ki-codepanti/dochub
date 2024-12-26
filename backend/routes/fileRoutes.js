import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import { uploadFiles } from "../controllers/fileController.js";

const router = express.Router();

router.route("/upload").post(protect, uploadFiles);

export default router;
