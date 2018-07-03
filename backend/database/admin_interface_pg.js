const { Pool, Client } = require('pg')
//var connectionString = 'postgres://postgres:dominique95@localhost:5432/radio'
var connectionString = "postgres://xqfejbmovmcger:43150b88f6939c50ed733a25187d127d1a1b74a04b6531ac41b66158c7ad5f43@ec2-174-129-192-200.compute-1.amazonaws.com:5432/d36rhr4o68ln8e"
const pool = new Pool({
  connectionString: connectionString,
})




/* --------------------- ---- ------------------------------ */
/* --------------------- SHOW ------------------------------ */
/* --------------------- ---- ------------------------------ */
function add_show(name, description, image_thumbnail, image_banner, featured, stream, webpath, cb, cbid) {
	//change true/false to 1/0
	if (featured == true) {
		featured = 1;
	} else {
		featured = 0;
	}


	let sql = `
	INSERT INTO SHOWS(name, description, image_thumbnail, image_banner, featured, stream, webpath)
	 VALUES($1, $2, $3, $4, $5, $6, $7)
	 RETURNING show_id;`;
	
	pool.query(sql, [name, description, image_thumbnail, image_banner, featured, stream, webpath], (err, row) => {
		if (err) {
			return cb(409);
		}
		
		let show_id = row.rows[0].show_id;
		cb(200, show_id);
		cbid(show_id);
	})
}

function edit_show(show_id, name, description, image_thumbnail, image_banner, featured, stream, webpath, cb) {
	
	
	let sql = `
	UPDATE SHOWS
		SET name = $1,
		description = $2,
		image_thumbnail = $3,
		image_banner = $4,
		featured = $5,
		stream = $6,
		webpath = $7
	WHERE 
		show_id = $8
	`;

	pool.query(sql, [name, description, image_thumbnail, image_banner, featured, stream, webpath, show_id], (err, row) => {
		if (err) {
			cb(409);
		} else {
			cb(200)
		}
	})
}

function delete_show(show_id, cb) {
	let sql = 'DELETE FROM SHOWS WHERE show_id = $1;'
	//delete from schedule
	//delete from show_resident
	let related = 0;
	pool.connect((err, client, done)=> {
		if (err) {
			done();
			return cb(409);
		}
		client.query('DELETE FROM SCHEDULE WHERE show_id = $1', [show_id], (err, row) => {
					
			client.query(sql, [show_id], (err, row) => {
				done();
				if (err) {
					console.log(err);
					cb(409);
				} else {
					cb(200)
				}
			})
			
		})

		
	});
	
}


/* --------------------- --------- ------------------------------ */
/* --------------------- TRACKLIST ------------------------------ */
/* --------------------- --------- ------------------------------ */
function update_tracklist(show_id, tracks, cb) {
	let del_sql = 'DELETE FROM TRACKS WHERE show_id = $1';
	let add_sql = 'INSERT INTO TRACKS (show_id, title, artist) VALUES ($1, $2, $3);'
	
	let current = 0;

	pool.connect((err, client, done)=> {
		if (err) throw err;

		client.query(del_sql, [show_id], (err, row) => {
			if (err) throw err;

			for (var t of tracks) {
				client.query(add_sql, [show_id, t['title'], t['artist']], (err, row)=>{
					current += 1;
					if (current == tracks.length) {
						cb();
						done();
					}
				})
			}

			if (current == tracks.length) {
				cb();
				done();
			}

		})
	})
	

}



/* --------------------- --------- ------------------------------ */
/* --------------------- TAGS ----------------------------------- */
/* --------------------- --------- ------------------------------ */
function update_tags(show_id, tags, cb) {
	let del_sql = 'DELETE FROM TAGS WHERE show_id = $1';
	let add_sql = 'INSERT INTO TAGS (show_id, tag) VALUES ($1, $2);'
	let current = 0;

	pool.connect((err, client, done)=> {
		if (err) throw err;
		client.query(del_sql, [show_id], (e, r) => {
			for (var t of tags) {
				
				client.query(add_sql, [show_id, t['tag']], (err, row)=>{
					current += 1;
					if (current == tags.length) {
						cb();
						done();
					}
				})
			}

			if (current == tags.length) {
				cb();
				done();
			}
		})
	})
}



/* --------------------- -------- ------------------------------ */
/* --------------------- RESIDENT ------------------------------ */
/* --------------------- -------- ------------------------------ */

function add_resident(name, description, image_thumbnail, image_banner, guest=0, webpath, cb, cbid) {
	
	let sql = `
	INSERT INTO RESIDENTS(name, description, image_thumbnail, image_banner, guest, webpath)
	 VALUES($1, $2, $3, $4, $5, $6)
	 RETURNING resident_id;`;

	
	pool.query(sql, [name, description, image_thumbnail, image_banner, guest, webpath], (err, row) => {
		if (err) {
			cb(409);
		} else {
			let resident_id = row.rows[0].resident_id;
			cb(200, resident_id);
			cbid(resident_id);
		}
	})
}

function edit_resident(id, name, description, image_thumbnail, image_banner, guest, webpath, cb) {

	let sql = `
	UPDATE RESIDENTS
		SET name = $1,
		description = $2,
		image_thumbnail = $3,
		image_banner = $4,
		guest = $5,
		webpath = $6
	WHERE 
		resident_id = $7
	`;

	pool.query(sql, [name, description, image_thumbnail, image_banner, guest, webpath, id], (err, row) => {
		if (err) {
			cb(409);
		} else {
			cb(200)
		}
	})
}

function delete_resident(res_id, cb) {
	let sql = 'DELETE FROM RESIDENTS WHERE resident_id = $1;'


	pool.query(sql, [res_id], (err, done) => {
		if (err) {
			return cb(409);
		}

		return cb(200);
	})
}



/* --------------------- ----- ------------------------------ */
/* --------------------- EVENT ------------------------------ */
/* --------------------- ----- ------------------------------ */

function add_event(name, image_thumbnail, date, url, cb) {
	let sql = 'INSERT INTO EVENTS(name, image_thumbnail, date, url) VALUES($1, $2, $3, $4) RETURNING event_id;';
	

	pool.query(sql, [name, image_thumbnail, date, url], (err, row) => {
		if (err) return cb(409);
		
		let event_id = row.rows[0].event_id;
		cb(200, event_id);
	})
}

function edit_event(id, name, image_thumbnail, date, url, cb) {
	let sql = `
	UPDATE EVENTS
		SET name = $1,
		image_thumbnail = $2,
		date = $3,
		url = $4
	WHERE 
		event_id = $5
	`;

	
	pool.query(sql, [name, image_thumbnail, date, url, id], (err, row) => {
		if (err) {
			cb(409);
		} else {
			cb(200)
		}
	})
}

function delete_event(id, cb) {
	let sql = 'DELETE FROM EVENTS WHERE event_id = $1;'

	pool.query(sql, [id], (err, row)=>{
		if (err) {
			cb(409);
		} else {
			cb(200)
		}
	})
}


/* --------------------- ------- ------------------------------ */
/* --------------------- BANNERS ------------------------------ */
/* --------------------- ------- ------------------------------ */
function add_banner(name, description, image_banner, url, cb) {
	let sql = `
		INSERT INTO BANNERS (name, description, image_banner, url) VALUES ($1, $2, $3, $4) RETURNING banner_id;
	`;
	
	pool.query(sql, [name, description, image_banner, url], (err, row) => {
		if (err) return cb(409);

		let banner_id = row.rows[0].banner_id;
		cb(200, banner_id);
	})
}

function edit_banner(banner_id, name, description, image_banner, url, cb) {
	let sql = `
	UPDATE BANNERS
		SET name = $1,
			description = $2,
			image_banner = $3,
			url = $4
		WHERE banner_id = $5
	`;
	
	pool.query(sql, [name, description, image_banner, url, banner_id], (err, row) => {
		if (err) {
			cb(409);
		} else {
			cb(200)
		}
	})
}

function delete_banner(banner_id, cb) {
	let sql = 'DELETE FROM BANNERS WHERE banner_id = $1;'

	pool.query(sql, [banner_id], (err, row) => {
		if (err) {
			cb(409);
		} else {
			cb(200)
		}
	})
}




/* --------------------- ------- ----------------------------- */
/* --------------------- IMAGES ------------------------------ */
/* --------------------- ------- ----------------------------- */
function add_image(image_id, imagename, cb) {
	console.log('adding image', imagename)
	let sql = 'INSERT INTO IMAGES (image_id, imagename) VALUES ($1, $2);'
	pool.query(sql, [image_id, imagename], (err, row)=> {
		if (err) return cb(409);
		cb(200);
	})
}



function get_images(cb) {
	let sql = 'SELECT * FROM IMAGES;'
	
	pool.query(sql, (err, rows) => {
		
		cb(rows.rows);
	})
}




/* --------------------- ------- --------------------------------------------- */
/* --------------------- SHOW-RESIDENT-RELATION ------------------------------ */
/* --------------------- ------- --------------------------------------------- */
//this is when a SHOW is being updated
function update_show_resident_relations(show_id, residents, cb) {
	let del_sql = 'DELETE FROM SHOW_RESIDENT_RELATIONSHIPS WHERE show_id = $1';
	let add_sql = 'INSERT INTO SHOW_RESIDENT_RELATIONSHIPS (show_id, resident_id) VALUES ($1, $2);'
	let current = 0;
	
	pool.connect((err, client, done) => {
		if (err) throw err;

		client.query(del_sql, [show_id], (err, rows) => {
			for (var r of residents) {
				client.query(add_sql, [show_id, r.resident_id], (err, row)=> {
					if (current == residents.length) {
						done();
						cb();
					} 
				})
			}

			if (current == residents.length) {
				cb();
				done();
			}
		})
	})
}


/* --------------------- ------- --------------------------------------------- */
/* --------------------- RESIDENT-SHOW-RELATION ------------------------------ */
/* --------------------- ------- --------------------------------------------- */
//this is when a RESIDENT is being updated
function update_resident_show_relations(resident_id, shows, cb) {
	let del_sql = 'DELETE FROM SHOW_RESIDENT_RELATIONSHIPS WHERE resident_id = $1';
	let add_sql = 'INSERT INTO SHOW_RESIDENT_RELATIONSHIPS (show_id, resident_id) VALUES ($1, $2);'
	let current = 0;
	pool.connect((err, client, done) => {
		if (err) throw err;

		let current = 0;


		client.query(del_sql, [resident_id], (err, rows) => {
			for (var r of shows) {
				client.query(add_sql, [r.show_id, resident_id], (err, row)=> {
					current += 1;
					if (current == shows.length) {
						done();
						return cb();
					}
				})
			}
			if (current == shows.length) {
				done();
				return cb();
			}
		})
	})
}



/* --------------------- ------- -------------------------------- */
/* --------------------- SCHEDULES ------------------------------ */
/* --------------------- ------- -------------------------------- */
function add_schedule(show_id, date, time, cb) {
	//convert time to hours mins seconds
	let d = new Date(time);
	time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	let sql = 'INSERT INTO SCHEDULE (show_id, date, time) VALUES ($1, $2, $3) RETURNING schedule_id;'
	pool.query(sql, [show_id, date, time], (err, row)=>{
		if (err) return cb(409);

		let schedule_id = row.rows[0].schedule_id;
		cb(200, schedule_id);
	})
}

function edit_schedule(schedule_id, show_id, date, time, cb) {
	let d = new Date(time);
	time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	let sql = `
	UPDATE SCHEDULE
		SET show_id = $1,
			date = $2,
			time = $3
		WHERE schedule_id = $4
	`;
	
	pool.query(sql, [show_id, date, time, schedule_id], (err, row) => {
		if (err) {
			cb(409);
		} else {
			cb(200)
		}
	})
}
function delete_schedule(schedule_id, cb) {
	let sql = 'DELETE FROM SCHEDULE WHERE schedule_id = $1;'
	console.log(schedule_id);
	pool.query(sql, [schedule_id], (err, res)=>{
		if (err) return cb(409);
		cb(200);
	})
}


module.exports = {
	add_show : function(name, description, image_thumbnail, image_banner, featured, stream, tracks, tags, residents, webpath, cb) {
		add_show(name, description, image_thumbnail, image_banner, featured, stream, webpath, cb, (show_id)=> {
			update_tracklist(show_id, tracks, ()=>{});
			update_tags(show_id, tags, ()=>{});
			update_show_resident_relations(show_id, residents, ()=>{});
		});

		
	},
	edit_show : function(show_id, name, description, image_thumbnail, image_banner, featured, stream, tracks, tags, residents, webpath, cb) {
		edit_show(show_id, name, description, image_thumbnail, image_banner, featured, stream, webpath, cb);

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


	add_resident : function(name, description, image_thumbnail, image_banner, guest, shows, webpath, cb) {
		add_resident(name, description, image_thumbnail, image_banner, guest, webpath, cb, (resident_id)=> {
			update_resident_show_relations(resident_id, shows, ()=>{});
		});

		
	},
	edit_resident : function(resident_id, name, description, image_thumbnail, image_banner, guest, shows, webpath, cb) {
		edit_resident(resident_id, name, description, image_thumbnail, image_banner, guest, webpath, cb);

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
	get_images : function(cb) {get_images(cb)},

	add_schedule : function(show_id, date, time, cb) {add_schedule(show_id, date, time, cb)},
	edit_schedule : function(schedule_id, show_id, date, time, cb) {edit_schedule(schedule_id, show_id, date, time, cb)},
	delete_schedule : function(schedule_id, cb) {delete_schedule(schedule_id, cb)}
}