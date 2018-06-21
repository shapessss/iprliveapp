const { Pool, Client } = require('pg')
var connectionString = "postgres://xqfejbmovmcger:43150b88f6939c50ed733a25187d127d1a1b74a04b6531ac41b66158c7ad5f43@ec2-174-129-192-200.compute-1.amazonaws.com:5432/d36rhr4o68ln8e"
const pool = new Pool({
  connectionString: connectionString,
})






let image_sql = `
CREATE TABLE IMAGES (
	image_id VARCHAR(100) PRIMARY KEY,
	imagename VARCHAR(100)
);
`;









function add_table() {
	pool.connect((err, client, done) => {
		if (err) throw err;

		client.query(image_sql, (err, res)=> {
			done();
		})
	})
}


module.exports = {
	add_table : function() {add_table()}
}