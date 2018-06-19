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
			let shows = [];
			let current = 0;
			let maximum = rows.length;
			if (maximum == current) {
				get_shows([], db, cb);
			}
			for (let row of rows) {
				db.get("SELECT * FROM SHOWS WHERE show_id = ?", [row.show_id], (err, result) => {
					shows.push(result);
					current += 1;
					if (maximum == current) {
						get_shows(shows, db, cb);
					}
				})
			}
			
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
	if (show_list.length == 0) return cb([])
	for (let show of show_list) {
		//get tags
		get_tags_by_show(show.show_id, db, (res)=> {
			show.tags = res;
			if (show.residents != null && show.tracks != null) {
				current_complete += 1;
				if (current_complete >= total) {
					cb(show_list);
					closedatabase(db);
				}
			}
		});
		get_residents_by_show(show.show_id, db, (res)=> {
			show.residents = res;
			if (show.tags != null && show.tracks != null) {
				current_complete += 1;
				if (current_complete >= total) {
					cb(show_list);
					closedatabase(db);
				}
			}
		});
		get_tracks_by_show(show.show_id, db, (res)=> {
			show.tracks = res;
			if (show.tags != null && show.residents != null) {
				current_complete += 1;
				if (current_complete >= total) {
					cb(show_list);
					closedatabase(db);
				}
			}
		});
		
	}


	//cb(show_list);
}



function get_all_residents(cb) {
	getdatabase((db)=> {
		db.all("SELECT * FROM RESIDENTS", (err, rows) => {
			get_residents(rows, db, cb);
		});
	});
}

function get_individual_resident(resident_id, cb) {
	getdatabase((db)=> {
		db.all("SELECT * FROM RESIDENTS WHERE resident_id = ?", [resident_id], (err, rows)=> {
			get_residents(rows, db, cb);
		});
	});
}

function get_residents(resident_list, db, cb) {
	let current = 0;
	let maximum = resident_list.length;
	if (current == maximum) return cb([]);

	for (let resident of resident_list) {
		//for each resident get shows
		get_show_by_residents(resident.resident_id, db, (shows)=> {
			resident.shows = shows;
			current += 1;
			if (current >= maximum) {
				cb(resident_list);
				closedatabase(db);
			}
		})
	}
}


function get_show_by_residents(resident_id, db, cb) {
	let shows = [];
	db.all("SELECT * FROM SHOW_RESIDENT_RELATIONSHIPS WHERE resident_id = ?", [resident_id], (err, rows)=> {
		let current = 0;
		let maximum = rows.length;
		if (maximum == current) return cb(shows);
		for (let show of rows) {
			db.get("SELECT * FROM SHOWS WHERE show_id = ?", [show.show_id], (err, row) => {
				shows.push(row);
				current += 1;
				if (current == maximum) {
					return cb(shows);
				}
			})
		}
	})
}


module.exports = {
	get_banners : function(cb) {get_banners(cb)},
	get_events : function(cb) {get_events(cb)},

	//new shows
	get_latest_shows: function(cb) {get_latest_shows(cb)},
	get_featured_shows: function(cb) {get_featured_shows(cb)},
	get_tagged_shows: function(tag, cb) {get_tagged_shows(tag, cb)},
	get_individual_show: function(show_id, cb) {get_individual_show(show_id, cb)},
	get_all_shows: function(cb) {get_all_shows(cb)},

	get_all_residents: function(cb) {get_all_residents(cb)},
	get_individual_resident: function(resident_id, cb) {get_individual_resident(resident_id, cb)}
}