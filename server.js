const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

//pool();

app.get("/courses", async (req, res) => {
    try {
      const allCourses = await pool.query("SELECT * FROM courses");
      res.json(allCourses.rows);
    } catch (err) {
      console.error(err.message);
    }
  });

app.get("/", (req, res) => {
    res.send("Hello world");
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server Started in " + process.env.NODE_ENV +  " mode Successfully on " + port);
});