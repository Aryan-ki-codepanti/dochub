import mongoose from "mongoose";

const fileModel = mongoose.Schema(
    {
        filename: { type: String, required: true },
        size: { type: Number, required: true },
        sizeReadable: { type: String },
        path: { type: String, required: true }, // /uploads/uid or /uploads/chatid
        mimetype: { type: String, required: true },
        isShared: { type: Boolean, default: false },
        groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        driveId: { type: String } // Stores Google Drive file ID
    },
    { timestamps: true }
);

const FileModel = mongoose.model("File", fileModel);

export default FileModel;
