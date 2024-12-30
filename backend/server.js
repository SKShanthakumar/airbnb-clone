import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/dbConnection.js';
import errorHandler from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

dotenv.config();
connectDb();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use("/api/user", userRoutes);
app.use(errorHandler);

app.get('/test', (req,res)=>{
    res.json("ok");
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});