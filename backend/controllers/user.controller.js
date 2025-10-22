import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';

// function to generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        //finding user from database by _id
        const user = await User.findById(userId);

        //generating Token
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        //saving refreshToken into the database(access token is not added to database)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });  //automatically mongoose model(password) kick in so we pass validateBeforeSave to avoid this

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Error generating tokens:", error);
        return null;
    }
}

// user sign up controller
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, gender } = req.body;

        if (!name || !email || !password || !role || !gender) {
            console.log("Mising required fields while rigistering the user");
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists with this email id");
            return res.status(409).json({ message: "User already exists with this email" });
        }

        const avatarUrl = (gender === 'male') ? "https://avatar.iran.liara.run/public/41" : (gender === 'female') ? "https://avatar.iran.liara.run/public/54" : "https://avatar.iran.liara.run/public/46";

        const newUser = await User.create({
            name,
            email,
            password,
            role,
            gender,
            avatarUrl
        });

        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({ message: "Internal Server Error while creating new user" });
        }

        res.status(201).json({ message: "User registered successfully", data: createdUser });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// user login controller
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Mising required fields while rigistering the user");
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.isPasswordCorrect(password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-refreshToken -password");

        if (!loggedInUser) {
            return res.status(500).json({ message: "Internal Server Error: no logged in user found" });
        }

        const isProd = process.env.NODE_ENV === "production";
        const options = {
            httpOnly: true,
            secure: isProd,                 // true only in prod
            sameSite: isProd ? "none" : "lax", // lax for localhost, none for cross-site
        };

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                message: "User logged in successfully",
                data: loggedInUser,
            });
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// logout user
export const logoutUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }
        user.refreshToken = "";     // unset refresh token in database
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        }

        res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error in user logout:", error);
        res.status(500).json({ message: "Internal Server Error while logging out user" });
    }
}

// function to handle access token refresh
export const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied" });
        }

        if (user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({ message: "Invalid refresh token, authorization denied" });
        }

        // generate new access token
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        }

        res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({ message: "Access token refreshed successfully" });

    } catch (error) {
        console.log("Error while refreshing the Access Token: ", error);
        res.status(500).json({ message: "Internal Server Error while refreshing access token" });
    }
}

// update user details
export const updateUserDetails = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { name=req.user?.name, gender=req.user?.gender } = req.body;

        //  get the user
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found for updating details");
            return res.status(404).json({ message: "User not found for updating details" });
        }
        
        const avatarUrl = (gender === 'male') ? "https://avatar.iran.liara.run/public/41" : (gender === 'female') ? "https://avatar.iran.liara.run/public/54" : "https://avatar.iran.liara.run/public/46";

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: { name, gender, avatarUrl }
            },
            { new: true }
        ).select("-refreshToken -password");

        if (!updatedUser) {
            return res.status(500).json({ message: "Internal Server Error while updating user details" });
        }

        res.status(200).json({ message: "User details updated successfully", data: updatedUser });
    } catch (error) {
        console.log("Error in updating user details:", error);
        res.status(500).json({ message: "Internal Server Error while updating user details" });
    }
}

// change password
export const changeCurrentUserPassword = async (req, res) => {
    try {
        const user = req.user
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ msg: "All fields are required" })
        }

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)     // this method is written in user model

        if (!isPasswordCorrect) {
            return res.status(400).json({ msg: "Invalid old Password" })
        }

        user.password = newPassword     // it's already encrypted in pre-save hook
        await user.save({ validateBeforeSave: false })

        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (error) {
        console.error("Password change error:", error.message);
        return res.status(500).json({ msg: "Internal server error" });
    }
}