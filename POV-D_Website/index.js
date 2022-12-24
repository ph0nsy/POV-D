/**
 * 
 * 
 */
const express = require('express');
//const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 9001;

/**
 * 
 * 
 */
 app.use(express.static(path.join(__dirname, 'public')));

/**
 * 
 * 
 */
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

/**
 * 
 * 
 */
 app.listen(port, () => {
    console.log('Application listening on port 9001!');
});

/**
 * 
 * 
const userSchema = mongoose.Schema({
     userName: { type: String, unique: true,required: true },
     password: { type: String, required: true },
     firstName: { type: String, required: true }, 
     lastName: { type: String, required: true }
})

 */