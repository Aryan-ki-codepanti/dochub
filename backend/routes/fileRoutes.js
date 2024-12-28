import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import upload from "../config/multerConfigure.js";
import {
    downloadFile,
    getFilesInfo,
    uploadFiles,
    viewFile
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/", protect, getFilesInfo);
router.post("/upload", protect, upload.array("files", 5), uploadFiles);
router.post("/download", protect, downloadFile);
router.post("/view", protect, viewFile);

export default router;
