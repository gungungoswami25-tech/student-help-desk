const token = localStorage.getItem("token");
let user;
try { user = JSON.parse(localStorage.getItem("user")); } catch { user = null; }
if (!token || !user || !["subadmin", "superadmin"].includes(user.role)) {
    window.location.replace("/login.html");
}
const headers = { Authorization: `Bearer ${token}` };
const welcome = document.getElementById("welcome-message");
if (welcome) welcome.textContent = `Hello, ${user.name || "there"}!`;
const formatDate = (value) => new Date(value).toLocaleDateString();
async function loadAllTickets() {
    const body = document.getElementById("tickets-body");
    if (!body) return;
    try {
        const response = await fetch("/api/tickets/all", { headers });
        const tickets = await response.json();
        if (!response.ok) throw new Error(tickets.message || "Could not load tickets");
        body.replaceChildren();
        if (!tickets.length) { const row = body.insertRow(); row.className = "empty-row"; const cell = row.insertCell(); cell.colSpan = 7; cell.textContent = "No tickets to show yet."; return; }
        tickets.forEach((ticket) => {
            const row = body.insertRow();
            [ticket.title, ticket.category, ticket.student?.name || "Student", ticket.description].forEach((value) => { row.insertCell().textContent = value; });
            const statusCell = row.insertCell(); const pill = document.createElement("span");
            pill.className = `status-pill ${ticket.status === "resolved" ? "resolved" : "open"}`; pill.textContent = ticket.status; statusCell.appendChild(pill);
            row.insertCell().textContent = formatDate(ticket.createdAt);
            const actionCell = row.insertCell(); actionCell.className = "actions-cell";
            const select = document.createElement("select"); select.className = "status-select"; select.setAttribute("aria-label", `Status for ${ticket.title}`);
            [["pending", "Pending"], ["resolved", "Resolved"]].forEach(([value, label]) => { const option = new Option(label, value); option.selected = ticket.status === value; select.add(option); });
            const button = document.createElement("button"); button.type = "button"; button.className = "btn btn-outline status-update"; button.textContent = "Save";
            button.addEventListener("click", () => updateStatus(ticket._id, select, button)); actionCell.append(select, button);
        });
    } catch (error) { console.error(error); }
}
async function updateStatus(id, select, button) {
    button.disabled = true;
    try {
        const response = await fetch(`/api/tickets/${id}/status`, { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ status: select.value }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not update status");
        await loadAllTickets();
    } catch (error) { alert(error.message || "Server error. Please try again."); button.disabled = false; }
}
document.getElementById("logout-btn")?.addEventListener("click", () => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.replace("/login.html"); });
loadAllTickets();
