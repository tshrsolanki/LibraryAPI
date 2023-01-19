const express = require("express");
const db = require("../model");
const lodash = require("lodash");

const adminrouter = express.Router();

adminrouter.get("/details", (req, res) => {});

adminrouter.get("/pendingreturns", async (req, res) => {
  try {
    const finalData = [];
    const data = await db
      .select("*")
      .from("booksborrowed")
      .returning("*")
      .where("return_date", "<", new Date())
      .join("students", "booksborrowed.student_id", "students.studentid");
    data.forEach((data) => {
      finalData.push(
        lodash.omit(data, "studentid", "firstname", "lastname", "count")
      );
    });
    res.json(finalData);
  } catch (error) {
    console.log(error, "||", "adminrouter.js", "line-", 17);
  }
});
adminrouter.post("/editbooks", async (req, res) => {
  const books = req.body.books;

  for (let i = 0; i < books.length; i++) {
    try {
      const ele = books[i];
      await db
        .select("*")
        .from("books")
        .update({
          bookname: ele.bookname,
          author: ele.author,
          availableqty: ele.availableqty,
          genre: ele.genre,
        })
        .where("bookid", "=", ele.bookid);
    } catch (error) {
      console.log(error, "||", "adminrouter.js", "line-", 37);
      break;
    }
  }

  db.select("*")
    .from("books")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err, "||", "adminrouter.js", "line-", 56);
    });
});

adminrouter.post("/addbook", async (req, res) => {
  const book = req.body;
  try {
    const temp = await db("books").insert(book);

    res.json({ status: temp.rowCount });
  } catch (error) {
    console.log(error, "||", "adminrouter.js", "line-", 54);
  }
});

adminrouter.get("/deletebook/:bookid", async (req, res) => {
  const id = req.params.bookid;
  try {
    const temp = await db("books").where("bookid", "=", id).del();

    res.json({ status: temp });
  } catch (error) {
    console.log(error, "||", "adminrouter.js", "line-", 65);
  }
});

module.exports = { adminrouter };
