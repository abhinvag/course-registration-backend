const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

let router = express.Router();
const saltRounds = 10;

router.get("/list", async (req, res) => { // list of all the entries in login table
    try {
      const logininfo = await pool.query("SELECT * FROM login");
      res.json(logininfo.rows);
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
                        "INSERT INTO login VALUES ($1, $2, $3);",
                        [req.body.usertype, req.body.userId, hash]
                    );
                    res.json("Success");
                }
                catch(err){
                    console.log(err);
                }
            }
            else{
                console.log(err);
            }
        });
    }catch(err){
        console.log(err);
    }
})

router.post('/verify', async function(req, res){ // verify password
    try{
        const User = await pool.query(
            "SELECT * FROM login WHERE userId=$1",
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
                }
            });
        }
    }catch(err){
        console.log(err);
    }
})

router.post('/updatePassword', async function(req, res){
    try{
        const User = await pool.query(
            "SELECT * FROM login WHERE userId=$1",
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
                                    "UPDATE login SET passw=$1 WHERE userId=$2",
                                    [hash, req.body.userId]
                                );
                                res.json("Success");
                            }
                            else{
                                console.log(err);
                            }
                        });
                    }
                    else{
                        res.json("Incorrect Password");
                    }
                }
                else{
                    console.log(err);
                }
            });
        }
    }catch(err){
        console.log(err);
    }
})

module.exports = router;