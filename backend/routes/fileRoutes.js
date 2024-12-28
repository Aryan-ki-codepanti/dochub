import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import upload from "../config/multerConfigure.js";
import {
    deleteFile,
    downloadFile,
    getFilesInfo,
    uploadFiles,
    viewFile
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/", protect, getFilesInfo);
router.get("/:groupId", protect, getFilesInfo);
router.post("/upload", protect, upload.array("files", 5), uploadFiles);
router.post("/upload/:groupId", protect, upload.array("files", 5), uploadFiles);
router.post("/download", protect, downloadFile);
router.post("/view", protect, viewFile);
router.post("/delete", protect, deleteFile);

export default router;
