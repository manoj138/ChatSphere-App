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
    },
    lastSeen:{
        type:Date,
        default:Date.now
    }
}, {timestamps:true});

userSchema.pre("save", async function(){
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;