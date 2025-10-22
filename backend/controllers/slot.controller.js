import { Slot } from "../models/slot.model.js";

/**
 * GET /api/slots/available/:interviewerId?page={pageNumber}
 * Fetch paginated available slots for a specific interviewer (sorted by date & price)
 * Public (or Protected if candidate login required)
 */
export const getAvailableSlotsByInterviewer = async (req, res) => {
    try {
        const { interviewerId } = req.params;
        const page = parseInt(req.query.page) || 1; // current page number
        const limit = 10; // fixed number of slots per page
        const skip = (page - 1) * limit;

        if (!interviewerId) {
            return res.status(400).json({ message: "Invalid interviewerId" });
        }

        const now = new Date();

        const totalSlots = await Slot.countDocuments({
            interviewerId,
            status: "available",
            scheduledDate: { $gte: now },
        });

        // Fetch paginated slots
        const availableSlots = await Slot.find({
            interviewerId,
            status: "available",
            scheduledDate: { $gte: now },
        })
            .sort({ scheduledDate: 1, price: 1 })
            .skip(skip)
            .limit(limit)
            .select("scheduledDate startTime endTime price status")
            .lean();

        // Handle no slots case
        if (!availableSlots.length) {
            return res.status(404).json({ message: "No available slots found for this interviewer" });
        }

        // Prepare pagination metadata
        const totalPages = Math.ceil(totalSlots / limit);

        // Send response
        return res.status(200).json({
            message: "Available slots fetched successfully",
            currentPage: page,
            totalPages,
            totalSlots,
            data: availableSlots,
        });
    } catch (error) {
        console.error("Error fetching available slots by interviewer:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};