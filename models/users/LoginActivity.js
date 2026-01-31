import mongoose from "mongoose";

const loginActivitySchema = new mongoose.Schema({
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
        enum: ["SUCCESS", "FAILED"],
        default: "SUCCESS"
    },
    conuntry: {
        type: String,
        default: "Unknown" 
    },
    city: {
        type: String,
        default: "Unknown" 
    }
});

export default mongoose.model("LoginActivity", loginActivitySchema);
