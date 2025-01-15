import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/dbConnection.js';
import errorHandler from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
connectDb();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + "/uploads"));

app.use("/api/user", userRoutes);
app.use("/api/place", placeRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});