import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';


import userRoutes from './routes/user.route.js';
import approvalRequestRoutes from './routes/approvalRequest.route.js';
import candidateRoutes from './routes/candidate.route.js';
import interviewerRoutes from './routes/interviewer.route.js';

config();

const app = express();
const PORT = process.env.PORT || 8000;

await connectDB();

app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


// all the routes are listed below
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/approval-requests", approvalRequestRoutes);
app.use("/api/v1/candidates", candidateRoutes);
app.use("/api/v1/interviewers", interviewerRoutes);



app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to InCruiter API" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});