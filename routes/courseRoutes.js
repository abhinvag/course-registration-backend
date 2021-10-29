const express = require('express');
let router = express.Router();
const pool = require('../config/db');

router.get("/list", async (req, res) => {
    try {
      const allCourses = await pool.query("SELECT * FROM course");
      res.json(allCourses.rows);
    } catch (err) {
      console.error(err.message);
    }
});

module.exports = router;