const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Unable to start without a database connection:", error.message);
        process.exit(1);
    }
}
startServer();
