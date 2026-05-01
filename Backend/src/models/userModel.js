const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "please use a valid email"]
    },
    password: {
        type: String,
        required: true,
        minLength:[6, "password must be at least 6 characters long"]
    },
    profilePicture: {
        type: String,
        default:""
    }
}, {timestamps:true});

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;