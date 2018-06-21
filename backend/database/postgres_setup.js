const { Pool, Client } = require('pg')
var connectionString = "postgres://xqfejbmovmcger:43150b88f6939c50ed733a25187d127d1a1b74a04b6531ac41b66158c7ad5f43@ec2-174-129-192-200.compute-1.amazonaws.com:5432/d36rhr4o68ln8e"
const pool = new Pool({
  connectionString: connectionString,
})





/* --------------------------------------------------
-------------------- IMAGES -------------------------
---------------------------------------------------*/
let image_sql = `
CREATE TABLE IMAGES (
	image_id VARCHAR(100) PRIMARY KEY,
	imagename VARCHAR(100)
);
`;


/* --------------------------------------------------
-------------------- BANNERS -------------------------
---------------------------------------------------*/
let banner_table = `
CREATE TABLE BANNERS (
	banner_id SERIAL PRIMARY KEY,
	name VARCHAR(100),
	description VARCHAR(100),
	image_banner VARCHAR(100) REFERENCES IMAGES (image_id),
	url VARCHAR(100)
)`;

/* --------------------------------------------------
-------------------- EVENTS -------------------------
---------------------------------------------------*/
let events_table = `
CREATE TABLE IF NOT EXISTS EVENTS (
	event_id SERIAL PRIMARY KEY,
	name VARCHAR(100),
	image_thumbnail VARCHAR(100) REFERENCES IMAGES (image_id),
	date DATE,
	url VARCHAR(100)
);
`



/* --------------------------------------------------
-------------------- SHOWS -------------------------
---------------------------------------------------*/
let show_table = `
CREATE TABLE IF NOT EXISTS SHOWS (
	show_id SERIAL PRIMARY KEY,
	name VARCHAR(100),
	description VARCHAR(100),
	image_thumbnail VARCHAR(100) REFERENCES IMAGES (image_id),
	image_banner VARCHAR(100) REFERENCES IMAGES (image_id),
	date DATE,
	frequency VARCHAR(20),
	featured BOOLEAN DEFAULT FALSE,
	stream VARCHAR(200)
);
`;



/* --------------------------------------------------
-------------------- TAGS TRACKS RESIDENTS -------------------------
---------------------------------------------------*/
let track_table = `
CREATE TABLE IF NOT EXISTS TRACKS (
	track_id SERIAL PRIMARY KEY,
	show_id INTEGER REFERENCES SHOWS(show_id),
	title VARCHAR(100),
	artist VARCHAR(100)
)
`;

let tag_table = `
CREATE TABLE IF NOT EXISTS TAGS (
	tag_id SERIAL PRIMARY KEY,
	show_id INTEGER REFERENCES SHOWS(show_id),
	tag VARCHAR(25)
);
`;


/* --------------------------------------------------
-------------------- RESIDENTS -------------------------
---------------------------------------------------*/
let res_table = `
CREATE TABLE IF NOT EXISTS RESIDENTS (
	resident_id SERIAL PRIMARY KEY ,
	name VARCHAR(100),
	description VARCHAR(100),
	image_thumbnail VARCHAR(100) REFERENCES IMAGES (image_id),
	image_banner VARCHAR(100) REFERENCES IMAGES (image_id),
	guest BOOLEAN DEFAULT FALSE
);
`; 


let res_shows_table = `
CREATE TABLE IF NOT EXISTS SHOW_RESIDENT_RELATIONSHIPS (
	show_resident_id SERIAL PRIMARY KEY,
	show_id INTEGER REFERENCES SHOWS(show_id),
	resident_id INTEGER REFERENCES RESIDENTS(resident_id)
);
`






function add_table() {
	pool.connect((err, client, done) => {
		if (err) throw err;

		client.query(track_table, (err, res)=> {
			done();
			if (err) console.log(err);
		})
		client.query(tag_table, (err, res)=> {
			done();
			if (err) console.log(err);
		})
		client.query(res_table, (err, res)=> {
			done();
			if (err) console.log(err);
		})

		client.query(res_shows_table, (err, res)=> {
			done();
			if (err) console.log(err);
		})


	})
}


module.exports = {
	add_table : function() {add_table()}
}