const config = require('../config/config.json');
var io = require('socket.io-client');
var socket = io.connect(config.server);
socket.on('connect', function() {console.log('Connected');})
    .on('connect_error', function() {
      console.log('Conn error');
      // process.exit(1);
    })
    .on('disconnect', function() {console.log('Disconnected'); });

socket.on('message', function (data) {
  console.log(data);
});

/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  // socket.emit('join', {name: randomString(6)});
  res.render('home', {
    title: 'Home'
  });
};

exports.chat = (req, res) => {
  socket.emit('join', {name: 'Thinhnv'});
  res.render('chat', {
    title: 'chat'
  });
};

function randomString(len) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var string_length = len;
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
}
