import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [4, "Name must be at least 4 characters long"],
            maxlength: [20, "Name cannot exceed 20 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        passwordHash: {
            type: String,
            required: [true, "Password is required"],
            select:false, // password hash will not be returned in queries by default 

        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        avatarUrl: { type: String, default: null },

        // ⬇️ এইগুলোও ডিফল্টে বাদ
        passwordResetToken: { type: String, default: null, select: false },
        passwordResetExpires: { type: Date, default: null, select: false },
        emailVerificationToken: { type: String, default: null, select: false },
        emailVerificationExpires: { type: Date, default: null, select: false },

    },
    { timestamps: true }
);

// pre-save hook to hash password 
userSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash")) return next();

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);

    next();
})

// method to compare password 
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.passwordHash)
}




export default mongoose.model("User", userSchema);
