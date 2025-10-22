import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    recoveryCode: {
        type: Number,
        trim: true,
    },
    recoveryCodeExpiry: {
        type: Date,
        trim: true
    },
    role: {
        type: String,
        enum: ['candidate', 'recruiter', 'admin'],
        required: true,
        default: 'candidate',
    },
    avatarUrl: {
        type: String,
        trim: true,
        default: 'https://avatar.iran.liara.run/public/81'
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        trim: true,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

// Hash password before savig the user model
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error("Error hashing password", error);
        next(error);
    }
})

// Method to compare password
userSchema.methods.isPasswordCorrect = async function(password){        // custom method from mongoose
    return await bcrypt.compare(password, this.password)
};


// generate access token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY
        }
    )
};

// generate refresh token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        role: this.role
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY
        }
    )
};

export const User = mongoose.model('User', userSchema);