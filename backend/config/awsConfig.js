import { RekognitionClient, DetectModerationLabelsCommand } from "@aws-sdk/client-rekognition";
import fs from "fs";
import { dirname, join, basename } from 'path';
import { fileURLToPath } from "url";
import dotenv from 'dotenv';

dotenv.config();

// Get __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));
console.log(__dirname)

// Configure AWS SDK v3 Client
const rekognitionClient = new RekognitionClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Folder containing images
const imageFolder = join(__dirname, "uploads/placePhotos");

// Get list of image files
const imageFiles = fs.readdirSync(imageFolder).filter(file => file.endsWith(".jpg"));

// Function to analyze an image
const analyzeImage = async (filePath) => {
    const imageBytes = fs.readFileSync(filePath);
    const params = { Image: { Bytes: imageBytes } };

    try {
        const command = new DetectModerationLabelsCommand(params);
        const data = await rekognitionClient.send(command);
        return { file: basename(filePath), labels: data.ModerationLabels };
    } catch (err) {
        return { file: basename(filePath), error: err.message };
    }
};

// Process images in parallel (5-10 at a time)
const processImages = async () => {
    const batchSize = 5; // Adjust based on your needs
    for (let i = 0; i < imageFiles.length; i += batchSize) {
        const batch = imageFiles.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(file => analyzeImage(join(imageFolder, file))));
        console.log("Batch Results:", JSON.stringify(results, null, 2));
    }
};

export { processImages };