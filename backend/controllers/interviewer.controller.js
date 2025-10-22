import { Interviewer } from "../models/interviewer.model.js";
import { User } from "../models/user.model.js";
import { ApprovalRequest } from "../models/approvalRequest.model.js";

// complete the interviewer profile
export const completeInterviewerProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { bio, expertise, experience, companies, linkedinProfile, employeeMailId, meetLink } = req.body;

        // Validate resumeUrl
        if (!experience || !linkedinProfile || !employeeMailId || !meetLink) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        // Validate expertise array
        if (!Array.isArray(expertise) || expertise.length === 0) {
            return res.status(400).json({ message: "Expertise must be a non-empty array" });
        }
        // Validate companies array
        if (!Array.isArray(companies) || companies.length === 0) {
            return res.status(400).json({ message: "Companies must be a non-empty array" });
        }

        // Clean and deduplicate expertise
        const cleanedExpertise = [...new Set(
            expertise
                .map(s => (typeof s === "string" ? s.trim() : ""))
                .filter(s => s.length > 0)
        )];

        if (cleanedExpertise.length === 0) {
            return res.status(400).json({ message: "Expertise must contain atleast one valid string values" });
        }

        // Clean and deduplicate companies
        const cleanedCompanies = [...new Set(
            companies
                .map(s => (typeof s === "string" ? s.trim() : ""))
                .filter(s => s.length > 0)
        )];

        if (cleanedCompanies.length === 0) {
            return res.status(400).json({ message: "Companies must contain atleast one valid string values" });
        }

        const existingInterviewer = await Interviewer.findOne({ userId });
        if (existingInterviewer) {
            return res.status(400).json({ message: "Interviewer profile already exists for this user" });
        }

        const newInterviewer = await Interviewer.create({
            userId,
            bio: bio || "",
            companies: cleanedCompanies,
            expertise: cleanedExpertise,
            experience: experience || 0,
            linkedinProfile,
            employeeMailId,
            meetLink
        });

        return res.status(201).json({ message: "Interviewer profile completed successfully", data: newInterviewer });
    } catch (error) {
        console.error("Error completing interviewer profile: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * Update interviewer profile (bio, employeeMailId, meetLink, expertise, companies, experience)
 *
 * Request body behaviour:
 * - To replace the entire expertise or companies array: send { expertise: ["js","react"] }
 * - To add expertise or companiese without duplicates: send { addCompanies: ["node","graphql"] }
 * - To remove expertise or companies: send { removeExpertise: ["php"] }
 * - To update experience: send { experience: 3 } (number)
 *
 * These can be combined in one request.
 */
export const updateInterviewerProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const {
            bio,
            employeeMailId,
            meetLink,
            expertise,        // replace entire array
            addExpertise,     // array to add (no duplicates)
            removeExpertise,  // array to remove
            companies,        // replace entire array
            addCompanies,     // array to add (no duplicates)
            removeCompanies,  // array to remove
            experience
        } = req.body;

        // Ensure interviewer exists
        let interviewer = await Interviewer.findOne({ userId });
        if (!interviewer) return res.status(404).json({ message: "Interviewer profile not found" });

        // Build update object & operators
        const updateOps = {};
        const arrayOps = {}; // will contain $addToSet, $pull or $set for skills

        if (experience !== undefined) {
            const expNum = Number(experience);
            if (Number.isNaN(expNum) || expNum < 0) {
                return res.status(400).json({ message: "Invalid experience value" });
            }
            updateOps.experience = expNum;
        }

        // Replace entire expertise array
        if (Array.isArray(expertise)) {
            // sanitize strings
            const cleaned = expertise
                .map((s) => (typeof s === "string" ? s.trim() : ""))
                .filter((s) => s.length > 0);
            arrayOps.$set = { expertise: [...new Set(cleaned)] }; // unique
        } else {
            // addExpertise
            if (Array.isArray(addExpertise) && addExpertise.length > 0) {
                const cleaned = addExpertise
                    .map((s) => (typeof s === "string" ? s.trim() : ""))
                    .filter((s) => s.length > 0);
                arrayOps.$addToSet = { skills: { $each: cleaned } };
            }
            // removeExpertise
            if (Array.isArray(removeExpertise) && removeExpertise.length > 0) {
                const cleaned = removeExpertise
                    .map((s) => (typeof s === "string" ? s.trim() : ""))
                    .filter((s) => s.length > 0);
                arrayOps.$pull = { skills: { $in: cleaned } };
            }
        }

        // Replace entire companies array
        if (Array.isArray(companies)) {
            // sanitize strings
            const cleaned = companies
                .map((s) => (typeof s === "string" ? s.trim() : ""))
                .filter((s) => s.length > 0);
            arrayOps.$set = { companies: [...new Set(cleaned)] }; // unique
        } else {
            // addCompanies
            if (Array.isArray(addCompanies) && addCompanies.length > 0) {
                const cleaned = addCompanies
                    .map((s) => (typeof s === "string" ? s.trim() : ""))
                    .filter((s) => s.length > 0);
                arrayOps.$addToSet = { skills: { $each: cleaned } };
            }
            // removeExpertise
            if (Array.isArray(removeCompanies) && removeCompanies.length > 0) {
                const cleaned = removeCompanies
                    .map((s) => (typeof s === "string" ? s.trim() : ""))
                    .filter((s) => s.length > 0);
                arrayOps.$pull = { skills: { $in: cleaned } };
            }
        }

        // Here we update single document, so findOneAndUpdate is fine.
        const updateQuery = {
            ...(Object.keys(updateOps).length ? { $set: updateOps } : {}),
            ...arrayOps
        };

        // If updateQuery is empty (shouldn't be), abort
        if (Object.keys(updateQuery).length === 0) {
            return res.status(400).json({ message: "No valid updates provided" });
        }

        const updated = await Interviewer.findOneAndUpdate(
            { userId },
            updateQuery,
            { new: true, runValidators: true, context: "query" }
        );

        return res.status(200).json({ message: "Interviewer profile updated successfully", data: updated });
    } catch (err) {
        console.error("Error updating interviewer profile:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// get all interviewer profiles
export const getAllInterviewers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const totalInterviewers = await Interviewer.countDocuments();

        const interviewers = await Interviewer.find()
            .populate('userId', 'name email avatarUrl role') // fetch user details
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // flatten the result
        const flattenedInterviewers = interviewers.map(c => ({
            _id: c._id,
            bio: c.bio || "",
            expertise: c.expertise,
            companies: c.companies,
            experience: c.experience,
            rating: c.rating,
            totalBalance: c.totalBalance,
            verificationStatus: c.verificationStatus,
            linkedinProfile: c.linkedinProfile,
            employeeMailId: c.employeeMailId,
            meetLink: c.meetLink,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            name: c.userId?.name || null,
            email: c.userId?.email || null,
            avatarUrl: c.userId?.avatarUrl || null,
            role: c.userId?.role || null,
        }));

        const totalPages = Math.ceil(totalInterviewers / limit);

        return res.status(200).json({
            message: "Interviewers fetched successfully",
            data: flattenedInterviewers,
            meta: { totalInterviewers, page, limit, totalPages }
        });
    } catch (error) {
        console.error("Error getting all interviewers profile: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// get interviewer details by userId param
export const getInterviewerById = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'Invalid interviewerId' });
        }

        // get interviewer by id
        const interviewer = await Interviewer.findOne({ userId });
        if (!interviewer) {
            return res.status(400).json({ message: 'Interviewer not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User profile not found" });
        }


        let interviewerInfo = {};

        interviewerInfo.userId = userId;
        interviewerInfo.name = user.name;
        interviewerInfo.email = user.email;
        interviewerInfo.avatarUrl = user.avatarUrl;
        interviewerInfo.role = user.role,
        interviewerInfo.bio = interviewer.bio;
        interviewerInfo.expertise = interviewer.expertise;
        interviewerInfo.companies = interviewer.companies;
        interviewerInfo.experience = interviewer.experience;
        interviewerInfo.rating = interviewer.rating;
        interviewerInfo.totalBalance = interviewer.totalBalance;
        interviewerInfo.verificationStatus = interviewer.verificationStatus;
        interviewerInfo.linkedinProfile = interviewer.linkedinProfile;
        interviewerInfo.employeeMailId = interviewer.employeeMailId;
        interviewerInfo.meetLink = interviewer.meetLink;

        return res.status(200).json({ message: 'Interviewer fetched successfully', data: interviewerInfo });
    } catch (error) {
        console.error("Error fetching interviewer by id: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}