const express = require('express');
const app = express();

const path = require('path');


const bodyParser = require('body-parser'); // this is an installed package (npm install --save body-parser) to read body text in post requests
app.use(bodyParser.json());





//apis
const api_admin = express.Router();
app.use('/api/admin', api_admin);

const admin_js = require('./backend/api/admin.js');
admin_js.db_routing(api_admin);
admin_js.login_routing(api_admin);


const api_public = express.Router();
app.use('/api/public', api_public);

const public_js = require('./backend/api/public.js');
public_js.routing(api_public);






//static
app.use(express.static(path.join(__dirname, 'frontend/static')));

app.use(express.static(path.join(__dirname, 'frontend/views/'))); //for admin stuff
app.all("/admin*", function(req, res, next) {
	res.sendFile(path.join(__dirname, 'frontend/views/admin/index.html'))
});


app.use(express.static(path.join(__dirname, 'frontend/views/public')));
app.all("*", function(req, res, next) {
	//exclude api routes
	if (!req.path.includes('/api/')) {
		res.sendFile(path.join(__dirname, 'frontend/views/public/index.html'))
	}
	
});




const { Pool, Client } = require('pg')
var connectionString = "postgres://xqfejbmovmcger:43150b88f6939c50ed733a25187d127d1a1b74a04b6531ac41b66158c7ad5f43@ec2-174-129-192-200.compute-1.amazonaws.com:5432/d36rhr4o68ln8e"
const pool = new Pool({
  connectionString: connectionString,
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})
console.log("PG WORKING")




app.listen(process.env.PORT || 3000, () => console.log('Running on port 3000'))