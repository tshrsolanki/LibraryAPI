const express = require("express");
const db = require("../model");

const adminrouter = express.Router();

adminrouter.get("/details", (req, res) => {});

adminrouter.get("/pendingreturns", async (req, res) => {
  const data = await db
    .select("*")
    .from("booksborrowed")
    .returning("*")
    .where("return_date", "<", new Date());
  res.json(data);
});
adminrouter.post("/editbooks", async (req, res) => {
  const books = req.body.books;

  for (let i = 0; i < books.length; i++) {
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
  }
  db.select("*")
    .from("books")
    .then((data) => {
      res.json(data);
    });
});

adminrouter.post("/addbook", async (req, res) => {
  const book = req.body;
  const temp = await db("books").insert(book);

  res.json({ status: temp.rowCount });
});

adminrouter.get("/deletebook/:bookid", async (req, res) => {
  const id = req.params.bookid;

  const temp = await db("books").where("bookid", "=", id).del();

  res.json({ status: temp });
});

module.exports = { adminrouter };
