
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let Chat = require('../models/Chat.js');


server.listen(4000);

// socket io
io.on('connection', function (socket) {
    console.log('User connected');
    socket.on('disconnect', function() {
        console.log('User disconnected');
    });
    socket.on('save-message', function (data) {
        console.log(data);
        io.emit('new-message', { message: data });
    });
});

/* GET ALL CHATS */
router.get('/:room', function(req, res, next) {
    Chat.find({ room: req.params.room }, function (err, chats) {
        if (err) return next(err);
        res.json(chats);
    });
});

/* GET SINGLE CHAT BY ID */
router.get('/:id', function(req, res, next) {
    Chat.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});



/* SAVE CHAT */
router.post('/', function(req, res, next) {
    Chat.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE CHAT */
router.put('/:id', function(req, res, next) {
    Chat.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE CHAT */
router.delete('/:id', function(req, res, next) {
    Chat.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;