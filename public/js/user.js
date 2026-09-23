const token = localStorage.getItem("token");
let user;
try { user = JSON.parse(localStorage.getItem("user")); } catch { user = null; }
if (!token || !user || user.role !== "user") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/login.html");
}

const headers = { Authorization: `Bearer ${token}` };
const welcome = document.getElementById("welcome-message");
if (welcome) welcome.textContent = `Hello, ${user.name || "there"}!`;
const previousStatuses = new Map();
let checkedOnce = false;
const formatDate = value => new Date(value).toLocaleDateString();

async function loadTickets(url, bodyId, withOwner = false) {
    const body = document.getElementById(bodyId);
    if (!body) return;
    try {
        const response = await fetch(url, { headers });
        const tickets = await response.json();
        if (!response.ok) throw new Error(tickets.message || "Could not load tickets");

        if (bodyId === "my-tickets-body") {
            if (checkedOnce) {
                const changed = tickets.find(ticket => previousStatuses.has(ticket._id) && previousStatuses.get(ticket._id) !== ticket.status);
                const notice = document.getElementById("ticket-update-notice");
                if (changed && notice) notice.textContent = `Update: “${changed.title}” is now ${changed.status}.`;
            }
            previousStatuses.clear();
            tickets.forEach(ticket => previousStatuses.set(ticket._id, ticket.status));
            checkedOnce = true;
        }

        body.replaceChildren();
        if (!tickets.length) {
            const row = body.insertRow();
            row.className = "empty-row";
            const cell = row.insertCell();
            cell.colSpan = withOwner ? 5 : 4;
            cell.textContent = "No tickets to show yet.";
            return;
        }

        tickets.forEach(ticket => {
            const row = body.insertRow();
            [ticket.title, ticket.category].forEach(value => { row.insertCell().textContent = value; });
            if (withOwner) row.insertCell().textContent = ticket.student?.name || "Student";
            const statusCell = row.insertCell();
            const pill = document.createElement("span");
            pill.className = `status-pill ${ticket.status === "resolved" ? "resolved" : "open"}`;
            pill.textContent = ticket.status;
            statusCell.appendChild(pill);
            row.insertCell().textContent = formatDate(ticket.createdAt);
        });
    } catch (error) {
        console.error(error);
    }
}

document.getElementById("ticket-form")?.addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = {
        title: document.getElementById("ticket-title").value.trim(),
        category: document.getElementById("ticket-category").value,
        description: document.getElementById("ticket-description").value.trim()
    };
    try {
        const response = await fetch("/api/tickets/create", {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not submit ticket");
        form.reset();
        await loadTickets("/api/tickets/my", "my-tickets-body");
    } catch (error) {
        alert(error.message || "Server error. Please try again.");
    }
});

document.getElementById("toggle-view-btn")?.addEventListener("click", async event => {
    const hidden = document.getElementById("all-tickets-card").classList.toggle("hidden");
    event.currentTarget.textContent = hidden ? "View all tickets" : "Hide all tickets";
    if (!hidden) await loadTickets("/api/tickets/all", "all-tickets-body", true);
});
document.getElementById("all-tickets-card")?.classList.add("hidden");
document.getElementById("logout-btn")?.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/login.html");
});

loadTickets("/api/tickets/my", "my-tickets-body");
// Poll while the page is visible so admin status changes appear without a manual reload.
const refreshMyTickets = () => {
    if (document.visibilityState === "visible") loadTickets("/api/tickets/my", "my-tickets-body");
};
window.setInterval(refreshMyTickets, 5000);
document.addEventListener("visibilitychange", refreshMyTickets);
