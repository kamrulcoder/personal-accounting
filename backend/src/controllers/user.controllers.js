
import User from '../models/User.model.js';
import sharp from "sharp"
import fs from "fs"
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const changePasswordController = async (req, res) => {

    try {
        const userId = req.user._id; // Assuming user ID is stored in req.user after authentication
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match" });
        }
        const user = await User.findById(userId).select("+passwordHash");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        user.passwordHash = newPassword;
        await user.save();
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

//  authself function to get the authenticated user's data 
export const authSelfController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-__v");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

export const updateUserNameController = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming user ID is stored in req.user after authentication
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: "Name is required" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, { username }, { new: true }).select("-__v");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User Name  updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const changeUserRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // find the user 
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ message: "User not found " })
        }
        user.role = role;
        user.save()
        return res.status(201).json({ message: "User role updated successfully", user })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const singleUserController = async (req, res) => {
    try {
        const { id } = req.params;
        // find the user 
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found " })
        }
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
        return res.status(200).json(users)

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const changeProfileController = async (req, res) => {
    try {
        const uploadFile = req.file;
        if (!uploadFile) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Get old user to delete old avatar
        const user = await User.findById(req.user._id);
        const oldAvatarPath = user.avatarUrl
            ? path.join(__dirname, "../../", user.avatarUrl.replace(/^\/+/, ""))
            : null;

        const fileURLToPath = `/uploads/${uploadFile.filename}`

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { avatarUrl: fileURLToPath },  // new avatar path
            { new: true }                  // return the updated document
        );

        // Delete old avatar
        if (oldAvatarPath && fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
        }

        res.status(201).json({ message: "Profile image uploaded successfully", updatedUser })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error ", error: error.message })
    }

};
