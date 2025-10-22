import mongoose from "mongoose";

const approvalRequestSchema = new mongoose.Schema({
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interviewer',
        required: true,
        index: true
    },
    requestedDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        index: true
    }
}, { timestamps: true });

export const ApprovalRequest = mongoose.model('ApprovalRequest', approvalRequestSchema);