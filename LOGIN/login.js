const express = require("express");
const db = require("../model");
const { createSession } = require("../sessions");
const login = express.Router();

login.post("/admin/:adminid", async (req, res) => {
  const id = req.params.adminid;
  try {
    const temp = await db("loginlibrary")
      .where("rollno", "=", id)
      .andWhere("isadmin", "=", true)
      .andWhere("password", "=", req.body.password);
    if (temp.length) {
      const token = await createSession(id);

      return res.json({ status: true, token });
    }
    return res.json({ status: false });
  } catch (error) {
    console.log(error);
    return res.json({ status: false });
  }
});

login.post("/student/:rollno", async (req, res) => {
  try {
    const id = req.params.rollno;
    const temp = await db("loginlibrary")
      .where("rollno", "=", id)
      .andWhere("password", "=", req.body.password)
      .andWhere("isadmin", "=", false);
    if (temp.length) {
      const token = await createSession(id);

      return res.json({ status: true, token });
    }
    return res.json({ status: false });
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  login,
};
