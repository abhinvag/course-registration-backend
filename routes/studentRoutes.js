const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const generator = require('generate-password');
const nodemailer = require('nodemailer');
var multer = require("multer");
var upload = multer();
const xlsx = require('xlsx');
require("dotenv").config();

let router = express.Router();
const saltRounds = 10;

/*
TODO:
* Get List of Students by branch
* Get List of Students by Sem
*/

router.get("/list", async (req, res) => { // list of all the entries in student table
    try {
      const studentinfo = await pool.query("SELECT * FROM student");
      res.json(studentinfo.rows);
    } catch (err) {
      res.json(err);
    }
});

router.post('/register', function(req, res){ // register user
    try{
        bcrypt.hash(req.body.passw, saltRounds, async function(err, hash) {
            if(hash){
                try{
                    await pool.query(
                        "INSERT INTO student VALUES ($1, $2, $3, $4, $5, $6);",
                        [req.body.userId, req.body.name, req.body.joining_year , req.body.Student_DOB, 
                            req.body.Branch, hash]
                    );
                    res.json("Success");
                }
                catch(err){
                    res.json(err);
                }
            }
            else{
                res.json(err);
            }
        });
    }catch(err){
        res.json(err);
    }
})

router.post('/registerMultiple', upload.single('file'), function(req, res){
    try{
        const data = req.file.buffer;
        const wb = xlsx.read(data);
        const ws = wb.Sheets["Sheet1"];
        const list = xlsx.utils.sheet_to_json(ws, {
            raw: false,
        });
        //console.log(list);
        list.map((student) => {
            let passw = student.passw;
            let stringPassw = passw.toString();
            bcrypt.hash(stringPassw, saltRounds, async function(err, hash) {
                if(hash){
                    await pool.query(
                        "INSERT INTO student VALUES ($1, $2, $3, $4, $5, $6);",
                        [student.userId, student.name, student.joining_year , student.Student_DOB, 
                            student.Branch, hash]
                    );
                }
                else{
                    console.log(err);
                }
            });
        })
        res.json("success")
    }
    catch(err){
        res.json(err)
    }
})


router.post('/verify', async function(req, res){ // verify password
    try{
        const User = await pool.query(
            "SELECT * FROM student WHERE userId=$1",
            [req.body.userId]
        );
        if(User.rowCount === 0) { // if user with given id do not exist
            res.json("User Not Found");
        }
        else{
            bcrypt.compare(req.body.passw, User.rows[0].passw, function(err, result) {
                if(!err){
                    if(result){
                        var dummy = {
                            userid : User.rows[0].userid,
                            name : User.rows[0].name,
                            joining_year : User.rows[0].joining_year,
                            Branch: User.rows[0].branch
                        }
                        res.json(dummy); 
                    }
                    else{
                        res.json("Incorrect Password");
                    }
                }
                else{
                    res.json(err);
                }
            });
        }
    }catch(err){
        res.json(err);
    }
})

router.post('/updatePassword', async function(req, res){ // update password with the help of existing password
    try{
        const User = await pool.query(
            "SELECT * FROM student WHERE userId=$1",
            [req.body.userId]
        );
        if(User.rowCount === 0) { // if user with given id do not exist
            res.json("User Not Found");
        }
        else{
            bcrypt.compare(req.body.passw, User.rows[0].passw, function(err, result) {
                if(!err){
                    if(result){
                        bcrypt.hash(req.body.newpassw, saltRounds, async function(err, hash) {
                            if(hash){
                                await pool.query(
                                    "UPDATE student SET passw=$1 WHERE userId=$2",
                                    [hash, req.body.userId]
                                );
                                res.json("Success");
                            }
                            else{
                                res.json(err);
                            }
                        });
                    }
                    else{
                        res.json("Incorrect Password");
                    }
                }
                else{
                    res.json(err);
                }
            });
        }
    }catch(err){
        res.json(err);
    }
})

// forgot password 
// https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
    },
});


router.post("/resetPassword", async (req, res) => {
    try{
        const User = await pool.query(
            "SELECT * FROM student WHERE userId=$1",
            [req.body.userId]
        );
        if(User.rowCount === 0) { // if user with given id do not exist
            res.json("User Not Found");
        }
        else{
            var newpassw = generator.generate({
                length: 10,
                numbers: true
            });
            bcrypt.hash(newpassw, saltRounds, async function(err, hash) {
                if(hash){

                    await pool.query(
                        "UPDATE student SET passw=$1 WHERE userId=$2",
                        [hash, req.body.userId]
                    );

                    const message = `Your new password is ${newpassw}, login using this and immediately update it using update password functionality in your student settings`

                    let mailOptions = {
                        from: "registationcourselnmiit@gmail.com",
                        to: `${req.body.userId}@lnmiit.ac.in`,
                        subject: 'LNMIIT Course Registartion Portal Password Reset',
                        text: message
                    };

                    transporter.sendMail(mailOptions, function(err, data) {
                        if (err) {
                            res.json(err);
                        } 
                        else {
                            res.json("success");
                        }
                    });
                }
                else{
                    res.json(err);
                }
            })
        }
    }
    catch(err){
        res.json(err);
    }
})
 
router.post("/delete", async (req, res) => {
    try{
        await pool.query(
            "delete from courseEnrollment where student_id=$1;",
            [req.body.userId]
        )
        await pool.query(
            "delete from student where userid=$1;",
            [req.body.userId]
        )
        res.json("success");
    }catch(err){
        res.json(err);
    }
})

router.post("/update", async (req, res) => {
    try{
        await pool.query(
            "update student set name=$2, joining_year=$3, student_dob=$4, branch=$5 where userid=$1;",
            [req.body.userId, req.body.name, req.body.joining_year , req.body.Student_DOB, 
                req.body.Branch]
        )
        res.json("success");
    }catch(err){
        res.json(err);
    }
})

router.post("/getStudentsByBranch", async (req, res) => {
    try{
        const data = await pool.query(
            "select userId, name, joining_year, Student_DOB from student where branch=$1;",
            [req.body.Branch]
        )
        res.json(data.rows);
    }catch(err){
        res.json(err);
    }
})

router.post("/getStudentsByYear", async (req, res) => {
    try{
        const data = await pool.query(
            "select userid, name, student_dob, Branch from student where joining_year=$1;",
            [req.body.joining_year]
        )
        res.json(data.rows);
    }catch(err){
        res.json(err);
    }
})

router.post("/getStudentsByBranchAndYear", async (req, res) => {
    try{
        const data = await pool.query(
            "select userid, name, student_dob from student where branch=$1 and joining_year=$2;",
            [req.body.Branch, req.body.joining_year]
        )
        res.json(data.rows);
    }catch(err){
        res.json(err);
    }
})

module.exports = router;

