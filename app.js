const express = require("express");
const cors = require("cors");
const { studentrouter } = require("./STUDENT/studentrouter");
const { bookrouter } = require("./BOOK/bookrouter");
const { adminrouter } = require("./ADMINROUTER/adminrouter");
const { login } = require("./LOGIN/login");
const lodash = require("lodash");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "aimgod",
    database: "postgres",
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.use("/student", studentrouter);
app.use("/book", bookrouter);
app.use("/admin", adminrouter);
app.use("/login", login);

app.get("/test", async (req, res) => {
  const data = await db
    .select("*")
    .from("booksborrowed")
    .where("student_id", "=", 100)
    .join("books", "books.bookid", "booksborrowed.book_id")
    .join("students", "students.studentid", "student_id");
  const result = [];
  for (let i = 0; i < data.length; i++) {
    result.push(lodash.omit(data[i], "count"));
  }

  res.json(result);
});

module.exports = { app };
