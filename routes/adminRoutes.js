const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

let router = express.Router();
const saltRounds = 10;

router.get("/list", async (req, res) => { // list of all the entries in admin table
    try {
      const admininfo = await pool.query("SELECT * FROM admin");
      res.json(admininfo.rows);
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
                        "INSERT INTO admin VALUES ($1, $2, $3, $4);",
                        [req.body.userId, req.body.name, req.body.DOB ,hash]
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

router.post('/verify', async function(req, res){ // verify password
    try{
        const User = await pool.query(
            "SELECT * FROM admin WHERE userId=$1",
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
                            userId : User.rows[0].userid,
                            name : User.rows[0].name
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

module.exports = router;