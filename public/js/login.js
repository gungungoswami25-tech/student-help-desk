const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("login-error-msg");
loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMsg.textContent = ""; errorMsg.classList.remove("visible");
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    try {
        const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to log in.");
        localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data.user));
        const destination = { superadmin: "/superadmin-dashboard.html", subadmin: "/admin-dashboard.html", user: "/user-dashboard.html" }[data.user.role];
        if (!destination) throw new Error("This account has an unsupported role.");
        window.location.assign(destination);
    } catch (error) {
        errorMsg.textContent = error.message || "Server error. Please try again.";
        errorMsg.classList.add("visible");
    }
});
