import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            console.log("No Token Provided");
            return res.status(401).json({message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select('-password');

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "User not found, authorization denied" });
        }

        req.user = user; // attach user to request object
        next();
    } catch (error) {
        console.error("Error in verifyJWT middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const verifyJWTPassword = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            console.log("No Token Provided");
            return res.status(401).json({message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-refreshToken");

        if (!user) {
            console.log("User not found in auth middleware")
            return res.status(401).json({ message: "User not found, authorization denied" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const verifyInterviewer = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role === 'interviewer') {
            return next();
        }
        return res.status(403).json({ message: "Forbidden: Access is allowed only for interviewers" });
    } catch (error) {
        console.error("Internal server error while verifying interviewer");
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyCandidate = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role === 'candidate') {
            return next();
        }
        return res.status(403).json({ message: "Forbidden: Access is allowed only for candidates" });
    } catch (error) {
        console.error("Internal server error while verifying candidate");
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const verifyAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role === 'admin') {
            return next();
        }
        return res.status(403).json({ message: "Forbidden: Access is allowed only for admin" });
    } catch (error) {
        console.error("Internal server error while verifying admin");
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowed.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
