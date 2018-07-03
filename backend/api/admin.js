const admin_interface = require('../database/admin_interface_pg.js');

const multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'frontend/static/public/images/uploads')
  },
  filename: function (req, file, cb) {
  	let name = Math.floor(Math.random() * 100) + '-' + Date.now()
  	if (file.mimetype == "image/jpeg") name += '.jpg'
    cb(null, name)
  }
})
var upload = multer({ storage: storage })



const jwt = require('jsonwebtoken');





function checkNulls(req, keys) {
	let data = [];
	for (var k of keys) {
		if (req.body[k] == null || req.body[k] == undefined) return data;
		data.push(req.body[k]);
	}
	return data;
}





function validateToken(req, res, next) {
	if (req.path == '/login' || req.path == '/images') return next();

	if (!req.headers.authorization) return res.status(301).send('/admin/login')
	
	let token = req.headers.authorization.split(' ')[1];
	let payload;
	try {
		payload = jwt.verify(token, 'randomhash');
	} catch (error) {
		return res.status(301).send('/admin/login')
	}
	
	next();
}



module.exports = {
	db_routing: function(app) {


		app.all('*', validateToken);


		/* --------------------- ---- ------------------------------ */
		/* --------------------- SHOW ------------------------------ */
		/* --------------------- ---- ------------------------------ */
		//name, description, image_thumbnail, image_banner, frequency, featured, cb
		app.post('/add_show', (req, res)=>{
			let params = ['name', 'description', 'image_thumbnail', 'image_banner', 'featured', 'stream', 'tracks', 'tags', 'residents'];
			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			} 

			admin_interface.add_show(...data, (status, data=null)=>{
				res.status(status).json({
					item_id:data,
					item_type:'show_id'
				})
			})
		});

		//show_id, name, description, image_thumbnail, image_banner, frequency, featured, cb
		app.post('/edit_show', (req, res)=>{
			let params = ['show_id','name', 'description', 'image_thumbnail', 'image_banner', 'featured', 'stream', 'tracks', 'tags', 'residents'];
			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.edit_show(...data, (status)=>{
				res.status(status).send();
			})
		});

		app.post('/delete_show', (req, res)=>{
			let params = ['show_id'];
			let data = checkNulls(req, params)
						if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.delete_show(...data, (status)=>{
				res.status(status).send();
			})
		});


		/* --------------------- ---- ------------------------------ */
		/* --------------------- RESIDENTS ------------------------- */
		/* --------------------- ---- ------------------------------ */
		//name, description, image_thumbnail, image_banner, guest, shows, cb
		app.post('/add_resident', (req, res)=> {
			let params = ['name', 'description', 'image_thumbnail', 'image_banner', 'guest', 'shows'];
			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.add_resident(...data, (status, data=null)=>{
				res.status(status).json({
					item_id:data,
					item_type:'resident_id'
				})
			})
		})

		app.post('/edit_resident', (req, res)=> {
			let params = ['resident_id', 'name', 'description', 'image_thumbnail', 'image_banner', 'guest', 'shows'];
			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.edit_resident(...data, (status)=>{
				res.status(status).send();
			})
		})

		app.post('/delete_resident', (req, res)=> {
			let params = ['resident_id'];
			let data = checkNulls(req, params)


			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.delete_resident(...data, (status)=>{
				res.status(status).send();
			})
		})


		/* --------------------- ---- ------------------------------ */
		/* --------------------- EVENTS ------------------------- */
		/* --------------------- ---- ------------------------------ */
		//name, image_thumbnail, date, url, cb
		app.post('/add_event', (req, res)=> {
			let params = ['name', 'image_thumbnail', 'date', 'url'];
			let data = checkNulls(req, params)
			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.add_event(...data, (status, data=null)=>{
				res.status(status).json({
					item_id:data,
					item_type:'event_id'
				})
			})
		})

		app.post('/edit_event', (req, res)=> {
			let params = ['event_id', 'name', 'image_thumbnail', 'date', 'url'];
			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.edit_event(...data, (status)=>{
				res.status(status).send();
			})
		})

		app.post('/delete_event', (req, res)=> {
			let params = ['event_id'];
			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.delete_event(...data, (status)=>{
				res.status(status).send();
			})
		})



		/* --------------------- ---- ------------------------------ */
		/* --------------------- BANNERS ------------------------- */
		/* --------------------- ---- ------------------------------ */
		//banner_id, name, description, image_banner, url, cb
		app.post('/add_banner', (req, res)=> {
			let params = ['name', 'description', 'image_banner', 'url'];
			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.add_banner(...data, (status, data=null)=>{
				res.status(status).json({
					item_id:data,
					item_type:'banner_id'
				})
			})
		})

		app.post('/edit_banner', (req, res)=> {
			let params = ['banner_id', 'name', 'description', 'image_banner', 'url'];
			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.edit_banner(...data, (status)=>{
				res.status(status).send();
			})
		})

		app.post('/delete_banner', (req, res)=> {
			let params = ['banner_id'];
			let data = checkNulls(req, params)


			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.delete_banner(...data, (status)=>{
				res.status(status).send();
			})
		})


		/* --------------------- ---- ------------------------------ */
		/* --------------------- SCHEDULE ------------------------- */
		/* --------------------- ---- ------------------------------ */
		app.post('/add_schedule', (req, res)=> {
			let show_id = req.body['shows'][req.body['shows'].length - 1];
			if (show_id != undefined) {
				req.body['show_id'] = show_id.show_id;
			}
			let params = ['show_id', 'date', 'time'];

			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}
			
			admin_interface.add_schedule(...data, (status, data=null)=>{
				res.status(status).json({
					item_id:data,
					item_type:'schedule_id'
				})
			})
		})

		app.post('/edit_schedule', (req, res)=> {

			let show_id = req.body['shows'][req.body['shows'].length - 1];
			if (show_id != undefined) {
				req.body['show_id'] = show_id.show_id;
			}
			let params = ['schedule_id', 'show_id', 'date', 'time'];

			let data = checkNulls(req, params)

			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.edit_schedule(...data, (status, data=null)=>{
				res.status(status).json({
					item_id:data,
					item_type:'schedule_id'
				})
			})
		})

		app.post('/delete_schedule', (req, res)=> {
			let params = ['schedule_id'];
			let data = checkNulls(req, params)


			if (data.length < params.length) {
				res.json({'missingdata':params[data.length]});
				return;
			}

			admin_interface.delete_schedule(...data, (status)=>{
				res.status(status).send();
			})
		})


		/* --------------------- ---- ------------------------------ */
		/* --------------------- IMAGES ------------------------- */
		/* --------------------- ---- ------------------------------ */
		//image_id, imagename, cb
		app.post('/add_image', upload.single('image'), (req, res)=> {
			let image_id = req.file.filename // new name
			let imagename = req.file.originalname
			admin_interface.add_image(image_id, imagename, (status)=>{
				res.status(status).json({
					image_id:image_id,
					imagename:imagename
				});
			})
		})


		app.get('/images', (req, res)=> {
			admin_interface.get_images((rows)=>{res.json({items:rows})})
		})

	},


	login_routing: function(app) {
		app.post('/login', (req, res)=> {
			
			if (req.body.username == "admin" && req.body.password == "admin") {
				let token = jwt.sign(req.body.username, 'randomhash');
				
				res.json({
					'token':token
				})
			} else {
				res.json({
					'token':null
				})
			}

		});

		app.post('/logout', (req, res)=> {
			token = null;
			res.status(200).send();
		});
	}
}