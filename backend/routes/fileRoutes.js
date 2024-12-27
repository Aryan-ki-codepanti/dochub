import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import upload from "../config/multerConfigure.js";
import { getFilesInfo, uploadFiles } from "../controllers/fileController.js";

const router = express.Router();

router.get("/", protect, getFilesInfo);
router.post("/upload", protect, upload.array("files", 5), uploadFiles);

export default router;
