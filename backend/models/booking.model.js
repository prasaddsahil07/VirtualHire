import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true,
        index: true
    },
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interviewer',
        required: true,
        index: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
        index: true
    },
    bookingDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    scheduledStartTime: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending','confirmed','cancelled','rescheduled','completed','no_show'],
        default: 'scheduled',
        index: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }
}, { timestamps: true })

export const Booking = mongoose.model('Booking', bookingSchema);