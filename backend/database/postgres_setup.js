const { Pool, Client } = require('pg')
//var connectionString = 'postgres://postgres:password@localhost:5432/radio'
var connectionString = "postgres://xqfejbmovmcger:43150b88f6939c50ed733a25187d127d1a1b74a04b6531ac41b66158c7ad5f43@ec2-174-129-192-200.compute-1.amazonaws.com:5432/d36rhr4o68ln8e"
const pool = new Pool({
  connectionString: connectionString,
})


let drop_tables = `
DROP TABLE IF EXISTS IMAGES;
DROP TABLE IF EXISTS TAGS;
DROP TABLE IF EXISTS TRACKS;
DROP TABLE IF EXISTS SCHEDULE;
DROP TABLE IF EXISTS SHOW_RESIDENT_RELATIONSHIPS;
DROP TABLE IF EXISTS RESIDENTS;
DROP TABLE IF EXISTS SHOWS;
DROP TABLE IF EXISTS BANNERS;
DROP TABLE IF EXISTS EVENTS;
`;


/* --------------------------------------------------
-------------------- IMAGES -------------------------
---------------------------------------------------*/
let image_sql = `
CREATE TABLE IF NOT EXISTS IMAGES (
	image_id VARCHAR(100) PRIMARY KEY,
	imagename VARCHAR(100)
);
`;


/* --------------------------------------------------
-------------------- BANNERS -------------------------
---------------------------------------------------*/
let banner_table = `
CREATE TABLE IF NOT EXISTS BANNERS (
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
	date VARCHAR(30),
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
	featured BOOLEAN DEFAULT FALSE,
	stream VARCHAR(200),
	webpath VARCHAR(30) UNIQUE NOT NULL
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
	guest BOOLEAN DEFAULT FALSE,
	webpath VARCHAR(30) UNIQUE NOT NULL
);
`; 


let res_shows_table = `
CREATE TABLE IF NOT EXISTS SHOW_RESIDENT_RELATIONSHIPS (
	show_resident_id SERIAL PRIMARY KEY,
	show_id INTEGER REFERENCES SHOWS(show_id),
	resident_id INTEGER REFERENCES RESIDENTS(resident_id)
);
`



let schedule_table = `
CREATE TABLE IF NOT EXISTS SCHEDULE (
	schedule_id SERIAL PRIMARY KEY,
	show_id INTEGER REFERENCES SHOWS(show_id),
	date VARHCAR(30),
	time TIME
)
`;


let alter_table_schedule = `
ALTER TABLE SCHEDULE 
ALTER DATE TYPE VARCHAR(30);
`;
let alter_table_events = `
ALTER TABLE EVENTS 
ALTER DATE TYPE VARCHAR(30);
`;


let alter_table_shows = `
ALTER TABLE SHOWS 
ADD COLUMN WEBPATH VARCHAR(100) UNIQUE NOT NULL;
`;

let alter_table_res = `
ALTER TABLE RESIDENTS 
ADD COLUMN WEBPATH VARCHAR(100) UNIQUE NOT NULL;
`;




function add_table() {
	pool.connect((err, client, done) => {
		if (err) throw err;

		
		let tables = 0;
		let queries = 9;

		


		
		client.query(image_sql, (err, res)=> {
			tables += 1;
			if (tables == queries) done();
			if (err) console.log(err);
		})

		client.query(banner_table, (err, res)=> {
			tables += 1;
			if (tables == queries) done();
			if (err) console.log(err);
		})

		client.query(events_table, (err, res)=> {
			tables += 1;
			if (tables == queries) done();
			if (err) console.log(err);
		})

		client.query(show_table, (err, res)=> {
			tables += 1;
			if (tables == queries) done();
			if (err) console.log(err);
		})

		client.query(track_table, (err, res)=> {
			tables += 1;
			if (tables == queries) done();
			if (err) console.log(err);
		})
		client.query(tag_table, (err, res)=> {
			tables += 1;
			if (tables == queries) done();
			if (err) console.log(err);
		})
		client.query(res_table, (err, res)=> {
			tables += 1;
			if (tables == queries) done();
			if (err) console.log(err);
		})

		client.query(res_shows_table, (err, res)=> {
			tables += 1;
			if (tables == queries) done();
			if (err) console.log(err);
		})

		

		client.query(schedule_table, (err, res)=>{
			tables += 1;
			if (tables == queries) done();
			if (err) console.log(err);
		})

		

	})
}


function alter_table() {
	pool.connect((err, client, done) => {
		if (err) throw err;

		let tables = 0;
		let queries = 2;

		client.query(alter_table_events, (err, res)=>{
			tables += 1;
			if (tables == queries) done();
		})

		client.query(alter_table_schedule, (err, res)=>{
			tables += 1;
			if (tables == queries) done();
		})
	});
}


function delete_table(cb) {
	pool.query(drop_tables, (err, res)=>{
		cb();
	})
}


module.exports = {
	add_table: function(){
		add_table();
		console.log('added tables');
		
	},
	alter_table: function(){alter_table()}
}


