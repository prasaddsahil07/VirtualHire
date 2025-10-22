import { Router } from 'express';
import {
    completeInterviewerProfile,
    updateInterviewerProfile,
    getAllInterviewers,
    getInterviewerById
} from "../controllers/interviewer.controller.js";
import { verifyJWT, verifyInterviewer, verifyAdmin, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/complete-profile", verifyJWT, verifyInterviewer, completeInterviewerProfile);
router.put("/update-profile", verifyJWT, verifyInterviewer, updateInterviewerProfile);
router.get("/get-all", verifyJWT, verifyAdmin, getAllInterviewers);
router.get("/get-detail/:userId",
    verifyJWT,
    requireRole(['interviewer', 'admin']),
    getInterviewerById
);

export default router;