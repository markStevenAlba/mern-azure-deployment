const path = require("path"); // Classic fs
const fs = require("fs-extra"); // Classic fs
const asyncHandler = require('./asyncHandler.js');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const uploadPath = process.env.STORAGE_PATH ? process.env.STORAGE_PATH : "/media/bugtech/extra/uploads"; // Register the upload path
fs.ensureDir(uploadPath); // Make sure that the upload path exists

const upload = asyncHandler(async (req, res, next) => {
    let ownerId = req.userId;
    fs.ensureDir(path.join(uploadPath, String(ownerId)); // Make sure that the upload path exists

    try {
        req.pipe(req.busboy); // Pipe it through busboy
        req.busboy.on('file', (fieldname, file, fileData) => {
            const filename = fileData.filename;
            const fileId = uuidv4();
            const extentions = filename.split('.');
            const extension = extentions[extentions.length - 1];
            const storageLocation = path.join(uploadPath, String(ownerId), fileId);

            // Create a write stream of the new file
            const fstream = fs.createWriteStream(storageLocation);
            // Pipe it through
            file.pipe(fstream);

            let newFile = {
                name: fileData.filename,
                contentType: fileData.mimeType,
                storageLocation,
                fileId,
                filename,
                extension
            };

            // On finish of the upload
            fstream.on('error', (err) => {
                console.log(err);
                console.log(`Error of '${filename}' upload`);
                res.status(400).json({ message: 'Something went wrong!' });
            });

            fstream.on('finish', async () => {
                let stat = await fs.stat(storageLocation);
                console.log(`Upload of '${filename}' finished`);
            });

            // On finish of the upload
            fstream.on('close', async (data) => {
                console.log(data);
                console.log(`Upload of '${filename}' Close`);
                let stat = await fs.stat(storageLocation);
                req.file = { ...newFile, size: stat.size };
                next();
            });
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = {
    upload
};
