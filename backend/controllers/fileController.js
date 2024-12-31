import asyncHandler from "express-async-handler";
import { filesize } from "filesize";
import FileModel from "../models/fileModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
    uploadFileToDrive,
    deleteFileFromDrive
} from "../config/googleDriveUtils.js";

import mime from "mime";
import Chat from "../models/chatModel.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../uploads");

//@description     GET files from /uploads/userId  directory or  group directory if provided
//@route           GET /api/files/<optional :groupId>
//@access          Protected
const getFilesInfo = asyncHandler(async (req, res) => {
    // handle group files
    if (req.params.groupId) {
        const group = await Chat.find({
            _id: req.params.groupId,
            users: { $elemMatch: { $eq: req.user._id } }
        });

        if (!group)
            res.status(401).json({
                message: "You can not access this group files"
            });

        const data = await FileModel.find({ groupId: req.params.groupId })
            .sort({
                updatedAt: -1
            })
            .populate("groupId", "_id chatName")
            .populate("owner", "-password");
        res.status(200).json(data);
        return;
    }

    // USER my FILEs
    const data = await FileModel.find({
        isShared: false,
        owner: req.user._id
    }).sort({
        updatedAt: -1
    });
    res.status(200).json(data);
});

//@description     Upload 1 to 5 files to /uploads/userId  directory or /uploads/groupId
//@route           POST /api/files/upload/<optional :groupId>
//@access          Protected
const uploadFiles = asyncHandler(async (req, res) => {
    if (req.params.groupId) {
        let fileData = [];
        for (let file of req.files) {
            let path = `uploads/${req.params.groupId}/${file.filename}`;
            let fileObj = {
                filename: file.filename,
                size: file.size,
                sizeReadable: filesize(file.size),
                path,
                mimetype: file.mimetype,
                owner: req.user._id,
                groupId: req.params.groupId,
                isShared: true
            };

            let savedF = await FileModel.findOneAndUpdate({ path }, fileObj, {
                new: true,
                upsert: true
            }).populate("owner", "-password");
            fileData.push(savedF);
        }
        res.status(201).json(fileData);
        return;
    }

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
    res.status(201).json(fileData);
});

//@description     Download a specific file
//@route           POST /api/files/download
//@access          Protected
const downloadFile = asyncHandler(async (req, res) => {
    const { user } = req;
    const { fileInfo, groupId } = req.body;

    // groupfile delete

    // if user is not owner of personal file
    if (!groupId && fileInfo.owner.toString() !== user._id.toString())
        return res
            .status(401)
            .json({ message: "You can not access this file" });

    let filePath = path.join(
        UPLOAD_DIR,
        groupId ? groupId.toString() : user._id.toString(),
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
    const { fileInfo, groupId } = req.body;

    // if user is not owner of file
    if (!groupId && fileInfo.owner.toString() !== user._id.toString())
        return res
            .status(401)
            .json({ message: "You can not access this file" });

    const filePath = path.join(
        UPLOAD_DIR,
        groupId ? groupId.toString() : user._id.toString(),
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

//@description     Delete a specific file
//@route           DELETE /api/files
//@access          Protected
const deleteFile = asyncHandler(async (req, res) => {
    const { user } = req;
    const { fileInfo, groupId } = req.body;

    // if user is not owner of personal file
    if (!groupId && fileInfo.owner.toString() !== user._id.toString())
        return res
            .status(401)
            .json({ message: "You can not access this file" });

    const filePath = path.join(
        UPLOAD_DIR,
        groupId ? groupId.toString() : user._id.toString(),
        fileInfo.filename
    );

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found." });
    }

    // delete DB record
    await FileModel.findByIdAndDelete(fileInfo._id);

    // Delete the file
    fs.unlink(filePath, err => {
        if (err) {
            console.error("Error deleting file:", err);
            return res
                .status(500)
                .json({ message: "Failed to delete the file." });
        }

        res.status(200).json({
            success: true,
            message: "File deleted successfully."
        });
    });
});

// GOOGLE DRIVE CONTROLLERS

//@description     Upload 1 to 5 files to /uploads/userId  directory or /uploads/groupId
//@route           POST /api/files/upload/<optional :groupId>
//@access          Protected
const uploadFilesToDriveController = asyncHandler(async (req, res) => {
    const folderName = req.params.groupId || req.user._id.toString();
    let fileData = [];

    for (const file of req.files) {
        const uploadedFile = await uploadFileToDrive(file, folderName);
        const fileObj = {
            filename: uploadedFile.name,
            driveId: uploadedFile.id,
            size: file.size,
            sizeReadable: filesize(file.size),
            path: `https://drive.google.com/file/d/${uploadedFile.id}/view`,
            mimetype: file.mimetype,
            owner: req.user._id,
            groupId: req.params.groupId || null,
            isShared: !!req.params.groupId
        };

        const savedFile = await FileModel.findOneAndUpdate(
            { driveId: uploadedFile.id },
            fileObj,
            { new: true, upsert: true }
        ).populate("owner", "-password");
        fileData.push(savedFile);
    }

    res.status(201).json(fileData);
});

//@description     Delete a specific file
//@route           DELETE /api/files
//@access          Protected
const deleteFileFromDriveController = asyncHandler(async (req, res) => {
    const { user } = req;
    const { fileInfo, groupId } = req.body;

    // if user is not owner of personal file
    if (!groupId && fileInfo.owner.toString() !== user._id.toString())
        return res
            .status(401)
            .json({ message: "You can not access this file" });

    // Check if the file has id
    if (!fileInfo.driveId) {
        return res
            .status(404)
            .json({ message: "File not found on google drive." });
    }

    // delete DB record
    await FileModel.findOneAndDelete({ driveId: fileInfo.driveId });

    // Delete the file from drive
    try {
        await deleteFileFromDrive(fileInfo.driveId);
        res.status(200).json({
            success: true,
            message: "File deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Failed to delete the file." });
    }
});

export {
    getFilesInfo,
    uploadFiles,
    downloadFile,
    viewFile,
    deleteFile,
    uploadFilesToDriveController,
    deleteFileFromDriveController
};
