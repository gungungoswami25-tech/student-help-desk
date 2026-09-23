const token = localStorage.getItem("token");
let user;
try { user = JSON.parse(localStorage.getItem("user")); } catch { user = null; }
if (!token || !user || user.role !== "superadmin") window.location.replace("/login.html");
const headers = { Authorization: `Bearer ${token}` };
const welcome = document.getElementById("welcome-message");
if (welcome) welcome.textContent = `Hello, ${user.name || "there"}!`;
const formatDate = (value) => new Date(value).toLocaleDateString();
const form = document.getElementById("create-subadmin-form");
form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = { name: document.getElementById("sub-name").value.trim(), email: document.getElementById("sub-email").value.trim(), password: document.getElementById("sub-password").value };
    try {
        const response = await fetch("/api/admin/create-subadmin", { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Could not create sub-admin");
        form.reset(); await loadSubAdmins();
    } catch (error) { alert(error.message || "Server error. Please try again."); }
});
async function loadSubAdmins() {
    const body = document.getElementById("subadmins-body");
    try {
        const response = await fetch("/api/admin/subadmins", { headers }); const admins = await response.json();
        if (!response.ok) throw new Error(admins.message || "Could not load sub-admins");
        body.replaceChildren();
        if (!admins.length) { const row = body.insertRow(); row.className = "empty-row"; const cell = row.insertCell(); cell.colSpan = 4; cell.textContent = "No sub-admins added yet."; return; }
        admins.forEach((admin) => { const row = body.insertRow(); [admin.name, admin.email, formatDate(admin.createdAt), "Active"].forEach((value) => { row.insertCell().textContent = value; }); });
    } catch (error) { console.error(error); }
}
// Reuse the same ticket table and status controls as the admin dashboard.
async function loadAllTickets() {
    const body = document.getElementById("tickets-body");
    try {
        const response = await fetch("/api/tickets/all", { headers }); const tickets = await response.json();
        if (!response.ok) throw new Error(tickets.message || "Could not load tickets");
        body.replaceChildren();
        if (!tickets.length) { const row = body.insertRow(); row.className = "empty-row"; const cell = row.insertCell(); cell.colSpan = 7; cell.textContent = "No tickets to show yet."; return; }
        tickets.forEach((ticket) => {
            const row = body.insertRow();
            [ticket.title, ticket.category, ticket.student?.name || "Student", ticket.description].forEach((value) => { row.insertCell().textContent = value; });
            const statusCell = row.insertCell(); const pill = document.createElement("span"); pill.className = `status-pill ${ticket.status === "resolved" ? "resolved" : "open"}`; pill.textContent = ticket.status; statusCell.appendChild(pill);
            row.insertCell().textContent = formatDate(ticket.createdAt);
            const action = row.insertCell(); action.className = "actions-cell"; const select = document.createElement("select"); select.setAttribute("aria-label", `Status for ${ticket.title}`);
            [["pending", "Pending"], ["resolved", "Resolved"]].forEach(([value, label]) => { const option = new Option(label, value); option.selected = ticket.status === value; select.add(option); });
            const button = document.createElement("button"); button.type = "button"; button.className = "btn btn-outline status-update"; button.textContent = "Save";
            button.addEventListener("click", async () => { button.disabled = true; try { const r = await fetch(`/api/tickets/${ticket._id}/status`, { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ status: select.value }) }); const result = await r.json(); if (!r.ok) throw new Error(result.message || "Could not update status"); await loadAllTickets(); } catch (error) { alert(error.message); button.disabled = false; } });
            action.append(select, button);
        });
    } catch (error) { console.error(error); }
}
document.getElementById("logout-btn")?.addEventListener("click", () => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.replace("/login.html"); });
loadAllTickets(); loadSubAdmins();
