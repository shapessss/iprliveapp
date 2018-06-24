//same as db for now, do logic and filtering on client side

const public_interface = require('../database/public_interface_postgres.js');


module.exports = {
	routing: function(app) {
		app.get('/banners', (req, res)=>{
			public_interface.get_banners((rows)=>{
				res.json({"items":rows})
			})
		});


		app.get('/shows', (req, res)=>{
			//get all shows
			public_interface.get_all_shows((rows)=>{
				res.json({"items":rows})
			})
		});

		app.get('/featured_shows', (req, res)=>{
			//get featured shows
			public_interface.get_featured_shows((rows)=>{
				res.json({"items":rows})
			})
		});

		app.get('/latest_shows', (req, res)=>{
			//get all shows
			public_interface.get_latest_shows((rows)=>{
				res.json({"items":rows})
			})
		});

		app.get('/tagged_shows', (req, res)=>{
			//get all shows
			public_interface.get_tagged_shows(req.query.tag, (rows)=>{
				res.json({"items":rows})
			})
		});

		app.get('/show', (req, res)=>{
			public_interface.get_individual_show(req.query.show_id, (rows)=>{
				res.json({"items":rows})
			})
		});



		app.get('/residents', (req, res)=>{
			public_interface.get_all_residents((rows)=>{
				res.json({"items":rows})
			})
		});

		app.get('/resident', (req, res)=>{
			public_interface.get_individual_resident(req.query.resident_id, (rows)=>{
				res.json({"items":rows})
			})
		});



		app.get('/events', (req, res)=>{
			public_interface.get_events((rows)=>{
				res.json({"items":rows})
			})
		});

		app.get('/schedules', (req, res)=>{
			public_interface.get_schedules((rows)=>{
				res.json({"items":rows})
			})
		});

	}
}