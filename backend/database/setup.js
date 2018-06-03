//shows

//events

//residents


//banners

//images


//show can have multiple residents, resident can have multiple shows



const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./radio.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the radio database.');
});


db.get("PRAGMA foreign_keys = ON")

/* --------------------------------------------------
-------------------- IMAGES -------------------------
---------------------------------------------------*/
let image_sql = `
CREATE TABLE IF NOT EXISTS IMAGES (
	image_id TEXT PRIMARY KEY,
	imagename TEXT
);`;

/* --------------------------------------------------
-------------------- BANNERS -------------------------
---------------------------------------------------*/
let banner_table = `
CREATE TABLE IF NOT EXISTS BANNERS (
	banner_id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	description TEXT,
	image_banner TEXT,
	url TEXT,

	FOREIGN KEY (image_banner) REFERENCES IMAGES(image_id)
)`;



/* --------------------------------------------------
-------------------- EVENTS -------------------------
---------------------------------------------------*/
let events_table = `
CREATE TABLE IF NOT EXISTS EVENTS (
	event_id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	image_thumbnail TEXT,
	date TEXT,
	url TEXT,

	FOREIGN KEY (image_thumbnail) REFERENCES IMAGES(image_id)
);
`

/* --------------------------------------------------
-------------------- SHOWS -------------------------
---------------------------------------------------*/
let show_table = `
CREATE TABLE IF NOT EXISTS SHOWS (
	show_id INTEGER PRIMARY KEY AUTOINCREMENT ,
	name TEXT,
	description TEXT,
	image_thumbnail TEXT,
	image_banner TEXT,
	date TEXT,
	frequency TEXT,
	featured INTEGER DEFAULT 0,


	FOREIGN KEY (image_thumbnail) REFERENCES IMAGES(image_id),
	FOREIGN KEY (image_banner) REFERENCES IMAGES(image_id)
);
`;


/* --------------------------------------------------
-------------------- TAGS TRACKS RESIDENTS -------------------------
---------------------------------------------------*/
let track_table = `
CREATE TABLE IF NOT EXISTS TRACKS (
	track_id INTEGER PRIMARY KEY AUTOINCREMENT,
	show_id INTEGER,
	title TEXT,
	artist TEXT,

	FOREIGN KEY(show_id) REFERENCES SHOWS(show_id)
)
`;

let tag_table = `
CREATE TABLE IF NOT EXISTS TAGS (
	tag_id INTEGER PRIMARY KEY AUTOINCREMENT,
	show_id INTEGER,
	tag TEXT,

	FOREIGN KEY(show_id) REFERENCES SHOWS(show_id)
);
`;


/* --------------------------------------------------
-------------------- RESIDENTS -------------------------
---------------------------------------------------*/
let res_table = `
CREATE TABLE IF NOT EXISTS RESIDENTS (
	resident_id INTEGER PRIMARY KEY AUTOINCREMENT ,
	name TEXT,
	description TEXT,
	image_thumbnail TEXT,
	image_banner TEXT,
	guest INTEGER DEFAULT 0,

	FOREIGN KEY (image_thumbnail) REFERENCES IMAGES(image_id),
	FOREIGN KEY (image_banner) REFERENCES IMAGES(image_id)
);
`; //use integer for boolean equivalent (no bool in sqlite) 0 == false 1 == true


let res_shows_table = `
CREATE TABLE IF NOT EXISTS SHOW_RESIDENT_RELATIONSHIPS (
	show_resident_id INTEGER PRIMARY KEY AUTOINCREMENT,
	show_id INTEGER,
	resident_id INTEGER,

	FOREIGN KEY(show_id) REFERENCES SHOWS(show_id),
	FOREIGN KEY(resident_id) REFERENCES RESIDENTS(resident_id)
);
`



db.run(image_sql, (err) => {console.log(err)})
db.run(banner_table, (err) => {console.log(err)})
db.run(events_table, (err) => {console.log(err)})
db.run(show_table, (err) => {console.log(err)})
db.run(track_table, (err) => {console.log(err)})
db.run(tag_table, (err) => {console.log(err)})
db.run(res_table, (err) => {console.log(err)})
db.run(res_episode_table, (err) => {console.log(err)})








// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});