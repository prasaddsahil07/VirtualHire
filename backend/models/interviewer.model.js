import mongoose from "mongoose";

const interviewerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true,
        index: true
    },
    bio: {
        type: String,
        trim: true,
        maxlength: 200,
        default: ''
    },
    companies: [{
        type: String,
        trim: true,
        index: true,
        required: true
    }],
    expertise: [{
        type: String,
        trim: true,
        index: true,
        required: true
    }],
    experience: {
        type: Number,   // in years
        required: true,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        index: true
    },
    totalBalance: {
        type: Number,
        default: 0
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    linkedinProfile: {
        type: String,
        required: true,
        trim: true
    },
    employeeMailId: {
        type: String,
        required: true,
        trim: true
    },
    razorpayRecipientId: { 
        type: String,
        trim: true, 
        index: true 
    },
    payoutsEnabled: {
        type: Boolean, 
        default: false 
    },
    meetLink: {
        type: String,
        trim: true
    }
}, { timestamps: true })

export const Interviewer = mongoose.model('Interviewer', interviewerSchema);