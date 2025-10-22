import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        index: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
        index: true
    },
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interviewer',
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    provider: {
        type: String,
        default: 'Razorpay'
    },
    razorpayOrderId: {
        type: String,
        trim: true,
    },
    razorpayPaymentId: {
        type: String,
        trim: true,
    },
    razorpaySignature: {
        type: String,
        trim: true,
    },
    platformFee: {
        type: Number,
        default: 0
    },
    interviewerAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        index: true
    },
    transferId: {
        type: String,
        trim: true
    },
    refundId: {
        type: String,
        trim: true
    }
}, { timestamps: true })

export const Payment = mongoose.model('Payment', paymentSchema);