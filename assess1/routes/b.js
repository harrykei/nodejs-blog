var express = require('express');
var itemSession = require('../session/itemSession');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	itemSession.getTotalCount().then(function(result) {
		req.params.totalCount = result.count;
		next();
	})
}, function(req, res, next) {
	var limit = 5;
	if (!req.query.offset)
		req.query.offset = 1;

	itemSession.getItemListByLimitAndOffset(limit, req.query.offset-1).then(function(result) {
		req.params.limit = limit;
		req.params.itemList = result;
		next();
	});
}, function(req, res, next) {
	res.render('part_b', {isAuthorized: !!req.isAuthorized, user_name: req.session.name, user_id: req.session.user_id, 
		offset: req.query.offset, totalCount: req.params.totalCount, limit: req.params.limit, items: req.params.itemList});
});

module.exports = router;