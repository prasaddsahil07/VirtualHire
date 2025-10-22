import { Router } from 'express';
import {
    completeCandidateProfile,
    updateCandidateProfile,
    getAllCandidates,
    getCandidateDetailById,
    getMatchingInterviewers
} from "../controllers/candidate.controller.js";
import { verifyJWT, verifyCandidate, verifyAdmin, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/complete-profile", verifyJWT, verifyCandidate, completeCandidateProfile);
router.put("/update-profile", verifyJWT, verifyCandidate, updateCandidateProfile);
router.get("/get-all", verifyJWT, verifyAdmin, getAllCandidates);
router.get(
    "/get-detail/:userId",
    verifyJWT,
    requireRole(['candidate', 'admin']),
    getCandidateDetailById
);
router.get("/get-matching-interviewers", verifyJWT, verifyCandidate, getMatchingInterviewers);

export default router;