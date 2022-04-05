// includes
const conf = require("./conf");
const util = require("./util");

const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const express = require('express');
const app = express();

let connection = mysql.createConnection(conf.mysqlParams);
let maxLength = 2048 - conf.uri.length;

// setup app
app.use(cors());
app.use(bodyParser.json());

app.use("/create", (req, res) => {
	if (req.body.token == undefined) {
		req.body.token = "";
	}
	else if (req.body.token.length > 255) {
		// cancel request
		res.json({
			res: "ko",
			err: "Invalid token: token length must be between [0; 255]",
		});
		return;
	}
	if (req.body.link == undefined) {
		// generate link
		req.body.link = util.token.create(8);
	}
	else if (req.body.link.length > maxLength) {
		// cancel request
		res.json({
			res: "ko",
			err: "Link is too long: maxLength = " + maxLength,
		});
		return;
	}
	if (req.body.redirect == undefined) {
		// cancel request
		res.json({
			res: "ko",
			err: "No redirect link in your request",
		});
		return;
	}
	else if (req.body.redirect.length > 2048) {
		// cancel request
		res.json({
			res: "ko",
			err: "Redirect link is too long: maxLength = 2048",
		});
		return;
	}

	// user exist ?
	connection.query(`SELECT id FROM user WHERE token = ?`, [req.body.token], (error, results) => {
		if (error) throw error;
		if (results.length == 1) {
			// user exist
			next1(results[0].id);
		}
		else {
			// ! user exist
			// create user
			connection.query(`INSERT INTO user SET token = ?`, [req.body.token], (error, results) => {
				if (error) throw error;
				// user exist
				next1(results.insertId);
			});
		}
	});

	let next1 = (id) => {
		connection.query(`SELECT userId FROM link WHERE link = ?`, [req.body.link], (error, results) => {
			if (error) throw error;
			if (results.length == 1) {
				// link exist
				res.json({
					res: "ko",
					err: "The link you want to create already exist",
				});
			}
			else {
				// ! link exist
				res.json({
					res: "ok",
					link: conf.uri + req.body.link,
				});
				// create link
				connection.query(`INSERT INTO link SET userId = ?, link = ?, redirect = ?`, [id, req.body.link, req.body.redirect], (error) => {
					if (error) throw error;
				});
			}
		});
	}
});

app.use("/getLink", (req, res) => {
	// token
	if (req.body.token == undefined) {
		// cancel request
		res.json({
			res: "ko",
			err: "No token gived",
		});
		return;
	}
	else if (req.body.token.length > 255 || req.body.token.length < 1) {
		// cancel request
		res.json({
			res: "ko",
			err: "Invalid token: token length must be between [1; 255]",
		});
		return;
	}

	connection.query(`SELECT l.link, l.redirect FROM link l JOIN user u ON u.id = l.userId WHERE u.token = ?`, [req.body.token], (error, results) => {
		if (error) throw error;
		res.json({
			res: "ok",
			lsLink: results,
		});
	});
});

app.use("/getView", (req, res) => {
	// token
	if (req.body.token == undefined) {
		// cancel request
		res.json({
			res: "ko",
			err: "No token gived",
		});
		return;
	}
	else if (req.body.token.length > 255 || req.body.token.length < 1) {
		// cancel request
		res.json({
			res: "ko",
			err: "Invalid token: token length must be between [1; 255]",
		});
		return;
	}

	// link
	if (req.body.link == undefined) {
		// cancel request
		res.json({
			res: "ko",
			err: "No link gived",
		});
		return;
	}
	else if (req.body.link.length > maxLength) {
		// cancel request
		res.json({
			res: "ko",
			err: "Link is too long: maxLength = " + maxLength,
		});
		return;
	}

	connection.query(`SELECT v.ip, v.moment FROM view v JOIN link l ON v.linkId = l.id JOIN user u ON u.id = l.userId WHERE u.token = ? AND l.link = ?`, [req.body.token, req.body.link], (error, results) => {
		if (error) throw error;
		res.json({
			res: "ok",
			lsView: results,
		});
	});
});

app.use("/delete", (req, res) => {
	// token
	if (req.body.token == undefined) {
		// cancel request
		res.json({
			res: "ko",
			err: "No token gived",
		});
		return;
	}
	else if (req.body.token.length > 255 || req.body.token.length < 1) {
		// cancel request
		res.json({
			res: "ko",
			err: "Invalid token: token length must be between [1; 255]",
		});
		return;
	}

	// link
	if (req.body.link == undefined) {
		// cancel request
		res.json({
			res: "ko",
			err: "No link gived",
		});
		return;
	}
	else if (req.body.link.length > maxLength) {
		// cancel request
		res.json({
			res: "ko",
			err: "Link is too long: maxLength = " + maxLength,
		});
		return;
	}

	res.json({
		res: "ok",
	});

	connection.query(`DELETE FROM view WHERE linkId = (SELECT id FROM link WHERE link = ? AND userId = (SELECT id FROM user WHERE token = ?))`, [req.body.link, req.body.token], (error) => {
		if (error) throw error;
	});
	connection.query(`DELETE FROM link WHERE link = ? AND userId = (SELECT id FROM user WHERE token = ?)`, [req.body.link, req.body.token], (error) => {
		if (error) throw error;
	});
});

app.use("/update", (req, res) => {
	// token
	if (req.body.token == undefined) {
		// cancel request
		res.json({
			res: "ko",
			err: "No token gived",
		});
		return;
	}
	else if (req.body.token.length > 255 || req.body.token.length < 1) {
		// cancel request
		res.json({
			res: "ko",
			err: "Invalid token: token length must be between [1; 255]",
		});
		return;
	}

	// old link
	if (req.body.link == undefined) {
		// cancel request
		res.json({
			res: "ko",
			err: "No link in your request",
		});
		return;
	}
	else if (req.body.link.length > maxLength) {
		// cancel request
		res.json({
			res: "ko",
			err: "Link is too long: maxLength = " + maxLength,
		});
		return;
	}

	// new redirect
	if (req.body.redirect == undefined) {
		// cancel request
		res.json({
			res: "ko",
			err: "No redirect link in your request",
		});
		return;
	}
	else if (req.body.redirect.length > 2048) {
		// cancel request
		res.json({
			res: "ko",
			err: "Redirect link is too long: maxLength = 2048",
		});
		return;
	}

	res.json({
		res: "ok",
	});

	connection.query(`UPDATE link l JOIN user u ON l.userId = u.id SET l.redirect = ? WHERE l.link = ?`, [req.body.redirect, req.body.link], (error) => {
		if (error) throw error;
	});
});

// export
module.exports = app;