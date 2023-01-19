const express = require("express");
const db = require("../model");

const bookrouter = express.Router();

bookrouter.get("/list", (req, res) => {
  try {
    db.select("*")
      .from("books")
      .then((data) => {
        res.json(data);
      });
  } catch (error) {
    console.log(error, "||", "bookrouter.js", "line-", 14);
  }
});

module.exports = {
  bookrouter,
};
