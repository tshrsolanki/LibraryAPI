const express = require("express");
const db = require("../model");
const lodash = require("lodash");
const studentrouter = express.Router();

studentrouter.get("/list", (req, res) => {
  db.select("*")
    .from("students")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err, "||", "studentrouter.js", "line-", 12);
    });
});
studentrouter.get("/:rollno", (req, res) => {
  try {
    db.select("*")
      .from("students")
      .where("studentid", "=", req.params.rollno)
      .then((data) => {
        res.json(data[0]);
      });
  } catch (error) {
    console.log(error, "||", "studentrouter.js", "line-", 22);
  }
});

studentrouter.post("/issuebooks/:rollno", async (req, res) => {
  const rollno = req.params.rollno;
  const books = req.body.issuebooks;
  const newc = req.body.count;
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  var date = new Date();
  try {
    for (let i = 0; i < books.length; i++) {
      const ele = books[i];
      await db("books").where("bookid", "=", ele).decrement("availableqty", 1);
      await db.transaction((t) => {
        t.insert({
          student_id: Number(rollno),
          book_id: Number(ele),
          borrow_date: new Date().toLocaleDateString(),
          return_date: date.addDays(30).toLocaleDateString(),
        })
          .into("booksborrowed")
          .then(t.commit)
          .catch(t.rollback);
      });
    }
    await db
      .select("*")
      .from("students")
      .where("studentid", "=", rollno)
      .update({
        count: Number(newc),
      })
      .returning("*")
      .then((data) => {
        res.json(data);
      });
  } catch (error) {
    console.log(error, "||", "studentrouter.js", "line-", 64);
  }
});
studentrouter.get("/borrowed/:rollno", (req, res) => {
  const rollno = req.params.rollno;
  const result = [];
  try {
    db.select("*")
      .from("booksborrowed")
      .where("student_id", "=", rollno)
      .join("books", "booksborrowed.book_id", "books.bookid")
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          Object.assign(
            data[i],
            { borrow_date: data[i].borrow_date.toLocaleDateString() },
            { return_date: data[i].return_date.toLocaleDateString() }
          );
          result.push(
            lodash.omit(data[i], "student_id", "book_id", "availableqty")
          );
        }
        res.json(result);
      });
  } catch (error) {
    console.log(error, "||", "studentrouter.js", "line-", 89);
  }
});
studentrouter.post("/returnbooks/:rollno", async (req, res) => {
  const rollno = req.params.rollno;
  const books = req.body.returnbooks;
  const newcount = req.body.count;

  for (let i = 0; i < books.length; i++) {
    try {
      const ele = books[i];
      await db("books").where("bookid", "=", ele).increment("availableqty", 1);

      await db
        .select("*")
        .from("booksborrowed")
        .where("student_id", "=", rollno)
        .andWhere("book_id", "=", ele)
        .del();
    } catch (error) {
      console.log(error, "||", "studentrouter.js", "line-", 110);
    }
  }
  try {
    await db
      .select("*")
      .from("students")
      .where("studentid", "=", rollno)
      .update({
        count: Number(newcount),
      })
      .returning("*")
      .then((data) => {
        res.json(data);
      });
  } catch (error) {
    console.log(error, "||", "studentrouter.js", "line-", 126);
  }
});

studentrouter.get("/borrowedbookid/:rollno", (req, res) => {
  const rollno = req.params.rollno;
  db.select("book_id")
    .where("student_id", "=", rollno)
    .from("booksborrowed")
    .returning("book_id")
    .then((data) => {
      const returndata = [];
      for (let i = 0; i < data.length; i++) {
        returndata.push(data[i].book_id);
      }
      res.json(returndata);
    })
    .catch((err) => {
      console.log(err, "||", "studentrouter.js", "line-", 145);
    });
});
module.exports = {
  studentrouter,
};
