//same as db for now, do logic and filtering on client side

const public_interface = require('../database/public_interface.js');


module.exports = {
	routing: function(app) {
		app.get('/banners', (req, res)=>{
			public_interface.get_banners((rows)=>{
				res.json({"items":rows})
			})
		});


		app.get('/shows', (req, res)=>{
			public_interface.get_all_shows((rows)=>{
				res.json({"items":rows})
			})
		});

		app.get('/show', (req, res)=>{
			public_interface.get_individual_show(req.query.show_id, (rows)=>{
				res.json({"items":rows})
			})
		});



		app.get('/residents', (req, res)=>{
			public_interface.get_residents((rows)=>{
				res.json({"items":rows})
			})
		});



		app.get('/events', (req, res)=>{
			public_interface.get_events((rows)=>{
				res.json({"items":rows})
			})
		});


		



		app.get('/resident', (req, res)=>{
			public_interface.get_resident_by_id(req.query.resident_id, (rows)=>{
				res.json({"items":rows})
			})
		});




		app.get('/ii', (req, res)=>{
			console.log("ii")
			public_interface.get_individual_show(1, (rows)=>{
				console.log(rows);
				res.json({"items":rows})
			})
		});


		
	}
}