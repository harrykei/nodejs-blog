var util = require('util');
var logger = util.debuglog('session.itemSession');
var pgp = require('pg-promise')({
    query: function(e) {
        logger('QUERY: ' + e.query);
    }
});

var db = pgp({
	host: 'localhost',
	port: 5432,
	database: 'mydb'
});

/*
 * items = {
 * 	item_id,
 * 	user_id,
 *  title,
 * 	content,
 * 	cretime,
 * 	uptime
 * }
 */

exports.createItem = function(item) {
	if (!item.user_id || !item.content) {
		var err = new Error('Invalid item id or content');
		err.status = -1;
		return err;
	}
	
	console.log(item);
	return db.query('INSERT INTO items(user_id, title, content, cretime) VALUES($1, $2, $3, CURRENT_TIMESTAMP) RETURNING item_id', 
			[item.user_id, item.title, item.content], pgp.queryResult.one);
}

exports.getItemByItemId = function(itemId) {
	return db.query('SELECT * FROM items WHERE item_id = $1', itemId, pgp.queryResult.any);
}

exports.updateItemByItemId = function(itemId, title, content) {
	return db.query('UPDATE items SET title = $1, content = $2, uptime = $3 WHERE itemid = $4', 
			[title, content, new Date(), itemIditemId], pgp.queryResult.none);
}

exports.deleteItemByItemId = function(itemId) {
	return db.query('DELETE FROM items WHERE item_id = $1', itemId, pgp.queryResult.none);
}

exports.getItemCountByUserId = function(userId) {
	return db.query('SELECT count(*) FROM items WHERE user_id = $1', userId, pgp.queryResult.one);
}

exports.getItemListByUserId = function(userId) {
	return db.query('SELECT * FROM items WHERE user_id = $1', userId, pgp.queryResult.any);
}

exports.getTotalCount = function() {
	return db.query('SELECT count(*) from items', undefined, pgp.queryResult.one);
}

exports.getItemListByLimitAndOffset = function(limit, offset) {
	return db.query('SELECT items.item_id, items.user_id, users.name, items.title, items.content, items.cretime, items.uptime FROM items, users '
			+ 'WHERE items.user_id = users.user_id ORDER BY items.cretime DESC LIMIT $1 OFFSET $2', [limit, offset], pgp.queryResult.any);	
}