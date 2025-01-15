import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, extname, join } from 'path';
import imageDownloader from 'image-downloader';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

//@desc Register a user
//@route POST /api/place/upload-by-link
//@access private
const uploadByLink = asyncHandler(async (req, res) => {
    const { link } = req.body;
    const extension = extname(link);
    const newName = req.user.name + "-" + Date.now() + extension;

    try {
        await imageDownloader.image({
            url: link,
            dest: join(__dirname, 'uploads', newName),
        })
        res.json({ fileName: newName }).status(200);
    } catch (e) {
        res.status(404);
        throw new Error("invalid link");
    }
});

//@desc Register a user
//@route POST /api/place/upload-from-device
//@access private
const uploadFromDevice = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
      }
    
      // Get the filenames of uploaded files
      const fileNames = req.files.map(file => file.filename);
    
      // Send the filenames as response
      res.json({ fileNames });
});

export { uploadByLink, uploadFromDevice }