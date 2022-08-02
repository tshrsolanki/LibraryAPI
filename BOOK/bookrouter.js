const express = require("express");
const db = require("../model");

const bookrouter = express.Router();

bookrouter.get("/list", (req, res) => {
  db.select("*")
    .from("books")
    .then((data) => {
      res.json(data);
    });
});

module.exports = {
  bookrouter,
};
