'use strict';

var express = require('express');
var controller = require('./threecardpoker.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/getdeck/:id', controller.downloadDeck);
router.get('/decypher/:id', auth.isAuthenticated(), controller.downloaddecypher);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.shuffle);
router.put('/deal/:id', auth.isAuthenticated(), controller.create);
router.put('/resolve/:id', auth.isAuthenticated(), controller.resolveGame);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;