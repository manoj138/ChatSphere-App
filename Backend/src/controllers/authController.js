const User = require("../models/userModel");
const { generateToken } = require("../lib/utils");
const bcrypt = require("bcryptjs");
const { formatMongoError, handle422, handle500 } = require("../helper/errorHandler");
const { handle201, handle200 } = require("../helper/successHandler");
const cloudinary = require("../lib/cloudinary");

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return handle422(res, "All fields are required");
        }
        const newUser = await User.create({
            username,
            email,
            password
        });

        generateToken(newUser._id, res);

        handle201(res, newUser, "User created successfully");
    } catch (error) {
        formatMongoError(res, error);
    }
}


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return handle422(res, "All fields are required")
        }

        const user = await User.findOne({ email });

        if (!user) {
            return handle422(res, { email: "invalid credentials" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return handle422(res, { password: "invalid credentials" })
        }

        generateToken(user._id, res);

        handle200(res, user, "User logged in successfully")
    } catch (error) {
        console.log("Error in login controller: ", error)
        formatMongoError(res, error);
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        handle200(res, null, "User logged out successfully")
    } catch (error) {
        formatMongoError(res, error)
    }
}


const checkAuth = async (req, res) => {
    try {
        handle200(res, req.user)
    } catch (error) {
        console.log("Error in checkAuth controller: ", error);
        formatMongoError(res, error);
    }
}

const updateProfile = async (req, res) => {
    try {
        const { profilePicture, bio, username } = req.body;
        const userId = req.user._id;

        const updateData = {};
        
        if (profilePicture) {
            console.log("Profile Picture data received:", profilePicture.substring(0, 50) + "...");
            
            const isBase64 = profilePicture.startsWith("data:image");
            
            if (isBase64) {
                console.log("Base64 image detected. Starting Cloudinary upload...");
                try {
                    const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
                        folder: "chatsphere_profiles",
                        resource_type: "auto"
                    });
                    updateData.profilePicture = uploadResponse.secure_url;
                    console.log("Cloudinary upload successful:", updateData.profilePicture);
                } catch (cloudErr) {
                    console.error("Cloudinary ERROR:", cloudErr.message);
                    return res.status(403).json({ 
                        success: false, 
                        message: "Cloudinary Authorization Failed (403). Please check your API credentials.",
                        error: cloudErr.message 
                    });
                }
            } else {
                console.log("Direct avatar path detected. Saving path:", profilePicture);
                updateData.profilePicture = profilePicture; 
            }
        }

        if (bio !== undefined) updateData.bio = bio;
        if (username) updateData.username = username;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password");

        handle200(res, updatedUser, "Profile updated successfully");
    } catch (error) {
        console.error("General Error in updateProfile:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { signup, login, logout, checkAuth, updateProfile }
