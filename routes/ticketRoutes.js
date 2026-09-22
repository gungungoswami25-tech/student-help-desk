const express = require("express");

const {
    createTicket,
    getMyTickets,
    getAllTickets,
    updateTicketStatus
} = require("../controllers/ticketController");

const {
    verifyToken,
    verifyRole
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/create",
    verifyToken,
    verifyRole(["user"]),
    createTicket
);

router.get(
    "/my",
    verifyToken,
    verifyRole(["user"]),
    getMyTickets
);

router.get(
    "/all",
    verifyToken,
    verifyRole(["user", "subadmin", "superadmin"]),
    getAllTickets
);

router.patch(
    "/:id/status",
    verifyToken,
    verifyRole(["subadmin", "superadmin"]),
    updateTicketStatus
);

module.exports = router;