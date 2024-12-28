import asyncHandler from "express-async-handler";
import { filesize } from "filesize";
import FileModel from "../models/fileModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import mime from "mime";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../uploads");

//@description     GET files from /uploads/userId  directory
//@route           GET /api/files/
//@access          Protected
const getFilesInfo = asyncHandler(async (req, res) => {
    const data = await FileModel.find({ owner: req.user._id }).sort({
        updatedAt: -1
    });
    res.status(200).json(data);
});

//@description     Upload 1 to 5 files to /uploads/userId  directory
//@route           POST /api/files/upload
//@access          Protected
const uploadFiles = asyncHandler(async (req, res) => {
    let fileData = [];
    for (let file of req.files) {
        let path = `uploads/${req.user._id}/${file.filename}`;
        let fileObj = {
            filename: file.filename,
            size: file.size,
            sizeReadable: filesize(file.size),
            path,
            mimetype: file.mimetype,
            owner: req.user._id
        };

        let savedF = await FileModel.findOneAndUpdate({ path }, fileObj, {
            new: true,
            upsert: true
        }).populate("owner", "-password");
        fileData.push(savedF);
    }
    res.json(fileData);
});

//@description     Download a specific file
//@route           POST /api/files/download
//@access          Protected
const downloadFile = asyncHandler(async (req, res) => {
    const { user } = req;
    const { fileInfo } = req.body;

    // if user is not owner of file
    if (fileInfo.owner.toString() !== user._id.toString())
        return res
            .status(401)
            .json({ message: "You can not access this file" });

    const filePath = path.join(
        UPLOAD_DIR,
        user._id.toString(),
        fileInfo.filename
    );

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found." });
    }

    res.download(filePath, fileInfo.filename, err => {
        if (err) {
            res.status(500).json({
                message: "Error while downloading the file."
            });
        }
    });
});

//@description     View a specific file (inline display in the browser)
//@route           POST /api/files/view
//@access          Protected
const viewFile = asyncHandler(async (req, res) => {
    const { user } = req;
    const { fileInfo } = req.body;

    // if user is not owner of file
    if (fileInfo.owner.toString() !== user._id.toString())
        return res
            .status(401)
            .json({ message: "You can not access this file" });

    const filePath = path.join(
        UPLOAD_DIR,
        user._id.toString(),
        fileInfo.filename
    );

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found." });
    }

    res.setHeader(
        "Content-Type",
        mime.getType(filePath) || "application/octet-stream"
    );
    res.setHeader(
        "Content-Disposition",
        `inline; filename=${fileInfo.filename}`
    );
    fs.createReadStream(filePath).pipe(res);
});

export { getFilesInfo, uploadFiles, downloadFile, viewFile };
