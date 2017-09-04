var express = require('express');
var pg = require('pg');
var format = require('pg-format');
var router = express.Router();

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/mydb';
var pool = new pg.Pool({
	host: 'localhost',
	database: 'mydb'
});

router.get('/:user_id', function(req, res, next) {
	var userId = req.params.user_id;
	console.log('get userId: ' + userId);
});

router.post('/', function(req, res, next) {
	var results = [];
	
	pool.connect(function(err, client, done) {
		if (err) {
			done();
			console.err(err);
			return res.status(500).json({success: false, data: err});
		}

		var sql = format('INSERT INTO %I(name, passwd, email) values(%L) returning *', 'users', [req.body.username, req.body.password, req.body.email]);
		client.query(sql, function(err, result) {
			done();
			if (!err && result.rowCount) {
				var sess = req.session;
				sess.user_id = result.rows[0].user_id;
				return res.send({success: true});
			}
			else 
				return res.send({success: failure});
			
		});
	});
});

router.post('/login', function(req, res, next) {
	pool.connect(function(err, client, done) {
		if (err) {
			done();
			console.err(err);
			return res.status(500).json({success: false, msg: 'sorry failed to login'});
		}

		if (!!req.isAuthorized) {
			return res.send({success: true});
		}
		
		if (!req.body.username)
			return res.send({success: false, msg: 'invalid user name'});

		var sql = format('SELECT * FROM %I WHERE name = %L and passwd = %L', 'users', req.body.username, req.body.password);
		console.log('login: ' + sql);
		client.query(sql, function(err, result) {
			done();
			
			if (err)
				return res.send({success: false, msg: 'sorry failed to login'});
			else if (!result.rowCount)
				return res.send({success: false, msg: 'user doesn\'t exist, please sign up first'});
			else {
				req.session.user_id = result.rows[0].user_id;
				req.session.name = result.rows[0].name;
				console.log('User[' + req.session.user_id + '] logged in');
				return res.send({success: true, data: result});
			}
		});
	});
});

router.delete('/login', function(req, res, next) {
	if (!!req.isAuthorized) {
		req.session.destroy();
		console.log('logged out');
		return res.send({success: true});
	} else
		return res.send({success: false, msg: 'you didn\'t log in'});
});

module.exports = router;
