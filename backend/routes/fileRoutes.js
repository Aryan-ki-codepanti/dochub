import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import upload from "../config/multerConfigure.js";
import {
    deleteFile,
    downloadFile,
    getFilesInfo,
    uploadFiles,
    viewFile,
    uploadFilesToDriveController,
    deleteFileFromDriveController
} from "../controllers/fileController.js";
import multer from "multer";

const router = express.Router();

const uploadToMemory = multer({ storage: multer.memoryStorage() });

router.get("/", protect, getFilesInfo);
router.get("/:groupId", protect, getFilesInfo);
router.post("/upload", protect, upload.array("files", 5), uploadFiles);
router.post("/upload/:groupId", protect, upload.array("files", 5), uploadFiles);
router.post(
    "/upload-drive",
    protect,
    uploadToMemory.array("files", 5),
    uploadFilesToDriveController
);
router.post(
    "/upload-drive/:groupId",
    protect,
    uploadToMemory.array("files", 5),
    uploadFilesToDriveController
);
router.post("/download", protect, downloadFile);
router.post("/view", protect, viewFile);
router.post("/delete", protect, deleteFile);
router.post("/delete-drive", protect, deleteFileFromDriveController);

export default router;
