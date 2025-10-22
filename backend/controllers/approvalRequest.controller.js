import { ApprovalRequest } from "../models/approvalRequest.model.js";
import { Interviewer } from "../models/interviewer.model.js";
import { sendEmail } from "../utils/mailer.js";

const VALID_STATUSES = ['pending', 'approved', 'rejected'];

// make a request for approval of their profile
export const makeRequestForVerification = async (req, res) => {
    try {
        const { userId } = req.params;

        const interviewer = await Interviewer.findOne({ userId });
        if (!interviewer) {
            return res.status(404).json({ message: "Interviewer profile not found" });
        }

        const alreadyVerified = interviewer.verificationStatus === "verified";
        if (alreadyVerified) {
            return res.status(400).json({ message: "Interviewer profile is already verified" });
        }

        const existingRequest = await ApprovalRequest.findOne({ interviewerId, status: "Pending" });
        if (existingRequest) {
            return res.status(400).json({ message: "There is already a pending approval request for this profile" });
        }

        const newRequest = await ApprovalRequest.create({
            interviewerId: userId,
            requestedDate: new Date()
        })

        return res.status(201).json({ message: "Verification request submitted successfully", data: newRequest });
    } catch (error) {
        console.error("Error making request to verify profile: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * @route   GET /api/v1/admin/approval-requests?page={page}&limit={limit}
 * @desc    Get all approval requests (admin only) with pagination, sorted by requestedDate desc
 * @access  Private (admin)
 */
export const getAllApprovalRequests = async (req, res) => {
    try {
        // Pagination params
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const requestedLimit = parseInt(req.query.limit, 10) || 20;
        const limit = Math.min(100, Math.max(1, requestedLimit)); // cap between 1 and 100
        const skip = (page - 1) * limit;

        // Count total requests
        const totalRequests = await ApprovalRequest.countDocuments();

        // Fetch paginated requests, populate interviewer and the interviewer's user
        // We select only public/safe fields from interviewer and user
        const requests = await ApprovalRequest.find()
            .sort({ requestedDate: -1 }) // latest first
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'interviewerId',
                select: 'userId companies expertise experience rating linkedinProfile employeeMailId verificationStatus razorpayRecipientId payoutsEnabled',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name email avatarUrl'
                }
            })
            .lean();

        // Flatten results for frontend: merge interviewer.userId fields to top-level interviewer object
        const flattened = requests.map((reqItem) => {
            const interviewer = reqItem.interviewerId || null;
            const user = interviewer?.userId || null;

            return {
                requestId: reqItem._id,
                requestedDate: reqItem.requestedDate,
                status: reqItem.status,
                createdAt: reqItem.createdAt,
                updatedAt: reqItem.updatedAt,
                // interviewer details (flattened)
                interviewer: interviewer ? {
                    _id: interviewer._id,
                    companies: interviewer.companies || [],
                    expertise: interviewer.expertise || [],
                    experience: interviewer.experience || 0,
                    rating: interviewer.rating ?? 0,
                    linkedinProfile: interviewer.linkedinProfile || null,
                    employeeMailId: interviewer.employeeMailId || null,
                    verificationStatus: interviewer.verificationStatus || null,
                    //   razorpayRecipientId: interviewer.razorpayRecipientId || null,
                    //   payoutsEnabled: interviewer.payoutsEnabled || false,
                    // user info
                    name: user?.name || null,
                    email: user?.email || null,
                    avatarUrl: user?.avatarUrl || null
                } : null
            };
        });

        const totalPages = Math.ceil(totalRequests / limit);

        return res.status(200).json({
            message: 'Approval requests fetched successfully',
            data: flattened,
            meta: {
                totalRequests,
                page,
                limit,
                totalPages
            }
        });
    } catch (error) {
        console.error('Error getting approval requests: ', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * @route   GET /api/v1/admin/approval-requests/status/:status?page={page}&limit={limit}
 * @desc    Get approval requests filtered by status (pending|approved|rejected) with pagination
 * @access  Private (admin)
 */
export const getApprovalRequestsByStatus = async (req, res) => {
    try {
        const status = String(req.params.status || '').toLowerCase();
        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Allowed: ${VALID_STATUSES.join(', ')}` });
        }

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const requestedLimit = parseInt(req.query.limit, 10) || 20;
        const limit = Math.min(100, Math.max(1, requestedLimit));
        const skip = (page - 1) * limit;

        const filter = { status };

        const total = await ApprovalRequest.countDocuments(filter);

        const requests = await ApprovalRequest.find(filter)
            .sort({ requestedDate: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'interviewerId',
                select: 'userId companies expertise experience rating linkedinProfile employeeMailId verificationStatus razorpayRecipientId payoutsEnabled',
                populate: { path: 'userId', model: 'User', select: 'name email avatarUrl' }
            })
            .lean();

        // Flatten interviewer + user info
        const data = requests.map((r) => {
            const interviewer = r.interviewerId || null;
            const user = interviewer?.userId || null;
            return {
                requestId: r._id,
                requestedDate: r.requestedDate,
                status: r.status,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                interviewer: interviewer ? {
                    _id: interviewer._id,
                    companies: interviewer.companies || [],
                    expertise: interviewer.expertise || [],
                    experience: interviewer.experience || 0,
                    rating: interviewer.rating ?? 0,
                    linkedinProfile: interviewer.linkedinProfile || null,
                    employeeMailId: interviewer.employeeMailId || null,
                    verificationStatus: interviewer.verificationStatus || null,
                    razorpayRecipientId: interviewer.razorpayRecipientId || null,
                    payoutsEnabled: interviewer.payoutsEnabled || false,
                    name: user?.name || null,
                    email: user?.email || null,
                    avatarUrl: user?.avatarUrl || null
                } : null
            };
        });

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            message: `Approval requests with status=${status} fetched successfully`,
            data,
            meta: { total, page, limit, totalPages }
        });
    } catch (err) {
        console.error('Error in getApprovalRequestsByStatus:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * @route   POST /api/v1/admin/approval-requests/:requestId/approve
 * @desc    Approve an approval request (admin only)
 * @access  Private (admin)
 */
export const approveApprovalRequest = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { requestId } = req.params;
        if (!requestId) {
            return res.status(400).json({ message: 'Invalid requestId' });
        }

        session.startTransaction();
        // Load the approval request with interviewer reference, for update
        const apr = await ApprovalRequest.findById(requestId).session(session);
        if (!apr) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Approval request not found' });
        }

        if (apr.status === 'approved') {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Request already approved' });
        }
        if (apr.status === 'rejected') {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Request already rejected' });
        }

        // Update approval request status
        apr.status = 'approved';
        await apr.save({ session });

        // Update interviewer verification status
        const interviewer = await Interviewer.findById(apr.interviewerId).session(session);
        if (!interviewer) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Interviewer not found' });
        }

        interviewer.verificationStatus = 'verified';
        // Optionally enable payouts when approved (uncomment if desired)
        // interviewer.payoutsEnabled = true;
        await interviewer.save({ session });

        await session.commitTransaction();
        session.endSession();

        // populate user info (outside transaction) for notification
        const interviewerPop = await Interviewer.findById(interviewer._id)
            .populate({ path: 'userId', select: 'name email avatarUrl' })
            .lean();

        // Send notification email to interviewer (non-blocking)
        try {
            const userEmail = interviewerPop.userId?.email;
            if (userEmail) {
                await sendEmail({
                    to: userEmail,
                    subject: 'Your interviewer profile has been verified',
                    text: `Hello ${interviewerPop.userId?.name || ''},\n\nYour interviewer verification request has been approved by admin. Your profile is now verified and visible to candidates.\n\nRegards,\nTeam.\n\nDo not reply to this automated email.`
            });
            }
        } catch (emailErr) {
            console.error('Failed to send approval email:', emailErr);
            // do not fail the request if email fails
        }

        return res.status(200).json({
            message: 'Approval request approved',
            data: {
                requestId: apr._id,
                status: apr.status
            }
        });
    } catch (err) {
        console.error('Error approving request:', err);
        try { if (session.inTransaction()) await session.abortTransaction(); } catch (_) { }
        return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        try { session.endSession(); } catch (_) { }
    }
};

/**
 * @route   POST /api/v1/admin/approval-requests/:requestId/reject
 * @desc    Reject an approval request (admin only) with optional reason
 * @access  Private (admin)
 */
export const rejectApprovalRequest = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { requestId } = req.params;

        if (!requestId) {
            return res.status(400).json({ message: 'Invalid requestId' });
        }

        session.startTransaction();
        const apr = await ApprovalRequest.findById(requestId).session(session);
        if (!apr) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Approval request not found' });
        }

        if (apr.status === 'approved') {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Request already approved' });
        }
        if (apr.status === 'rejected') {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Request already rejected' });
        }

        // Set request to rejected and optionally save reason (extend schema to store `reason` if desired)
        apr.status = 'rejected';
        await apr.save({ session });

        // Update interviewer verification status
        const interviewer = await Interviewer.findById(apr.interviewerId).session(session);
        if (!interviewer) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Interviewer not found' });
        }
        interviewer.verificationStatus = 'rejected';
        await interviewer.save({ session });

        await session.commitTransaction();
        session.endSession();

        // populate interviewer and user info for notification
        const interviewerPop = await Interviewer.findById(interviewer._id)
            .populate({ path: 'userId', select: 'name email' })
            .lean();

        // Send notification email to interviewer with rejection reason
        try {
            const userEmail = interviewerPop.userId?.email;
            if (userEmail) {
                await sendEmail({
                    to: userEmail,
                    subject: 'Your interviewer verification request was rejected',
                    text: `Hello ${interviewerPop.userId?.name || ''},\n\nYour verification request has been rejected. If you believe this was a mistake, please contact support.\n\nRegards,\nTeam\n\nDo not reply to this automated email.`
                });
            }
        } catch (emailErr) {
            console.error('Failed to send rejection email:', emailErr);
        }

        return res.status(200).json({
            message: 'Approval request rejected',
            data: {
                requestId: apr._id,
                status: apr.status
            }
        });
    } catch (err) {
        console.error('Error rejecting request:', err);
        try { if (session.inTransaction()) await session.abortTransaction(); } catch (_) { }
        return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        try { session.endSession(); } catch (_) { }
    }
};