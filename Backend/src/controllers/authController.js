const User = require("../models/userModel");

const {generateToken} = require("../lib/utils");
const { formatMongoError, handle422 } = require("../helper/errorHandler");
const { handle201 } = require("../helper/successHandler");

const signup = async(req,res)=>{
    const {username, email, password} = req.body;
    try {
        if(!username ||!email || !password){
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