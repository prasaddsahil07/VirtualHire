import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    interviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interviewer',
        required: true,
        index: true
    },
    scheduledDate: {
        type: Date,
        required: true,
        index: true
    },
    startTime: {
        type: String,
        required: true,
        trim: true
    },
    duration: {
        type: Number,       // in minutes
        required: true,
        default: 45
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'completed', 'cancelled', 'pending_payment'],
        default: 'available',
        index: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    feedback: {                 // only for candidate by interviewer
        type: String,
        trim: true,
        maxlength: 500
    },
    rating: {                   // only for interviewer by candidate
        type: Number,
        min: 1,
        max: 5,
        default: 3,
        index: true
    },
    meetLink: {
        type: String,
        trim: true
    }
}, { timestamps: true })

export const Slot = mongoose.model('Slot', slotSchema);