var util = require('util');
var logger = util.debuglog('session.itemSession');
var pgp = require('pg-promise')({
    query: function(e) {
        logger('QUERY: ' + e.query);
    }
});

//var connectString = process.env.DATABASE_URL || 'postgres://localhost:5432/mydb';
// var db = pgp(connectString);
var db = pgp({
	host: 'localhost',
	port: 5432,
	database: 'mydb'
});
var qrm = pgp.queryResult;
/*
var pool = new pg.Pool({
	host: 'localhost',
	database: 'mydb'
});
*/

/*
 * items = {
 * 	item_id,
 * 	user_id,
 * 	content,
 * 	cretime,
 * 	uptime
 * }
 */

exports.createItem = function(item) {
	if (!item.user_id || !item.content) {
		console.err('tried to insert Invalid item');
		return -1;
	}
	
	return db.query('INSERT INTO items(user_id, content, cretime) VALUE($1, $2, $3)', [item.user_id, item.content, new date()], pgp.queryResult.none);
	/*
	pool.connect(function(err, client, done) {
		if (err) {
			done();
			console.err(err);
			return -1;
		}
		
		var sql = format('INSERT INTO items(user_id, content, cretime) VALUE(%L)', [item.user_id, item.content, new date()]);
		logger('createItem: ' + sql);
		client.query(sql, function(err,result) {
			done();
			if (err)
				return -1;
			else
				return result.rowCount;
		});
	});
	*/
}

exports.getItemByItemId = function(itemId) {
	return db.query('SELECT * FROM items WHERE itemid = $1', itemId, pgp.queryResult.any);
/*
	pool.connect(function(err, client, done) {
		if (err) {
			done();
			console.err(err);
			return -1;
		}

		var sql = format('SELECT * FROM items WHERE itemid = %L', itemId);
		logger('getItemByItemId: ' + sql);
		client.query(sql, function(err,result) {
			done();
			if (err) {
				console.err(err);
				return -1;
			}
			else
				return result.rows[0];
		});
	});
	*/
}

exports.updateItemByItemId = function(itemId, content) {
	return db.query('UPDATE items SET content = $1, uptime = $2 WHERE itemid = $3', [content, new Date(), itemIditemId], pgp.queryResult.none);
	/*
	pool.connect(function(err, client, done) {
		if (err) {
			done();
			console.err(err);
			return -1;
		}

		var sql = format('UPDATE items SET content = %L, uptime = %L WHERE itemid = %L', content, new Date(), itemId);
		logger('updateItemByItemId: ' + sql);
		client.query(sql, function(err,result) {
			done();
			if (err) {
				console.err(err);
				return -1;
			}
			else
				return result.rowCount;
		});
	});
	*/
}

exports.deleteItemByItemId = function(itemId) {
	return db.query('DELETE FROM items WHERE item_id = $1', itemId, pgp.queryResult.none);
	/*
	pool.connect(function(err, client, done) {
		if (err) {
			done();
			console.err(err);
			return -1;
		}
		
		var sql = format('DELETE FROM items WHERE item_id = %L', itemId);
		logger('deleteItemByItemId: ' + sql);
		client.query(sql, function(err,result) {
			done();
			if (err) {
				console.err(err);
				return -1;
			}
			else
				return result.rowCount;
		});
	});
	*/
}

exports.getItemCountByUserId = function(userId) {
	return db.query('SELECT count(*) FROM items WHERE user_id = $1', userId, pgp.queryResult.one);
	/*
	pool.connect(function(err, client, done) {
		if (err) {
			done();
			console.err(err);
			return -1;
		}
		
		var sql = format('SELECT count(*) FROM items WHERE user_id = %L', userId);
		logger('getItemCountByUserId: ' + sql);
		client.query(sql, function(err,result) {
			done();
			if (err) {
				console.err(err);
				return -1;
			} else
				return result.rows[0];
		});
	});
	*/
}

exports.getItemListByUserId = function(userId) {
	return db.query('SELECT * FROM items WHERE user_id = $1', userId, pgp.queryResult.any);
	/*
	pool.connect(function(err, client, done) {
		if (err) {
			done();
			console.err(err);
			return -1;
		}
		
		var sql = format('SELECT * FROM items WHERE user_id = %L', userId);
		logger('getItemListByUserId: ' + sql);
		client.query(sql, function(err,result) {
			done();
			if (err) {
				console.err(err);
				return -1;
			}
			else
				return result.rows;
		});
	});
	*/
}

exports.getTotalCount = function() {
	return db.query('SELECT count(*) from items', undefined, pgp.queryResult.any);
	/*
	pool.connect(function(err, client, done) {
		if (err) {
			done();
			console.err(err);
			return -1;
		}
		
		var sql = format('SELECT count(*) from items');
		logger('getTotalCount: ' + sql);
		client.query(sql, function(err,result) {
			done();
			if (err) {
				console.err(err);
				return -1;
			} else
				return result.rows[0];
		});
	});
	*/
}

exports.getItemListByLimitAndOffset = function(limit, offset) {
	return db.query('SELECT * FROM items ORDER BY cretime DESC LIMIT $1 OFFSET $2', [limit, offset], pgp.queryResult.any);	
	/*
	pool.connect(function(err, client, done) {
		if (err) {
			done(err, NULL);
			console.err(err);
			return next(-1);
		}
		
		var sql = format('SELECT * FROM items ORDER BY cretime DESC LIMIT %L OFFSET %L', limit, offset);
		logger('getItemListByLimitAndOffset: ' + sql);

		var query = client.query(sql, function(err,result, next) {
			if (err) {
				console.err(err);
				return next(-1);
			} else
				return next(result.rows)
		});
	});
	*/
}