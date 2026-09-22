const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
    window.location.href = "/login.html";
}

// Create Ticket
const ticketForm = document.getElementById("ticket-form");

if (ticketForm) {
    ticketForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("ticket-title").value;
        const description = document.getElementById("ticket-description").value;

        try {
            const response = await fetch("/api/tickets/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Request submitted successfully!");

            ticketForm.reset();

            loadMyTickets();

        } catch (error) {
            console.error(error);
            alert("Server error.");
        }
    });
}


// Load user's tickets
async function loadMyTickets() {
    try {
        const response = await fetch("/api/tickets/my", {
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
            `;

            ticketList.appendChild(div);
        });

    } catch (error) {
        console.error(error);
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


loadMyTickets();