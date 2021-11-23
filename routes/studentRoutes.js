const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const generator = require('generate-password');
const nodemailer = require('nodemailer');
require("dotenv").config();

let router = express.Router();
const saltRounds = 10;

router.get("/list", async (req, res) => { // list of all the entries in student table
    try {
      const studentinfo = await pool.query("SELECT * FROM student");
      res.json(studentinfo.rows);
    } catch (err) {
      console.error(err.message);
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
                    console.log(err);
                    res.json("error");
                }
            }
            else{
                console.log(err);
                res.json("error");
            }
        });
    }catch(err){
        console.log(err);
        res.json("error");
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
                    res.json(result); // returns true if password matches
                }
                else{
                    console.log(err);
                    res.json("Incorrect Password");
                }
            });
        }
    }catch(err){
        console.log(err);
        res.json("error");
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
                                res.json("Error");
                                console.log(err);
                            }
                        });
                    }
                    else{
                        res.json("Incorrect Password");
                    }
                }
                else{
                    res.json("Error");
                    console.log(err);
                }
            });
        }
    }catch(err){
        res.json("Error");
        console.log(err);
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
                            console.log(err);
                            res.json("error")
                        } 
                        else {
                            res.json("success");
                        }
                    });
                }
                else{
                    res.json("Error");
                    console.log(err);
                }
            })
        }
    }
    catch(err){
        console.log(err);
        res.json("error");
    }
})

module.exports = router;

