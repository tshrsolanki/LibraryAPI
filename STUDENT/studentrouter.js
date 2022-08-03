const express = require("express");
const db = require("../model");
const studentrouter = express.Router();

studentrouter.get("/list", (req, res) => {
  db.select("*")
    .from("students")
    .then((data) => {
      res.json(data);
    });
});
studentrouter.get("/:rollno", (req, res) => {
  db.select("*")
    .from("students")
    .where("studentid", "=", req.params.rollno)
    .then((data) => {
      res.json(data);
    });
});

module.exports = {
  studentrouter,
};
