const Ticket = require("../models/Ticket");

const createTicket = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const ticket = await Ticket.create({
            title,
            description,
            category,
            student: req.user.id
        });

        res.status(201).json({
            message: "Request created successfully",
            ticket
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create request",
            error: error.message
        });
    }
};

const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({
            student: req.user.id
        })
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        res.json(tickets);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch requests",
            error: error.message
        });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate("student", "name email")
            .sort({ createdAt: -1 });

        res.json(tickets);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch requests",
            error: error.message
        });
    }
};

const updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["pending", "resolved"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        res.json({
            message: "Request status updated",
            ticket
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update status",
            error: error.message
        });
    }
};

module.exports = {
    createTicket,
    getMyTickets,
    getAllTickets,
    updateTicketStatus
};