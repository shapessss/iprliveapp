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


//get shows from database
//get tags of each show
//get tracks of each show
//get residents of each show
function get_shows(cb) {
	getdatabase((db) => {
		db.all("SELECT * FROM SHOWS", (err, rows) => {
			if (err) console.log(err);	
			//for each episode get tags and tracks
			let tags_sql = 'SELECT * FROM TAGS WHERE show_id = ?';
			let tracks_sql = 'SELECT * FROM TRACKS WHERE show_id = ?';

			let num_rows = rows.length;
			let index = 0;

			if (num_rows == 0) {
				cb(rows);
				closedatabase(db);
			}

			for (var r of rows) {
				
				get_related(r, tags_sql, 'tags', ()=>{
					console.log('get tags')
					if (index >= num_rows * 3) {
						cb(rows);
						closedatabase(db);
					}
				})

				get_related(r, tracks_sql, 'tracks', ()=>{
					console.log('get tracks')
					if (index >= num_rows * 3) {
						cb(rows);
						closedatabase(db);
					}
				})


				// get related resident ids
				get_residents_2(r, ()=> {
					console.log('get residents')
					if (index >= num_rows * 3) {
						cb(rows);
						closedatabase(db);
					}
				})


				
			}


			function get_related(r, n_sql, related, done) {
				
				db.all(n_sql, [r.show_id], (err, n_rows)=>{

					r[related] = n_rows;
					index += 1;
					done();					
				})
			}



			function get_residents_2(r, done) {
				
				db.all("SELECT * FROM SHOW_RESIDENT_RELATIONSHIPS WHERE show_id = ?", [r.show_id], (err, rows)=> {
					if (rows == undefined || rows.length == 0) {
						r.residents = [];
						index += 1;
						done();
						return;
					}
					get_list_of_residents(rows, (residents)=>{
						r.residents = residents;
						index += 1;
						done();
					});
				})
			}


			function get_list_of_residents(residents, cb) {
				let index = 0;
				let max = residents.length;
				let data = [];

				for (var r of residents) {
					db.get('SELECT * FROM RESIDENTS WHERE resident_id = ?', [r.resident_id], (err, row)=> {
						data.push(row);

						if (data.length == max) {
							cb(data);
						}
					})
				}
			}
	
			
		});
		
		
	})
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
				if (rows == undefined || rows.length == 0) {
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







//get individual show
//tags tracks residents
function get_show_by_id(show_id, cb) {
	getdatabase((db)=> {
		
		let show = null;
		let residents = [];
		let sql = 'SELECT * FROM SHOWS WHERE show_id = ?';

		let residentsDone = false;
		

		db.get(sql, [show_id], (err, row)=> {
			show = row;
			
			//if undefined
			if (show == undefined) {
				cb([])
			}

			if (residentsDone) {
				show.residents = residents;
				console.log(show);
				cb(show);
			}

		})

		db.all('SELECT * FROM EPISODE_RESIDENT WHERE show_id = ?', [show_id], (err, rows)=> {
			let index = 0;
			let max = rows.length;
			if (rows.length == 0 ) cb([])
			for (var r of rows) {
				get_resident(r, (row)=> {
					residents.push(row);
					index += 1;

					if (index >= max) {
						residentsDone = true;
						if (show != null) {
							//both done
							show.residents = residents;
							console.log(show);
							cb(show);
						}
					}
				})
			}
		})

		function get_resident(r, done) {
			db.get("SELECT * FROM RESIDENTS WHERE resident_id = ?", [r.resident_id], (err, row)=> {
				done(row);
			})
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

		db.all('SELECT * FROM EPISODE_RESIDENT WHERE resident_id = ?', [resident_id], (err, rows)=> {
			let index = 0;
			let max = rows.length;
			if (rows.length == 0) cb([])
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




module.exports = {
	get_banners : function(cb) {get_banners(cb)},
	get_events : function(cb) {get_events(cb)},
	get_shows : function(cb) {get_shows(cb)},
	get_residents : function(cb) {get_residents(cb)},
	get_show_by_id : function(show_id, cb) {get_show_by_id(show_id, cb)},
	get_resident_by_id : function(resident_id, cb) {get_resident_by_id(resident_id, cb)}
}