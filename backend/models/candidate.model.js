import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    resumeUrl: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    skills: [{
        type: String
    }],
    experience: {
        type: Number, // in years
        default: 0
    },
    razorpayCustomerId: {
        type: String, 
        trim: true,
    }
}, { timestamps: true })

export const Candidate = mongoose.model('Candidate', candidateSchema);