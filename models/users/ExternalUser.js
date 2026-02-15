import mongoose from "mongoose";

const externalUserSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKeys",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Important: Email must be unique per project
externalUserSchema.index({ email: 1, projectId: 1 }, { unique: true });

export default mongoose.model("ExternalUser", externalUserSchema);
