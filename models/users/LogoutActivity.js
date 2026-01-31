import mongoose from "mongoose";

const logoutActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,   
        ref: "User",
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ["LOGOUT"],
        default: "LOGOUT"
    },
    ip: {
        type: String,
        default: "Unknown"
    },  
    userAgent: {
        type: String,
        default: "Unknown"
    }
});

export default mongoose.model("LogoutActivity", logoutActivitySchema);