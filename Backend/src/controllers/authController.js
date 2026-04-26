const genarateToken = require("../config/utils");
const sendWelcomeEmail = require("../emails/emailHandler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../lib/cloudinary");

const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            })
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            })
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            genarateToken(newUser._id, res);
            await newUser.save();

            try {
                await sendWelcomeEmail(email, fullName, process.env.CLIENT_URL)
            } catch (error) {
                console.log("Error in sendWelcomeEmail:", error);
                // We don't necessarily want to fail the whole signup if the email fails, 
                // but we should at least log it.
            }

            return res.status(201).json({
                _id: newUser._id,
                name: newUser.fullName,
                email: newUser.email,
                profilePhoto: newUser.profilePhoto,
            })

        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid user credentials"
            })
        }
    } catch (error) {
        console.log("Error in signup:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        genarateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            name: user.fullName,
            email: user.email,
            profilePhoto: user.profilePhoto,
        })
    } catch (error) {
        console.log("Error in login:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const logout = async (_, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log("Error in logout:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { profilePhoto } = req.body;
        if (!profilePhoto) {
            return res.status(400).json({
                success: false,
                message: "Profile photo is required"
            })
        }

        const userID = req.user._id

        const uploadResponse = await cloudinary.uploader.upload(profilePhoto);

        const updatedUser = await User.findByIdAndUpdate(userID, {
            profilePhoto: uploadResponse.secure_url
        }, { new: true })

        return res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in updateProfile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = { signup, login, logout, updateProfile }