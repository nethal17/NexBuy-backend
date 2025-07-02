import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized - No access token provided" });
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid access token", error: error.message });
    }
};

export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    else {
        return res.status(403).json({ message: "Access denied - Admin Only" });
    }
    
};