const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Register
app.post("/register", (req, res) => {
    const { fullname, email, password } = req.body;

    const sql =
        "INSERT INTO users(fullname, email, password) VALUES (?, ?, ?)";

    db.query(sql, [fullname, email, password], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Registration Failed");
        }

        res.send("Registration Successful");
    });
});

// Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.json({ success: false });
        }

        if (result.length === 0) {
            return res.json({ success: false });
        }

      res.json({
    success: true,
    user: {
        id: result[0].id,
        fullname: result[0].fullname
    }
});
    });
});

// Save Quiz Result
app.post("/save-result", (req, res) => {
    console.log("SAVE RESULT ROUTE HIT");
    console.log(req.body);

    const {
        user_id,
        correct_answers,
        wrong_answers,
        total_questions,
        percentage,
        username
    } = req.body;

    // Save into quiz_results
    db.query(
        `INSERT INTO quiz_results
        (user_id, correct_answers, wrong_answers, total_questions, percentage)
        VALUES (?, ?, ?, ?, ?)`,
        [
            user_id,
            correct_answers,
            wrong_answers,
            total_questions,
            percentage
        ],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Failed");
            }

            // Save into leaderboard
            db.query(
    `INSERT INTO leaderboard(username, score)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE
     score = GREATEST(score, VALUES(score))`,
    [username, correct_answers],
            
                (err2) => {

                    if (err2) {
                        console.log(err2);
                        return res.status(500).send("Failed");
                    }

                    res.send("Result Saved");
                }
            );

        }
    );

});

app.get("/profile/:id", (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT
            u.fullname,
            q.completed_at,
            q.correct_answers,
            q.percentage
        FROM users u
        LEFT JOIN quiz_results q
        ON u.id = q.user_id
        WHERE u.id = ?
        ORDER BY q.completed_at DESC
        LIMIT 1
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Error");
        }

        res.json(result[0]);
    });
});

app.get("/leaderboard", (req, res) => {

    db.query(
        "SELECT username, score FROM leaderboard ORDER BY score DESC",
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send("Error");
            }

            console.log(result);   // <-- add this line

            res.json(result);
        }
    );

});

app.get("/dashboard/:id", (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT
            COUNT(*) AS totalQuiz,
            MAX(correct_answers) AS highestScore,
            AVG(percentage) AS averageScore
        FROM quiz_results
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).send("Error");
        }

        res.json(result[0]);
    });

});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});