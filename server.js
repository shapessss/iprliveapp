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



app.listen(process.env.PORT || 3000, () => console.log('Running on port 3000'))