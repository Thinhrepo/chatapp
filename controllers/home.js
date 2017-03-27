const config = require('../config/config.json');
const bluebird = require('bluebird');
const request = bluebird.promisifyAll(require('request'), { multiArgs: true });

/* Model require */
var User = require('../models/User');
// var io = require('socket.io-client');
// var socket = io.connect(config.server);
// socket.on('connect', function() {console.log('Connected');})
//     .on('connect_error', function() {
//       console.log('Conn error');
//       // process.exit(1);
//     })
//     .on('disconnect', function() {console.log('Disconnected'); });
//
// socket.on('message', function (data) {
//   console.log(data);
// });

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  User.find({}, function (err, listUsers) {
    if(err)
      return next(err);

    console.log(listUsers);
    res.render('home', {
      title: 'Home',
      data: listUsers
    });
  });
};

exports.chat = (req, res) => {
  // socket.emit('join', {name: 'Thinhnv'});

  res.render('chat', {
    title: 'chat'
  });
};

exports.updateSocket = function (req, res) {
  var socketId = req.params.socketId;
  User.findOne({email: req.user.email}, function (err, user) {
    if(err)
      return next(err);

    console.log(user);
    user.socketId = socketId;
    user.save(function (err) {
      if(err){
        console.log(err);
        process.exit(1);
      }else
        res.send(200);
    });
  });
};