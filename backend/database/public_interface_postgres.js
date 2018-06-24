const { Pool, Client } = require('pg')
//var connectionString = 'postgres://postgres:PASSWORD@localhost:5432/radio'
var connectionString = "postgres://xqfejbmovmcger:43150b88f6939c50ed733a25187d127d1a1b74a04b6531ac41b66158c7ad5f43@ec2-174-129-192-200.compute-1.amazonaws.com:5432/d36rhr4o68ln8e"
const pool = new Pool({
  connectionString: connectionString,
})


/*
pool.connect((err, client, done) => {
		if (err) throw err;

	});

*/


//get banners from database
function get_banners(cb) {
	pool.query("SELECT * FROM BANNERS", (err, res) => {
		if (err) cb([]);

		cb(res.rows);
	})
}


//get events from database
function get_events(cb) {
	pool.query("SELECT * FROM EVENTS ORDER BY DATE DESC", (err, res) => {
		if (err) return cb([]);

		cb(res.rows);
	})
}


function get_schedules(cb) {
	pool.connect((err, client, done) => {
		if (err) {
			done();
			return cb([]);
		}
		client.query("SELECT * FROM SCHEDULE ORDER BY DATE DESC", (err, res)=> {
			if (err) {
				done();
				return cb([]);
			}
			let rows = res.rows;
			let current = 0;
			for (let r of rows) {
				client.query("SELECT name FROM SHOWS WHERE show_id = $1", [r.show_id], (err, res)=> {
					current += 1;
					r.show_name = res.rows[0]['name'];
					r.shows = [{show_id: r.show_id}]
					let date = r['date'].getDate() + "-" + r['date'].getMonth() + "-" + r['date'].getFullYear()
					r['name'] = r.show_name + " playing " + date

					if (current == rows.length) {
						done();
						cb(rows);
					}
				})

			}


			
			
		})
	})
	
}



function get_latest_shows(cb) {
	pool.query("SELECT * FROM SHOWS ORDER BY date DESC LIMIT 9", (err, rows) => {
		if (err) return cb([]);

		get_shows(rows.rows, cb);
	})
}


function get_featured_shows(cb) {
	pool.query("SELECT * FROM SHOWS WHERE FEATURED = TRUE ORDER BY DATE DESC", (err, rows) => {
		if (err) return cb([]);

		get_shows(rows.rows, cb);
	})
}


function get_individual_show(show_id, cb) {
	pool.query("SELECT * FROM SHOWS WHERE show_id = $1", [show_id], (err, rows) => {
		if (err) return cb([]);

		get_shows(rows.rows, cb);
	})
}


function get_all_shows(cb) {
	pool.query("SELECT * FROM SHOWS ORDER BY date DESC", (err, rows) => {
		if (err) return cb([]);
		get_shows(rows.rows, cb);
	})
}


//gets all shows with a certain tag
function get_tagged_shows(tag, cb) {
	pool.connect((err, client, done) => {
		if (err) return done();

		client.query("SELECT * FROM TAGS WHERE tag = $1", [tag], (err, res)=> {
			if (err) return done();
			let shows = [];
			let current = 0;
			let rows = res.rows;
			let maximum = rows.length;
			if (maximum == current) {
				get_shows([], cb);
				done();
			}
			

			for (let row of rows) {
				client.query("SELECT * FROM SHOWS WHERE show_id = $1", [row.show_id], (err, result) => {
					shows.push(result.rows[0]);
					
					current += 1;
					if (maximum == current) {
						get_shows(shows, cb);
						done();
					}
				})
			}


			
		})

	});
}





///relational functions, e.g. tags by show, tracks by show , do residents by show later in residents function
function get_tags_by_show(show_id, cb) {
	pool.query("SELECT * FROM TAGS WHERE show_id = $1", [show_id], (err, rows) => {
		if (err) return cb([]);


		cb(rows.rows);
	})
}


function get_tracks_by_show(show_id, cb) {
	pool.query("SELECT * FROM TRACKS WHERE show_id = $1", [show_id], (err, rows) => {
		if (err) return cb([]);


		cb(rows.rows);
	})
}


function get_residents_by_show(show_id, cb) {
	//get all residents with showid relation
	pool.connect((err, client, done) => {
		if (err) return done();
		client.query("SELECT * FROM SHOW_RESIDENT_RELATIONSHIPS WHERE show_id = $1", [show_id], (err, res) => {
			if (err) return done();
			
			let current = 0;
			let rows = res.rows;
			let total = rows.length;
			if (current == total) {
				done();
				return cb([]);
			}
			let residents = [];
			for (let r of rows) {
				client.query("SELECT * FROM RESIDENTS WHERE resident_id = $1", [r.resident_id], (err, res2) => {
					let rows2 = res2.rows[0];
					if (!err) {
						residents.push(rows2);
					}
					current += 1;
					if (current >= total) {
						cb(residents);
						done();
						
					}
				
				})
			}
			
		})
	});
}



//get shows
function get_shows(show_list, cb) {
	//get any shows in list
	//list is dictated by latest/tags/featured/individual etc
	//for each show
	//get tags
	//get residents
	//get tracks
	let current_complete = 0;
	let total = show_list != undefined ? show_list.length : 0;
	if (show_list.length == 0) return cb([]);




	for (let show of show_list) {
		//get tags
		get_tags_by_show(show.show_id, (res)=> {
			show.tags = res;
			if (show.residents != null && show.tracks != null) {
				current_complete += 1;
				if (current_complete >= total) {
					cb(show_list);
					
				}
			}
		});

		
		get_residents_by_show(show.show_id, (res)=> {
			show.residents = res;
			if (show.tags != null && show.tracks != null) {
				current_complete += 1;
				if (current_complete >= total) {
					cb(show_list);
					
				}
			}
		});
		
		
		get_tracks_by_show(show.show_id, (res)=> {
			show.tracks = res;
			if (show.tags != null && show.residents != null) {
				current_complete += 1;
				if (current_complete >= total) {
					cb(show_list);
					
				}
			}
		});
		
	}


	//cb(show_list);
}




/* RESIDENTS */
function get_individual_resident(resident_id, cb) {
	pool.query("SELECT * FROM RESIDENTS WHERE resident_id = $1", [resident_id], (err, rows) => {
		if (err) throw err;

		get_residents(rows.rows, cb);
	})
}


function get_all_residents(cb) {
	pool.query("SELECT * FROM RESIDENTS", (err, rows) => {
		if (err) throw err;

		get_residents(rows.rows, cb);
	})
}




function get_residents(resident_list, cb) {
	let current = 0;
	let maximum = resident_list.length;
	if (current == maximum) return cb([]);

	for (let resident of resident_list) {
		//for each resident get shows
		get_show_by_residents(resident.resident_id, (shows)=> {
			resident.shows = shows;
			current += 1;
			if (current >= maximum) {
				cb(resident_list);
				
			}
		})
	}
}


function get_show_by_residents(resident_id, cb) {
	pool.connect((err, client, done) => {
		if (err) return done();

		client.query("SELECT * FROM SHOW_RESIDENT_RELATIONSHIPS WHERE resident_id = $1", [resident_id], (err, res) => {
			if (err) return done();;
			
			let rows = res.rows;
			let current = 0;
			let total = rows.length;
			if (current == total) return cb([]);
			let shows = [];
			for (let r of rows) {
				client.query("SELECT * FROM SHOWS WHERE show_id = $1", [r.show_id], (err, res) => {
					if (!err) {
						shows.push(res.rows[0]);
					}
					
					current += 1;
					if (current >= total) {
						get_shows(shows, cb); 
						done();
					}
				
				})
			}
			if (current >= total) {
				get_shows(shows, cb); 
				done();
			}
		})
	})
}



module.exports = {
	get_banners : function(cb) {get_banners(cb)},
	get_events : function(cb) {get_events(cb)},
	get_schedules : function(cb) {get_schedules(cb)}, 

	//new shows
	get_latest_shows: function(cb) {get_latest_shows(cb)},
	get_featured_shows: function(cb) {get_featured_shows(cb)},
	get_tagged_shows: function(tag, cb) {get_tagged_shows(tag, cb)},
	get_individual_show: function(show_id, cb) {get_individual_show(show_id, cb)},
	get_all_shows: function(cb) {get_all_shows(cb)},

	get_all_residents: function(cb) {get_all_residents(cb)},
	get_individual_resident: function(resident_id, cb) {get_individual_resident(resident_id, cb)}
}