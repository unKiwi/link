// includes
const conf = require("./conf");

const cors = require('cors');
const mysql = require('mysql2');
const express = require('express');
const app = express();

// setup app
app.use(cors());

app.use("*", (req, res) => {
	let url = req.originalUrl.substring(1);
	let connection = mysql.createConnection(conf.mysqlParams);
	connection.connect();
	connection.query(`SELECT id, redirect FROM link WHERE link = ?`, [url], (error, results) => {
		if (error) throw error;
		if (results.length == 1) {
			res.redirect(results[0].redirect);

			// add a view
			connection.query(`INSERT INTO view SET linkId = ?, ip = ?, moment = ?`, [results[0].id, req.ip, Date.now()], (error) => {
				if (error) throw error;
			});
		}
		else {
			res.redirect("https://noncerr.com");
		}

		connection.end();
	});
});

// export
module.exports = app;