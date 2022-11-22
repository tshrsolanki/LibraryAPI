const express = require("express");
const db = require("../model");
const login = express.Router();

login.post("/student/:rollno", async (req, res) => {
  const id = req.params.rollno;
  console.log(id);
  const temp = await db("login")
    .where("rollno", "=", id)
    .andWhere("password", "=", req.body.password);
  if (temp.length) {
    return res.json({ status: true });
  }
  return res.json({ status: false });
});

module.exports = {
  login,
};
