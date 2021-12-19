const express = require('express');
let router = express.Router();
const pool = require('../config/db');

router.get("/list", async (req, res) => { // List of all the courses 
    try {
      const allCourses = await pool.query("SELECT * FROM course");
      res.json(allCourses.rows);
    } catch (err) {
      console.error(err.message);
    }
});

router.post("/addNewCourse", async (req, res) => { 
  try{
    await pool.query(
      "INSERT INTO course values ($1, $2, $3, $4);",
      [req.body.course_id, req.body.coursename, req.body.type, req.body.credits]
    );
    res.json("success");
  }
  catch(err){
    res.json(err);
  }
})

router.post("/updateCourse", async (req, res) => {
  try{
    await pool.query(
      "UPDATE course SET coursename=$2, type=$3, credits=$4 WHERE course_id=$1;",
      [req.body.course_id, req.body.coursename, req.body.type, req.body.credits]
    );
    res.json("success");
  }
  catch(err){
    res.json(err);
  }
})

router.post("/deleteCourse", async (req, res) => {
  try{
    await pool.query(
      "DELETE FROM availableCourses WHERE course_id=$1; DELETE FROM courseEnrollment WHERE course_id=$1; DELETE FROM course WHERE course_id=$1;",
      [req.body.course_id]
    );
    res.json("success");
  }
  catch(err){
    res.json(err);
  }
})

router.post("/addAvailableCourse", async (req, res) => {
  try{
    await pool.query(
      "INSERT INTO availableCourses VALUES ($1, $2, $3, $4, $5);",
      [req.body.course_id, req.body.semester, req.body.branch, req.body.totalSeats, req.body.totalSeats]
    )
    res.json("success");
  }
  catch(err){
    res.json(err);
  }
})

router.post("/updateAvailableCourse", async (req, res) => {
  try{
    await pool.query(
      "UPDATE availableCourses SET semester=$2, branch=$3, availableSeats=$4, totalSeats=$4 WHERE course_id=$1",
      [req.body.course_id, req.body.semester, req.body.branch, req.body.totalSeats]
    )
    res.json("success");
  }
  catch(err){
    res.json(err);
  }
})

router.post("/decreaseAvailableSeats", async (req, res) => {
  try {
    var data = await pool.query(
      "SELECT availableSeats from availableCourses WHERE course_id=$1;",
      [req.body.course_id]
    )
    if(data === 0){
      res.json("Not Available");
    }
    else{
      await pool.query(
        "UPDATE availableCourses SET availableSeats=$2 WHERE course_id=$1;",
        [req.body.course_id, data-1]
      )
      res.json(data-1);
    }
  } catch (err) {
    res.json(err)
  }
})

router.post("/deleteAvailableCourse", async (req, res) => {
  try{
    await pool.query(
      "DELETE FROM availableCourses WEHRE course_id=$1",
      [req.body.course_id]
    )
    res.json("success");
  }
  catch(err){
    res.json(err);
  }
})

router.post("/courseAvailibility", async (req, res) => {
  try{
    const data = await pool.query(
      "SELECT * FROM availableCourses WHERE course_id=$1",
      [req.body.course_id]
    )
    res.json(data);
  }
  catch(err){
    res.json(err);
  }
})

router.post("/availableCoursesInSem", async (req, res) => {
  try{
    const data = await pool.query(
      "SELECT * FROM availableCourses WHERE semester=$1",
      [req.body.semester]
    )
    res.json(data);
  }
  catch(err){
    res.json(err);
  }
})

router.post("/availableCoursesForBranch", async (req, res) => {
  try{
    const data = await pool.query(
      "SELECT * FROM availableCourses WHERE branch=$1",
      [req.body.branch]
    )
    res.json(data);
  }
  catch(err){
    res.json(err);
  }
})




module.exports = router; 