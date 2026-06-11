let questions = [];
let currentQuestion = 0;
let userAnswers = [];

// Load questions from JSON
fetch("question.json")
    .then(response => response.json())
    .then(data => {
        questions = data;
        document.getElementById("totalQuestions").textContent = questions.length;
        loadQuestion();
    });

// Display current question
function loadQuestion() {

    document.getElementById("currentQuestion").textContent = currentQuestion + 1;

    let q = questions[currentQuestion];

    document.getElementById("questionText").textContent = q.question;

    document.getElementById("option1").textContent = q.options[0];
    document.getElementById("option2").textContent = q.options[1];
    document.getElementById("option3").textContent = q.options[2];
    document.getElementById("option4").textContent = q.options[3];

    let radios = document.getElementsByName("option");

    radios.forEach((radio, index) => {
        radio.value = q.options[index];

        radio.checked =
            userAnswers[currentQuestion] === q.options[index];
    });

    // Show Submit only on last question
    const submitBtn = document.getElementById("submitBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (currentQuestion === questions.length - 1) {
        submitBtn.style.display = "inline-block";
        nextBtn.style.display = "none";
    } else {
        submitBtn.style.display = "none";
        nextBtn.style.display = "inline-block";
    }
}

// Save selected answer
document.querySelectorAll('input[name="option"]').forEach(radio => {

    radio.addEventListener("change", function () {

        userAnswers[currentQuestion] = this.value;

    });

});

// Next button
document.getElementById("nextBtn").addEventListener("click", () => {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;
        loadQuestion();

    }

});

// Previous button
document.getElementById("prevBtn").addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;
        loadQuestion();

    }

});

// Submit button
document.getElementById("submitBtn").addEventListener("click", () => {

    // Check if every question has been answered
    if (
        userAnswers.length !== questions.length ||
        userAnswers.includes(undefined)
    ) {

        alert("Please answer all questions before submitting.");
        return;

    }

    let score = 0;

    questions.forEach((q, index) => {

        if (userAnswers[index] === q.answer) {

            score++;

        }

    });

    // Save score for result page
    localStorage.setItem("score", score);
    localStorage.setItem("total", questions.length);

    // Get current logged-in user
    const currentUser =
        localStorage.getItem("currentUser") || "Guest";

    // Get existing leaderboard
    let leaderboard =
        JSON.parse(localStorage.getItem("leaderboard")) || [];

    // Add new score
    leaderboard.push({
        name: currentUser,
        score: score
    });

    // Sort leaderboard
    leaderboard.sort((a, b) => b.score - a.score);

    // Save leaderboard
    localStorage.setItem(
        "leaderboard",
        JSON.stringify(leaderboard)
    );

    // Debug check
    console.log("Leaderboard saved:");
    console.log(localStorage.getItem("leaderboard"));

    // Go to result page
  const userId = localStorage.getItem("userId");
const username = localStorage.getItem("currentUser");

fetch("/save-result", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        user_id: userId,
        correct_answers: score,
        wrong_answers: questions.length - score,
        total_questions: questions.length,
        percentage: ((score / questions.length) * 100).toFixed(2),
        username: username
    })
})
.then(res => res.text())
.then(data => {

    console.log(data);

    window.location.href = "result.html";

})
.catch(err => console.log(err));

});