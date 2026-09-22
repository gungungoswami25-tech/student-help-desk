const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const existingAdmin = await User.findOne({
            role: "superadmin"
        });

        if (existingAdmin) {
            console.log("Super Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "SuperAdmin@123",
            10
        );

        await User.create({
            name: "Super Admin",
            email: "superadmin@helpdesk.com",
            password: hashedPassword,
            role: "superadmin"
        });

        console.log("Super Admin created successfully");

        process.exit();

    } catch (error) {
        console.log("Error creating Super Admin");
        console.log(error.message);

        process.exit(1);
    }
};

createSuperAdmin();