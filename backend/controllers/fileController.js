import asyncHandler from "express-async-handler";
import { filesize } from "filesize";
import FileModel from "../models/fileModel.js";

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

export { uploadFiles };
