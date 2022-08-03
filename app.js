const express = require("express");
const cors = require("cors");
const { studentrouter } = require("./STUDENT/studentrouter");
const { bookrouter } = require("./BOOK/bookrouter");
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

app.get("/test", (req, res) => {
  // db.transaction((t) => {
  //   t.insert({
  //     b: '["hot", "cold"]',
  //     bookname: "aaa",
  //     author: "aaa",
  //   })
  //     .into("books")
  //     .returning("*")
  //     .then((data) => {
  //       res.json(data);
  //     })
  //     .then(t.commit);
  // });
  // db.select("author")
  //   .from("books")
  //   .where("bookname", "=", "Sherlock Holmes")
  //   .returning("author")
  //   .then((data) => {
  //     res.json(data);
  //   });
  db.select("*")
    .from("students")
    .returning("*")
    .then((data) => {
      res.json(data);
    });
});

module.exports = { app };
