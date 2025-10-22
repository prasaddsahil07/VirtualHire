import { Router } from "express";
import { makeRequestForVerification, 
    getAllApprovalRequests,
    getApprovalRequestsByStatus, 
    approveApprovalRequest, 
    rejectApprovalRequest 
} from "../controllers/approvalRequest.controller.js";
import { verifyJWT, verifyInterviewer, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/request-verification/:userId", verifyJWT, verifyInterviewer, makeRequestForVerification);
router.get("/get-all", verifyJWT, verifyAdmin, getAllApprovalRequests);
router.get("/get-by-status/:status", verifyJWT, verifyAdmin, getApprovalRequestsByStatus);
router.post("/approve/:requestId", verifyJWT, verifyAdmin, approveApprovalRequest);
router.post("/reject/:requestId", verifyJWT, verifyAdmin, rejectApprovalRequest);

export default router;