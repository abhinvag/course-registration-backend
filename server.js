const express = require('express');
const cors = require('cors');
require('dotenv').config();
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const loginRoutes = require('./routes/loginRoutes');

const app = express();

app.use(cors());
app.use(express.json());

//routes

app.use('/student', studentRoutes);

app.use('/admin', adminRoutes);

app.use('/course', courseRoutes);

app.use('/login', loginRoutes);

app.get("/", (req, res) => {
    res.send("Course Registration API");
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server Started in " + process.env.NODE_ENV +  " mode Successfully on " + port);
});