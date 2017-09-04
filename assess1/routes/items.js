var express = require('express')
var itemSession = require('../session/itemSession');
var router = express.Router();
var util = require('util');
var logger = util.debuglog('routes.items');

router.get('/', function(req, res, next) {
	itemSession.getItemListByLimitAndOffset(10, req.query.offset).then(function(result) {
		return res.send({success: true, data: result});
	}).catch(function(err) {
		console.err(err);
		res.send({success:false, msg: 'sorry, failed to get list'});
	});
});

router.get('/:user_id', function(req, res, next) {
	if (!req.session.user_id || req.sesion.user_id != req.params.user_id)
		return res.send({success: false, msg: 'invalid user'});
	
	itemSession.getItemListByUserId(req.session.user_id).then(function(result) {
		return res.send({success: true, data: result});
	}).catch(function(err) {
		console.err(err);
		return res.send({success: false, msg: 'sorry, failed to get your items'});
	});
});
	
router.post('/', function(req, res, next) {
	if (!req.session.user_id)
		return res.send({success: false, msg: 'invalid user'});
	if (!req.body.content)
		return res.send({success: false, msg: 'invalid content'});
	
	var itemVo = {user_id: req.session.user_id, title: req.body.title, content: req.body.content};
	itemSession.createItem(itemVo).then(function(result) {
		logger('Item[' + result + '] inserted');
		return res.send({success: true});
	}).catch(function(err) {
		console.err(err);
		return res.send({success: false, msg: 'sorry, failed to create item'});
	});
});

router.put('/:item_id', function(req, res, next) {
	if (!req.session.user_id)
		return res.send({success: false, msg: 'invalid user'});
	if (!req.body.item_id)
		return res.send({success: false, msg: 'invalid item'});
	if (!req.body.title)
		return res.send({success: false, msg: 'title doesn\'t exist'});
	if (!req.body.content)
		return res.send({success: false, msg: 'msg doesn\'t exist'});
	
	itemSession.getItemByItemId(req.params.item_id).then(function(result) {
		if (result) {
			next();
		} else {
			return res.send({success: false, msg: req.params.item_id+' doesn\'t exist'});
		}
	}).catch(function(err) {
		console.err(err);
		return res.send({success: false, msg: 'sorry, failed to get item'});
	});
}, function(req, res, next) {
	itemSession.updateItemByItemId(req.body.item_id, req.body.title, req.body.content).then(function() {
		return res.send({success: true});
	}).catch(function(err) {
		console.log(err);
		return res.send({success: false, msg: 'sorry, failed to update item'});
	});
});

router.delete('/:item_id', function(req, res, next) {
	if (!req.session.user_id)
		return res.send({success: false, msg: 'invalid user'});
	if (!req.params.item_id)
		return res.send({success: false, msg: 'invalid content'});
	console.log('item_id: ' + req.params.item_id);
	itemSession.getItemByItemId(req.params.item_id).then(function(result) {
		if (result.length)
			next();
		else if (result.user_id != req.session.user_id)
			return res.send({success: false, msg: 'it\s not your item'});
		else
			return res.send({success: false, msg: req.params.item_id+' doesn\'t exist'});
	}).catch(function(err) {
		console.log(err);
		return res.send({success: false, msg: 'sorry, failed to get item'});
	});

}, function(req, res, next) {
	itemSession.deleteItemByItemId(req.params.item_id).then(function() {
		return res.send({success: true});
	}).catch(function(err) {
		console.err(err);
		return res.send({success: false, msg: 'sorry, failed to delete item'});
	});
});

module.exports = router;