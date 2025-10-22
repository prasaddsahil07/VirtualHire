import { Candidate } from "../models/candidate.model.js";
import { Interviewer } from "../models/interviewer.model.js";
import { User } from "../models/user.model.js";

// complete candidate profile which is mandatory, if their profile is not complete they can't book any interview
export const completeCandidateProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { resumeUrl, skills, experience } = req.body;

        // Validate resumeUrl
        if (!resumeUrl || typeof resumeUrl !== "string" || !resumeUrl.trim()) {
            return res.status(400).json({ message: "Valid resume URL is required" });
        }

        // Validate skills array
        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: "Skills must be a non-empty array" });
        }

        // Clean and deduplicate skills
        const cleanedSkills = [...new Set(
            skills
                .map(s => (typeof s === "string" ? s.trim() : ""))
                .filter(s => s.length > 0)
        )];

        if (cleanedSkills.length === 0) {
            return res.status(400).json({ message: "Skills must contain valid string values" });
        }

        const existingCandidate = await Candidate.findOne({ userId });
        if (existingCandidate) {
            return res.status(400).json({ message: "Candidate profile already exists for this user" });
        }

        const newCandidate = await Candidate.create({
            userId,
            resumeUrl,
            skills: cleanedSkills,
            experience: experience || 0
        });

        return res.status(201).json({ message: "Candidate profile completed successfully", data: newCandidate });
    } catch (error) {
        console.error("Error completing candidate profile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Update candidate profile (resumeUrl, skills, experience)
 *
 * Request body behaviour:
 * - To replace the entire skills array: send { skills: ["js","react"] }
 * - To add skills without duplicates: send { addSkills: ["node","graphql"] }
 * - To remove skills: send { removeSkills: ["php"] }
 * - To update resume URL: send { resumeUrl: "https://..." }
 * - To update experience: send { experience: 3 } (number)
 *
 * These can be combined in one request.
 */
export const updateCandidateProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const {
            resumeUrl,
            skills,        // replace entire array
            addSkills,     // array to add (no duplicates)
            removeSkills,  // array to remove
            experience
        } = req.body;

        // Basic validation
        if (
            resumeUrl === undefined &&
            skills === undefined &&
            addSkills === undefined &&
            removeSkills === undefined &&
            experience === undefined
        ) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        // Ensure candidate exists
        let candidate = await Candidate.findOne({ userId });
        if (!candidate) return res.status(404).json({ message: "Candidate profile not found" });

        // Build update object & operators
        const updateOps = {};
        const arrayOps = {}; // will contain $addToSet, $pull or $set for skills

        if (resumeUrl !== undefined) {
            if (typeof resumeUrl !== "string" || resumeUrl.trim() === "") {
                return res.status(400).json({ message: "Invalid resumeUrl" });
            }
            updateOps.resumeUrl = resumeUrl.trim();
        }

        if (experience !== undefined) {
            const expNum = Number(experience);
            if (Number.isNaN(expNum) || expNum < 0) {
                return res.status(400).json({ message: "Invalid experience value" });
            }
            updateOps.experience = expNum;
        }

        // Replace entire skills array
        if (Array.isArray(skills)) {
            // sanitize strings
            const cleaned = skills
                .map((s) => (typeof s === "string" ? s.trim() : ""))
                .filter((s) => s.length > 0);
            arrayOps.$set = { skills: [...new Set(cleaned)] }; // unique
        } else {
            // addSkills
            if (Array.isArray(addSkills) && addSkills.length > 0) {
                const cleaned = addSkills
                    .map((s) => (typeof s === "string" ? s.trim() : ""))
                    .filter((s) => s.length > 0);
                arrayOps.$addToSet = { skills: { $each: cleaned } };
            }
            // removeSkills
            if (Array.isArray(removeSkills) && removeSkills.length > 0) {
                const cleaned = removeSkills
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

        const updated = await Candidate.findOneAndUpdate(
            { userId },
            updateQuery,
            { new: true, runValidators: true, context: "query" }
        );

        return res.status(200).json({ message: "Candidate profile updated", data: updated });
    } catch (err) {
        console.error("Error updating candidate profile:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * Get candidate details for current user or for :userId param (admin or public).
 * If :userId param is provided, returns that user's candidate profile.
 */
export const getCandidateDetailById = async (req, res) => {
    try {
        const { userId } = req.params;

        const candidate = await Candidate.findOne({ userId });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate profile not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User profile not found" });
        }

        let candidateInfo = {};
        candidateInfo.userId = userId;
        candidateInfo.resumeUrl = candidate.resumeUrl;
        candidateInfo.skills = candidate.skills;
        candidateInfo.experience = candidate.experience;
        candidateInfo.name = user.name;
        candidateInfo.email = user.email;
        candidateInfo.avatarUrl = user.avatarUrl;

        return res.status(200).json({ message: "Candidate details fetched successfully", data: candidateInfo });
    } catch (err) {
        console.error("Error fetching candidate details:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// get all candidates using pagination
export const getAllCandidates = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const totalCandidates = await Candidate.countDocuments();

        const candidates = await Candidate.find()
            .populate('userId', 'name email avatarUrl role') // fetch user details
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // flatten the result
        const flattenedCandidates = candidates.map(c => ({
            _id: c._id,
            resumeUrl: c.resumeUrl,
            skills: c.skills,
            experience: c.experience,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            name: c.userId?.name || null,
            email: c.userId?.email || null,
            avatarUrl: c.userId?.avatarUrl || null,
            role: c.userId?.role || null,
        }));

        const totalPages = Math.ceil(totalCandidates / limit);

        return res.status(200).json({
            message: "Candidates fetched successfully",
            data: flattenedCandidates,
            meta: { totalCandidates, page, limit, totalPages }
        });
    } catch (error) {
        console.error("Error fetching all candidates: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

/**
 * GET /api/v1/interviewers/matching?page=1&limit=20
 * Returns interviewers matching candidate skills or experience, paginated,
 * sorted by rating descending.
 */
export const getMatchingInterviewers = async (req, res) => {
    try {
        const candidateUserId = req.user?._id;
        if (!candidateUserId) return res.status(401).json({ message: 'Unauthorized' });

        // fetch candidate profile
        const candidate = await Candidate.findOne({ userId: candidateUserId }).lean();
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate profile not found' });
        }

        // pagination params
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20)); // cap to 100
        const skip = (page - 1) * limit;

        // build query:
        // - if candidate has skills array and non-empty -> match expertise OR experience
        // - if no skills -> match only by experience
        const candidateSkills = Array.isArray(candidate.skills) ? candidate.skills.map(s => String(s).trim()).filter(Boolean) : [];
        const baseExperience = Number(candidate.experience) || 0;

        const orClauses = [];
        if (candidateSkills.length > 0) {
            orClauses.push({ expertise: { $in: candidateSkills } });
        }
        // Always include experience-based matching as fallback
        orClauses.push({ experience: { $gte: baseExperience } });

        const query = { $or: orClauses };

        // count total matches
        const total = await Interviewer.countDocuments(query);

        // find paginated interviewers, sort by rating desc
        // project only necessary fields (adjust projection to your schema)
        const interviewers = await Interviewer.find(query)
            .sort({ rating: -1, experience: -1 }) // secondary sort by experience
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            message: 'Matching interviewers fetched successfully',
            data: interviewers,
            meta: {
                total,
                page,
                limit,
                totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching matching interviewers:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};