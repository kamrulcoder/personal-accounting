
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const protectRoute = (options = {}) => {
    // options = { allowedRoles: ["admin", "user"], requireVerified: true/false }
    return async (req, res, next) => {
        const token = req.cookies?.jwt;
        if (!token) return res.status(401).json({ message: "You cannot access this function " });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) return res.status(401).json({ message: "User not found" });

            // isVerified check
            if (options.requireVerified && !user.isVerified) {
                return res.status(403).json({ message: "Account not verified" });
            }
           
            // Role check (allowedRoles is array)
            if (options.allowedRoles && !options.allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: "You don't have permission" });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};


export default protectRoute;
