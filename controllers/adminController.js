const User = require("../models/User");
const bcrypt = require("bcryptjs");

const createSubAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const subAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "subadmin"
        });

        res.status(201).json({
            message: "Sub-admin created successfully",
            user: {
                id: subAdmin._id,
                name: subAdmin.name,
                email: subAdmin.email,
                role: subAdmin.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create sub-admin",
            error: error.message
        });
    }
};

const getAllSubAdmins = async (req, res) => {
    try {
        const subAdmins = await User.find({
            role: "subadmin"
        }).select("-password");

        res.json(subAdmins);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch sub-admins",
            error: error.message
        });
    }
};
module.exports = {
    createSubAdmin,
    getAllSubAdmins
};