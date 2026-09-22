const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("reg-name").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("reg-confirm-password").value;

        const errorMsg = document.getElementById("reg-error-msg");

        errorMsg.textContent = "";

        // Check password length
        if (password.length < 8) {
            errorMsg.textContent = "Password must be at least 8 characters.";
            return;
        }

        // Check passwords
        if (password !== confirmPassword) {
            errorMsg.textContent = "Passwords do not match.";
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                errorMsg.textContent = data.message || "Registration failed.";
                return;
            }

            alert("Registration successful!");

            window.location.href = "/login.html";

        } catch (error) {
            console.error(error);
            errorMsg.textContent = "Server error. Please try again.";
        }
    });
}