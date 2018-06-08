//add edit delete

//shows

//residents

//guests

//events

//banners

//images

//show relationship with resident

const sqlite3 = require('sqlite3').verbose();



//read write only 
function getdatabase(cb) {
	let db = new sqlite3.Database('./database/radio.db', sqlite3.OPEN_READWRITE, (err) => {
	  if (err) {
	    console.error(err.message);
	  }
	  db.get("PRAGMA foreign_keys = ON")
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




/* --------------------- ---- ------------------------------ */
/* --------------------- SHOW ------------------------------ */
/* --------------------- ---- ------------------------------ */
function add_show(name, description, image_thumbnail, image_banner, date, frequency, featured, cb, cbid) {
	//change true/false to 1/0
	if (featured == true) {
		featured = 1;
	} else {
		featured = 0;
	}


	let sql = 'INSERT INTO SHOWS(name, description, image_thumbnail, image_banner, date, frequency, featured) VALUES(?,?,?,?,?,?,?);';

	getdatabase((db) => {
		db.run(sql, [name, description, image_thumbnail, image_banner, date, frequency, featured], (err) => {
			console.log(err);
			if (err) {
				cb(409);
				closedatabase(db)
			} else {
				db.get("select last_insert_rowid();", (err, row)=> {
					cb(200, row['last_insert_rowid()']);
					cbid(row['last_insert_rowid()']);
					closedatabase(db)
				})
			}
		})
		
	});
}

function edit_show(show_id, name, description, image_thumbnail, image_banner, frequency, featured, cb) {
	//change true/false to 1/0
	if (featured == 'true') {
		featured = 1;
	} else {
		featured = 0;
	}

	
	let sql = `
	UPDATE SHOWS
		SET name = ?,
		description = ?,
		image_thumbnail = ?,
		image_banner = ?,
		frequency = ?,
		featured = ?
	WHERE 
		show_id = ?
	`;

	getdatabase((db) => {
		db.run(sql, [name, description, image_thumbnail, image_banner, frequency, featured, show_id], (err) => {
			if (err) {
				cb(409);
			} else {
				cb(200)
			}
		})
		closedatabase(db)
	});
}

function delete_show(show_id, cb) {
	let sql = 'DELETE FROM SHOWS WHERE show_id = ?;'

	getdatabase((db) => {
		db.run(sql, [show_id], (err) => {
			if (err) {
				cb(409);
			} else {
				cb(200)
			}
		})
		closedatabase(db)
	});
}




/* --------------------- --------- ------------------------------ */
/* --------------------- TRACKLIST ------------------------------ */
/* --------------------- --------- ------------------------------ */
function update_tracklist(show_id, tracks, cb) {
	let del_sql = 'DELETE FROM TRACKS WHERE show_id = ?';
	getdatabase((db)=> {
		db.run(del_sql, [show_id], (err) => {
			//add new tracks
			cb(); //deleted
			let add_sql = 'INSERT INTO TRACKS (show_id, title, artist) VALUES (?,?,?);'
			for (var t of tracks) {
				db.run(add_sql, [show_id, t['title'], t['artist']], (err)=> {
					
				})
			}
		})
	})
}



/* --------------------- --------- ------------------------------ */
/* --------------------- TAGS ----------------------------------- */
/* --------------------- --------- ------------------------------ */
function update_tags(show_id, tags, cb) {
	let del_sql = 'DELETE FROM TAGS WHERE show_id = ?';
	getdatabase((db)=> {
		db.run(del_sql, [show_id], (err) => {
			//add new tags
			cb(); //deleted
			let add_sql = 'INSERT INTO TAGS (show_id, tag) VALUES (?,?);'
			for (var t of tags) {
				db.run(add_sql, [show_id, t['tag']], (err)=> {
					
				})
			}
		})
	})
}





/* --------------------- -------- ------------------------------ */
/* --------------------- RESIDENT ------------------------------ */
/* --------------------- -------- ------------------------------ */

function add_resident(name, description, image_thumbnail, image_banner, guest=0, cb, cbid) {
	
	let sql = 'INSERT INTO RESIDENTS(name, description, image_thumbnail, image_banner, guest) VALUES(?,?,?,?,?);';

	getdatabase((db) => {
		db.run(sql, [name, description, image_thumbnail, image_banner, guest], (err) => {
			if (err) {
				cb(409);
			} else {
				

				//get last id
				db.get("select last_insert_rowid();", (err, row)=> {
					cb(200, row['last_insert_rowid()']);
					cbid(row['last_insert_rowid()']);
				})

			}
		})
		closedatabase(db)
	});
}

function edit_resident(id, name, description, image_thumbnail, image_banner, guest, cb) {

	let sql = `
	UPDATE RESIDENTS
		SET name = ?,
		description = ?,
		image_thumbnail = ?,
		image_banner = ?,
		guest = ?
	WHERE 
		resident_id = ?
	`;

	getdatabase((db) => {
		db.run(sql, [name, description, image_thumbnail, image_banner, guest, id], (err) => {
			if (err) {
				cb(409);
			} else {
				cb(200)
			}
		})
		closedatabase(db)
	});
}

function delete_resident(id, cb) {
	let sql = 'DELETE FROM RESIDENTS WHERE resident_id = ?;'

	getdatabase((db) => {
		db.run(sql, [id], (err) => {
			if (err) {
				cb(409);
			} else {
				cb(200)
			}
		})
		closedatabase(db)
	});
}



/* --------------------- ----- ------------------------------ */
/* --------------------- EVENT ------------------------------ */
/* --------------------- ----- ------------------------------ */

function add_event(name, image_thumbnail, date, url, cb) {
	let sql = 'INSERT INTO EVENTS(name, image_thumbnail, date, url) VALUES(?,?,?,?);';

	getdatabase((db) => {
		db.run(sql, [name, image_thumbnail, date, url], (err) => {
			if (err) {
				cb(409);
			} else {
				//get last id
				db.get("select last_insert_rowid();", (err, row)=> {
					cb(200, row['last_insert_rowid()']);
					
				})
			}
		})
		closedatabase(db)
	});
}

function edit_event(id, name, image_thumbnail, date, url, cb) {
	let sql = `
	UPDATE EVENTS
		SET name = ?,
		image_thumbnail = ?,
		date = ?,
		url = ?
	WHERE 
		event_id = ?
	`;

	getdatabase((db) => {
		db.run(sql, [name, image_thumbnail, date, url, id], (err) => {
			if (err) {
				cb(409);
			} else {
				cb(200)
			}
		})
		closedatabase(db)
	});
}

function delete_event(id, cb) {
	let sql = 'DELETE FROM EVENTS WHERE event_id = ?;'

	getdatabase((db) => {
		db.run(sql, [id], (err) => {
			if (err) {
				cb(409);
			} else {
				cb(200)
			}
		})
		closedatabase(db)
	});
}




/* --------------------- ------- ------------------------------ */
/* --------------------- BANNERS ------------------------------ */
/* --------------------- ------- ------------------------------ */
function add_banner(name, description, image_banner, url, cb) {
	let sql = `
		INSERT INTO BANNERS (name, description, image_banner, url) VALUES (?, ?, ?, ?);
	`;
	getdatabase((db) => {
		db.run(sql, [name, description, image_banner, url], (err) => {
			if (err) {
				cb(409);
				closedatabase(db)
			} else {
				db.get("select last_insert_rowid();", (err, row)=> {
					cb(200, row['last_insert_rowid()']);
					closedatabase(db)
				})
			}
		})
		
	});
}

function edit_banner(banner_id, name, description, image_banner, url, cb) {
	let sql = `
	UPDATE BANNERS
		SET name = ?,
			description = ?,
			image_banner = ?,
			url = ?
		WHERE banner_id = ?
	`;
	getdatabase((db) => {
		db.run(sql, [name, description, image_banner, url, banner_id], (err) => {
			if (err) {
				cb(409);
			} else {
				cb(200)
			}
		})
		closedatabase(db)
	});
}

function delete_banner(banner_id, cb) {
	let sql = 'DELETE FROM BANNERS WHERE banner_id = ?;'
	getdatabase((db) => {
		db.run(sql, [banner_id], (err) => {
			if (err) {
				cb(409);
			} else {
				cb(200)
			}
		})
		closedatabase(db)
	});
}




/* --------------------- ------- ----------------------------- */
/* --------------------- IMAGES ------------------------------ */
/* --------------------- ------- ----------------------------- */
function add_image(image_id, imagename, cb) {
	let sql = 'INSERT INTO IMAGES (image_id, imagename) VALUES (?, ?);'
	getdatabase((db) => {
		db.run(sql, [image_id, imagename], (err) => {
			if (err) {
				cb(409);
				closedatabase(db)
			} else {
				cb(200);
				closedatabase(db);
			}
		})
		
	});
}



function get_images(cb) {
	let sql = 'SELECT * FROM IMAGES;'
	getdatabase((db) => {
		db.all(sql,  (err, rows) => {
			closedatabase(db)
			cb(rows);
		})
		
	});
}




/* --------------------- ------- --------------------------------------------- */
/* --------------------- SHOW-RESIDENT-RELATION ------------------------------ */
/* --------------------- ------- --------------------------------------------- */
//this is when a SHOW is being updated
function update_show_resident_relations(show_id, residents, cb) {
	let del_sql = 'DELETE FROM SHOW_RESIDENT_RELATIONSHIPS WHERE show_id = ?';
	getdatabase((db)=> {
		db.run(del_sql, [show_id], (err)=> {
			cb(); //deleted
			//now add
			
			let add_sql = 'INSERT INTO SHOW_RESIDENT_RELATIONSHIPS (show_id, resident_id) VALUES (?,?);'
			for (var r of residents) {
				db.run(add_sql, [show_id, r.resident_id], (err)=>{
					
				})
			}
		})
	})
}


/* --------------------- ------- --------------------------------------------- */
/* --------------------- RESIDENT-SHOW-RELATION ------------------------------ */
/* --------------------- ------- --------------------------------------------- */
//this is when a RESIDENT is being updated
function update_resident_show_relations(resident_id, shows, cb) {
	let del_sql = 'DELETE FROM SHOW_RESIDENT_RELATIONSHIPS WHERE resident_id = ?';
	getdatabase((db)=> {
		db.run(del_sql, [resident_id], (err)=> {
			cb(); //deleted
			//now add
			console.log(shows);
			let add_sql = 'INSERT INTO SHOW_RESIDENT_RELATIONSHIPS (show_id, resident_id) VALUES (?,?);'
			for (var r of shows) {
				db.run(add_sql, [r.show_id, resident_id], (err)=>{
					
				})
			}
		})
	})
}



module.exports = {
	add_show : function(name, description, image_thumbnail, image_banner, date, frequency, featured, tracks, tags, residents, cb) {
		add_show(name, description, image_thumbnail, image_banner, date, frequency, featured, cb, (show_id)=> {
			update_tracklist(show_id, tracks, ()=>{});
			update_tags(show_id, tags, ()=>{});
			update_show_resident_relations(show_id, residents, ()=>{});
		});

		
	},
	edit_show : function(show_id, name, description, image_thumbnail, image_banner, date, frequency, featured, tracks, tags, residents, cb) {
		edit_show(show_id, name, description, image_thumbnail, image_banner, frequency, featured, cb);

		update_tracklist(show_id, tracks, ()=>{});
		update_tags(show_id, tags, ()=>{});
		update_show_resident_relations(show_id, residents, ()=>{});
	},
	delete_show : function(show_id, cb) {
		
		let index = 0;
		update_tracklist(show_id, [], ()=> {
			index += 1;
			if (index == 3) delete_show(show_id, cb);
		});
		update_tags(show_id, [], ()=> {
			index += 1;
			if (index == 3) delete_show(show_id, cb);
		});
		update_show_resident_relations(show_id, [], ()=> {
			index += 1;
			if (index == 3) delete_show(show_id, cb);
		});
	},


	add_resident : function(name, description, image_thumbnail, image_banner, guest, shows, cb) {
		add_resident(name, description, image_thumbnail, image_banner, guest, cb, (resident_id)=> {
			update_resident_show_relations(resident_id, shows, ()=>{});
		});

		
	},
	edit_resident : function(resident_id, name, description, image_thumbnail, image_banner, guest, shows, cb) {
		edit_resident(resident_id, name, description, image_thumbnail, image_banner, guest, cb);

		update_resident_show_relations(resident_id, shows, ()=>{});
	},
	delete_resident : function(resident_id, cb) {
		update_resident_show_relations(resident_id, [], ()=>{
			delete_resident(resident_id, cb);
		});
	},


	add_event : function(name, image_thumbnail, date, url, cb) {add_event(name, image_thumbnail, date, url, cb)},
	edit_event : function(event_id, name, image_thumbnail, date, url, cb) {edit_event(event_id, name, image_thumbnail, date, url, cb)},
	delete_event : function(event_id, cb) {delete_event(event_id, cb)},


	add_banner : function(name, description, image_banner, url, cb) {
		add_banner(name, description, image_banner, url, cb);
	},
	edit_banner : function(banner_id, name, description, image_banner, url, cb) {
		edit_banner(banner_id, name, description, image_banner, url, cb)
	},
	delete_banner : function(banner_id, cb) {delete_banner(banner_id, cb)},


	add_image : function(image_id, imagename, cb) {add_image(image_id, imagename, cb)},
	get_images : function(cb) {get_images(cb)}
}