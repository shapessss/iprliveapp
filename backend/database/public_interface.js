//get banners

//get shows

//get residents

//get guests

//get events
const sqlite3 = require('sqlite3').verbose();


//read only 
function getdatabase(cb) {
	let db = new sqlite3.Database('./database/radio.db', sqlite3.OPEN_READONLY, (err) => {
	  if (err) {
	    console.error(err.message);
	  }
	  console.log('Connected to the radio database.');
	  cb(db);
	});
}


function closedatabase(db) {
	// close the database connection
	db.close((err) => {
	  if (err) {
	    return console.error(err.message);
	  }
	  console.log('Close the database connection.');
	});
}







//get residents
//get shows of each resident
function get_residents(cb) {
	getdatabase((db) => {
		db.all("SELECT * FROM RESIDENTS", (err, rows) => {
			if (err) console.log(err);	

			let num_rows = rows.length;
			let index = 0;

			if (num_rows == 0) {
				cb(rows);
				closedatabase(db);
			}

			for (var r of rows) {
				get_shows_2(r, ()=> {
					index += 1;
					if (index >= num_rows) {
						cb(rows);
						closedatabase(db);
					}
				})
			}
		});	


		function get_shows_2(r, done) {
			let show_sql = 'SELECT * FROM SHOW_RESIDENT_RELATIONSHIPS WHERE resident_id = ?'

			db.all(show_sql, [r.resident_id], (err, rows)=> {
				if (rows.length == 0) {
					r.shows = [];
					done();
					return;
				}
				get_list_of_shows(rows, (shows)=>{
					r.shows = shows;
					done();
				});
			})

		}	

		function get_list_of_shows(shows, cb) {
	
			let max = shows.length;
			let data = [];

			for (var r of shows) {
				db.get('SELECT * FROM SHOWS WHERE show_id = ?', [r.show_id], (err, row)=> {
					data.push(row);

					if (data.length == max) {
						cb(data);
					}
				})
			}
		}
	})
}





//get individual resident
//shows
function get_resident_by_id(resident_id, cb) {
	getdatabase((db)=> {
		let resident = null;
		let shows = [];
		let sql = 'SELECT * FROM RESIDENTS WHERE resident_id = ?';

		let showsDone = false;
		

		db.get(sql, [resident_id], (err, row)=> {

			resident = row;
			if (resident == undefined) cb([])
			if (showsDone) {
				resident.shows = shows;
				cb(resident);
			}

		})

		db.all('SELECT * FROM SHOW_RESIDENT_RELATIONSHIPS WHERE resident_id = ?', [resident_id], (err, rows)=> {
			let index = 0;
			if (rows.length == 0) cb([])
			let max = rows.length;
			
			for (var r of rows) {
				get_show(r, (row)=> {
					shows.push(row);
					index += 1;

					if (index >= max) {
						showsDone = true;
						if (show != null) {
							//both done
							resident.shows = shows;
							cb(resident);
						}
					}
				})
			}
		})

		function get_show(r, done) {
			db.get("SELECT * FROM SHOWS WHERE show_id = ?", [r.show_id], (err, row)=> {
				done(row);
			})
		}
	})
}





//new functions

//get banners from database
function get_banners(cb) {
	getdatabase((db) => {
		db.all("SELECT * FROM BANNERS", (err, rows) => {
			if (err) console.log(err);				
			cb(rows);
			closedatabase(db);
		});
	})
}


//get events from database
function get_events(cb) {
	getdatabase((db) => {
		db.all("SELECT * FROM EVENTS", (err, rows) => {
			if (err) console.log(err);				
			cb(rows);
			closedatabase(db);
		});
	})
}


function get_latest_shows(cb) {
	getdatabase((db)=> {
		db.all("SELECT * FROM SHOWS ORDER BY date(date) DESC LIMIT 9", [], (err, rows)=> {
			get_shows(rows, db, cb);
		})
	});
}

function get_featured_shows(cb) {
	getdatabase((db)=> {
		db.all("SELECT * FROM SHOWS WHERE featured = 1 LIMIT 9", [], (err, rows)=> {
			get_shows(rows, db, cb);
		})
	});
}

function get_tagged_shows(tag, cb) {
	getdatabase((db)=> {
		db.all("SELECT * FROM TAGS WHERE tag = ?", [tag], (err, rows)=> {
			get_shows(rows, db, cb);
		})
	});
}

function get_individual_show(show_id, cb) {
	getdatabase((db)=> {
		db.all("SELECT * FROM SHOWS WHERE show_id = ?", [show_id], (err, rows)=> {
			get_shows(rows, db, cb);
		})
	});
}

function get_all_shows(cb) {
	getdatabase((db)=> {
		db.all("SELECT * FROM SHOWS", (err, rows)=> {
			get_shows(rows, db, cb);
		})
	});
}




function get_tags_by_show(show_id, db, cb) {
	db.all("SELECT * FROM TAGS WHERE show_id = ?", [show_id], (err, rows)=> {
		if (rows == undefined) return cb([]);
		//rows only returns dict if length 1

		cb(rows);
	});
}

function get_residents_by_show(show_id, db, cb) {


	db.all("SELECT * FROM SHOW_RESIDENT_RELATIONSHIPS WHERE show_id = ?", [show_id], (err, rows)=> {
		//for each resident get more info
		let current = 0;
		let total = rows.length;
		if (current == total) return cb([]);
		let residents = [];
		for (let resident_id of rows) {
			db.get("SELECT * FROM RESIDENTS WHERE resident_id = ?", [resident_id], (err, rows) => {
				if (!err) {
					residents.push(rows);
				}
				current += 1;
				if (current >= total) {
					cb(residents);
				}
			
			})
		}
	});
}

function get_tracks_by_show(show_id, db, cb) {
	db.all("SELECT * FROM TRACKS WHERE show_id = ?", [show_id], (err, rows) => {
		
		cb(rows);
	});
}


//get shows
function get_shows(show_list, db, cb) {
	//get any shows in list
	//list is dictated by latest/tags/featured/individual etc
	//for each show
	//get tags
	//get residents
	//get tracks
	let current_complete = 0;
	let total = show_list != undefined ? show_list.length : 0;
	for (let show of show_list) {
		//get tags
		get_tags_by_show(show.show_id, db, (res)=> {
			show.tags = res;
			console.log('tags')
			if (show.residents != null && show.tracks != null) {
				current_complete += 1;
				if (current_complete >= total) {
					cb(show_list);
				}
			}
		});
		get_residents_by_show(show.show_id, db, (res)=> {
			show.residents = res;
			console.log('res')
			if (show.tags != null && show.tracks != null) {
				current_complete += 1;
				if (current_complete >= total) {
					cb(show_list);
				}
			}
		});
		get_tracks_by_show(show.show_id, db, (res)=> {
			show.tracks = res;
			console.log('trac')
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






module.exports = {
	get_banners : function(cb) {get_banners(cb)},
	get_events : function(cb) {get_events(cb)},
	
	get_residents : function(cb) {get_residents(cb)},
	get_resident_by_id : function(resident_id, cb) {get_resident_by_id(resident_id, cb)},


	//new shows
	get_latest_shows: function(cb) {get_latest_shows(cb)},
	get_featured_shows: function(cb) {get_featured_shows(cb)},
	get_tagged_shows: function(tag, cb) {get_tagged_shows(tag, cb)},
	get_individual_show: function(show_id, cb) {get_individual_show(show_id, cb)},
	get_all_shows: function(cb) {get_all_shows(cb)}
}