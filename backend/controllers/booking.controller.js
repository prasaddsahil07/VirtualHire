import mongoose from "mongoose";
import { Candidate } from "../models/candidate.model.js";
import { Slot } from "../models/slot.model.js";
import { Booking } from "../models/booking.model.js";
import { Payment } from "../models/payment.model.js";

// candidate can book an available slot by slotId param , they pay first then only their slot is booked after that only they can be able to request for reschedule the interview if necessary
/**
 * POST /api/v1/slots/:slotId/book
 * Candidate initiates booking for a slot. Creates Booking + Payment (pending) and returns Razorpay Order info.
 */
export const bookInterviewSlot = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { slotId } = req.params;
        const userId = req.user?._id; // authenticated user (User model id)

        if (!slotId) {
            return res.status(400).json({ message: 'Invalid slotId' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // fetch candidate document for this user (Booking.payment expects candidateId referencing Candidate)
        const candidate = await Candidate.findOne({ userId }).lean();
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate profile not found. Complete profile before booking.' });
        }

        // Load slot
        const slot = await Slot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.status !== 'available') {
            return res.status(400).json({ message: 'Slot is not available for booking' });
        }

        // Use a DB transaction to create Booking and Payment and reserve slot (pending payment)
        session.startTransaction();

        // Create Booking - status pending (will be confirmed after payment captured)
        const bookingDoc = await Booking.create([{
            slotId: slot._id,
            interviewerId: slot.interviewerId,
            candidateId: candidate._id,
            bookingDate: new Date(),
            scheduledStartTime: slot.startTime,
            status: 'pending', // waiting for payment
            price: slot.price,
            currency: slot.currency || 'INR'
        }], { session });

        const booking = bookingDoc[0];

        // Create Payment record (pending) - store booking reference
        const platformFee = Math.round(slot.price * 0.2 * 100) / 100;
        const interviewerAmount = Math.round((slot.price - platformFee) * 100) / 100;

        const paymentDoc = await Payment.create([{
            bookingId: booking._id,
            candidateId: candidate._id,
            interviewerId: slot.interviewerId,
            amount: slot.price,
            currency: 'INR',
            provider: 'Razorpay',
            status: 'pending',
            platformFee,
            interviewerAmount
        }], { session });

        const payment = paymentDoc[0];

        // Reserve the slot by marking status = 'pending_payment' and optionally record current booking
        slot.status = 'pending_payment';
        // save a reference to booking (optional)
        slot.currentBooking = booking._id; // if you have this field; otherwise omit
        await slot.save({ session });

        // Link payment to booking (update booking.paymentId)
        booking.paymentId = payment._id;
        await booking.save({ session });

        // Commit transaction before network call to Razorpay
        await session.commitTransaction();
        session.endSession();

        // Create Razorpay order (amount in paise)
        const amountInPaise = Math.round(slot.price * 100);
        const orderOptions = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: booking._id.toString(),
            payment_capture: 1 // auto-capture; set 0 if you want manual capture
        };

        const order = await Razorpay.orders.create(orderOptions);

        // Save razorpayOrderId into payment document
        payment.razorpayOrderId = order.id;
        await payment.save();

        // Return order details to frontend to open Razorpay Checkout
        return res.status(201).json({
            message: 'Booking initiated - complete payment to confirm slot',
            bookingId: booking._id,
            paymentId: payment._id,
            razorpay: {
                keyId: process.env.RAZORPAY_KEY_ID,
                orderId: order.id,
                amount: order.amount, // paise
                currency: order.currency
            }
        });
    } catch (error) {
        console.error('Error booking interview slot: ', error);
        // abort transaction on error if still in session
        try {
            if (session.inTransaction()) await session.abortTransaction();
        } catch (e) { console.error('Error aborting session', e); }
        return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        try { session.endSession(); } catch (e) { }
    }
};