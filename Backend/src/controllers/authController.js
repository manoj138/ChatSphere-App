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
            console.log("Attempting to upload to Cloudinary...");
            const uploadResponse = await cloudinary.uploader.upload(profilePicture, {
                folder: "chatsphere_profiles"
            });
            console.log("Cloudinary Upload Success:", uploadResponse.secure_url);
            updateData.profilePicture = uploadResponse.secure_url;
        }

        if (bio !== undefined) updateData.bio = bio;
        if (username) updateData.username = username;

        console.log("Updating User in DB with:", updateData);
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return handle422(res, "User not found");
        }

        console.log("User updated successfully in DB");
        handle200(res, updatedUser, "Profile updated successfully");
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
}

module.exports = { signup, login, logout, checkAuth, updateProfile }
