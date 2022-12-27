/**
 * 
 * 
 */
const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');    
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const port = 9001;

/**
 * 
 * 
 */
router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/public/index.html'));
});

router.get('/about',function(req,res){
    res.sendFile(path.join(__dirname+'/public/html/about.html'));
});

router.get('/correct',function(req,res){
    res.sendFile(path.join(__dirname+'/public/html/correct.html'));
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'), router);
app.listen(port, () => {
    console.log('Application listening on port 9001!');
});

/**
 * 
 * 
 */
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

/**
 * 
 * 
 */
db.connect((error) => {
  if(error) {
      console.log(error)
  } else {
      console.log("MySQL connected!")
  }
})


app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query('SELECT COUNT(username) FROM users WHERE username = ? AND password = ? LIMIT 0,1', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
            results = JSON.stringify(results)
			// If the account exists
			if (results[20] == '1') {
				// Redirect to home page
				response.redirect('/correct');
			} else {
				response.send('Usuario incorrecto.');
                //alert('Usuario incorrecto');
			}			
			response.end();
		});
	} else {
		response.send('Rellene todos los campos.');
		response.end();
	}
});


app.post('/change', function(request, response){
		const jsonString = fs.readFileSync(__dirname+"/public/assets/GI.json");
		let GlycIdx = JSON.parse(jsonString);
		// Capture the input fields
		let nombre = request.body.nombre;
		let indiceGlucemico = request.body.indiceGlucemico;
		// Ensure the input fields exists and are not empty
		if (nombre && indiceGlucemico) {
			for (var i=0; i<GlycIdx.length; i++) {
				if (GlycIdx[i].nombre.toLowerCase()  == nombre.toLowerCase()) {
					GlycIdx[i].indiceGlucemico = indiceGlucemico;
					break;
				}
				else if (i+1 == GlycIdx.length){
					GlycIdx.push({'nombre':nombre,'indiceGlucemico':indiceGlucemico})
					break;
				}
			}
			GlycIdx = JSON.stringify(GlycIdx);
			fs.writeFileSync(__dirname+"/public/assets/GI.json", GlycIdx, "utf-8");
		}
		response.redirect('/correct');
		response.end();
});

