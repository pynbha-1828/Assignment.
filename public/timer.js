// Set timer to 5 minutes (300 seconds)
let timeLeft = 300;

const timer = document.getElementById("timer");

const countdown = setInterval(() => {

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    timer.textContent = `${minutes}:${seconds}`;

    if (timeLeft <= 0) {

        clearInterval(countdown);

        alert("Time is up! Your quiz will be submitted automatically.");

        // Calculate score
        let score = 0;

        questions.forEach((q, index) => {

            if (userAnswers[index] === q.answer) {
                score++;
            }

        });

        localStorage.setItem("score", score);
        localStorage.setItem("total", questions.length);

        window.location.href = "result.html";
    }

    timeLeft--;

}, 1000);