const express = require('express');
let router = express.Router();

router.get("/courseList", async (req, res) => {
    try {
      const allCourses = await pool.query("SELECT * FROM courses");
      res.json(allCourses.rows);
    } catch (err) {
      console.error(err.message);
    }
});

module.exports = router;