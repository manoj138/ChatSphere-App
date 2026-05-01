const User = require("../models/userModel");
const { generateToken } = require("../lib/utils");
const bcrypt = require("bcryptjs");
const { formatMongoError, handle422 } = require("../helper/errorHandler");
const { handle201, handle200 } = require("../helper/successHandler");

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
            return handle422(res, "All field are required")
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

        handle200(res, "User logged in successfully")
    } catch (error) {
        console.log("Error in login controller: ", error)
        formatMongoError(res, error);
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        handle200(res, "User logged out successfully")
    } catch (error) {
        formatMongoError(res, error)
    }
}

module.exports = { signup, login, logout }
