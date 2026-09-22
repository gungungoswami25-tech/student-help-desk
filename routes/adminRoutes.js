const express = require("express");

const {
    createSubAdmin,
    getAllSubAdmins
} = require("../controllers/adminController");

const {
    verifyToken,
    verifyRole
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/create-subadmin",
    verifyToken,
    verifyRole(["superadmin"]),
    createSubAdmin
);

router.get(
    "/subadmins",
    verifyToken,
    verifyRole(["superadmin"]),
    getAllSubAdmins
);

module.exports = router;