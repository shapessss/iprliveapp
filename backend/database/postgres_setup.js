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






function add_table() {
	pool.connect((err, client, done) => {
		if (err) throw err;

		client.query(banner_table, (err, res)=> {
			done();
			if (err) console.log(err);
		})
		client.query(events_table, (err, res)=> {
			done();
			if (err) console.log(err);
		})
		client.query(show_table, (err, res)=> {
			done();
			if (err) console.log(err);
		})
	})
}


module.exports = {
	add_table : function() {add_table()}
}