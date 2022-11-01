/**
 * 
 * 
 */
const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

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
    console.log('Application listening on port 8080!');
});