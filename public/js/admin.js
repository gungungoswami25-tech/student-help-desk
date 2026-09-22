const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
    window.location.href = "/login.html";
}

// Load all tickets
async function loadAllTickets() {
    try {
        const response = await fetch("/api/tickets/all", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const tickets = await response.json();

        const ticketList = document.getElementById("ticket-list");

        if (!ticketList) return;

        ticketList.innerHTML = "";

        tickets.forEach(ticket => {
            const div = document.createElement("div");

            div.className = "ticket-card";

            div.innerHTML = `
                <h3>${ticket.title}</h3>
                <p>${ticket.description}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>

                <select class="status-select" data-id="${ticket._id}">
                    <option value="pending" ${ticket.status === "pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="in-progress" ${ticket.status === "in-progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="resolved" ${ticket.status === "resolved" ? "selected" : ""}>
                        Resolved
                    </option>
                </select>

                <button onclick="updateStatus('${ticket._id}')">
                    Update Status
                </button>
            `;

            ticketList.appendChild(div);
        });

    } catch (error) {
        console.error(error);
    }
}


// Update ticket status
async function updateStatus(ticketId) {

    const select = document.querySelector(
        `.status-select[data-id="${ticketId}"]`
    );

    const status = select.value;

    try {
        const response = await fetch(`/api/tickets/${ticketId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                status
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Status updated!");

        loadAllTickets();

    } catch (error) {
        console.error(error);
        alert("Server error.");
    }
}


// Logout
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login.html";
    });
}


loadAllTickets();