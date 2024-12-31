import { google } from "googleapis";
import fs from "fs";
import path from "path";

import dotenv from "dotenv";
import { PassThrough } from "stream";
dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const FOLDER_ID = "root";

const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

export const drive = google.drive({ version: "v3", auth });

const bufferToStream = buffer => {
    const stream = new PassThrough();
    stream.end(buffer);
    return stream;
};

const findOrCreateFolder = async (name, parentId) => {
    const query = `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${name}'`;
    const folderRes = await drive.files.list({ q: query });
    let folderId = folderRes.data.files[0]?.id;

    if (!folderId) {
        const folderMetadata = {
            name,
            mimeType: "application/vnd.google-apps.folder",
            parents: [parentId]
        };
        const folder = await drive.files.create({
            resource: folderMetadata,
            fields: "id"
        });
        folderId = folder.data.id;
    }

    return folderId;
};

export const uploadFileToDrive = async (file, folderName) => {
    let rootFolderId = await findOrCreateFolder(
        process.env.GOOGLE_DOCHUB_FOLDER_NAME,
        "root"
    );
    const subFolderId = await findOrCreateFolder(folderName, rootFolderId);

    const fileMetadata = {
        name: file.originalname,
        parents: [subFolderId]
    };

    const media = {
        mimeType: file.mimetype,
        body: bufferToStream(file.buffer)
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: "id, name"
    });

    return response.data;
};

export const downloadFileFromDrive = async (fileId, dest) => {
    const destPath = path.join(dest, fileId);
    const response = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "stream" }
    );

    const fileStream = fs.createWriteStream(destPath);
    response.data.pipe(fileStream);

    return new Promise((resolve, reject) => {
        fileStream.on("finish", () => resolve(destPath)).on("error", reject);
    });
};
