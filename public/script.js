// ================= REGISTER =================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const fullname = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullname,
                email,
                password
            })
        })
        .then(res => res.text())
        .then(data => {
            alert(data);
            window.location.href = "login.html";
        })
        .catch(err => console.log(err));
    });
}


// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                localStorage.setItem("userId", data.user.id);
localStorage.setItem("currentUser", data.user.fullname);

window.location.href = "dashboard.html";

            } else {

                alert("Invalid Email or Password");

            }

        })
        .catch(err => console.log(err));
    });
}


// ================= DASHBOARD =================
const startQuiz = document.getElementById("startQuiz");

if (startQuiz) {
    startQuiz.addEventListener("click", () => {
        window.location.href = "quiz.html";
    });
}


// ================= RESULT PAGE =================
if (window.location.pathname.includes("result.html")) {

    const score = Number(localStorage.getItem("score")) || 0;
    const total = Number(localStorage.getItem("total")) || 0;

    const percentage =
        total > 0 ? ((score / total) * 100).toFixed(0) : 0;

    document.getElementById("score").textContent = score;
    document.getElementById("total").textContent = total;
    document.getElementById("percentage").textContent = percentage;

    const message = document.getElementById("message");

    if (percentage >= 80) {
        message.textContent = "Excellent! 🎉";
    } else if (percentage >= 50) {
        message.textContent = "Good Job! 👍";
    } else {
        message.textContent = "Keep Practicing! 📚";
    }

    const leaderboardBtn =
        document.getElementById("leaderboardBtn");

    if (leaderboardBtn) {
        leaderboardBtn.addEventListener("click", () => {
            window.location.href = "leaderboard.html";
        });
    }

    const dashboardBtn =
        document.getElementById("dashboardBtn");

    if (dashboardBtn) {
        dashboardBtn.addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
    }
}