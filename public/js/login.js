const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "superadmin") {
                window.location.href = "/superadmin-dashboard.html";
            } else if (data.user.role === "subadmin") {
                window.location.href = "/admin-dashboard.html";
            } else {
                window.location.href = "/user-dashboard.html";
            }

        } catch (error) {
            console.error(error);
            alert("Server error. Please try again.");
        }
    });
}