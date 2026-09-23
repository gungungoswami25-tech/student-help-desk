const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "A bearer token is required" });
        }

        const token = authHeader.slice(7).trim();
        if (!token || !process.env.JWT_SECRET) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

const verifyRole = (allowedRoles) => {
    return (req, res, next) => {

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    verifyRole
};