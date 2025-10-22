import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    changeCurrentUserPassword, 
    refreshAccessToken, 
    updateUserDetails 
} from "../controllers/user.controller.js";
import { verifyJWT, verifyJWTPassword } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.put("/change-password", verifyJWTPassword, changeCurrentUserPassword);
router.put("/update", verifyJWT, updateUserDetails);

export default router;