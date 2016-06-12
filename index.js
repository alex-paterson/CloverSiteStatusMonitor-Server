var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var app = express();
var router = require('./services/router');
var cors = require('cors');

var whitelist = [
  'http://localhost:3000',
  'http://clovermon.online'
];
var globalCorsOptions = {
    origin: function(origin, callback) {
        callback(null, whitelist.indexOf(origin) !== -1);
    }
};

mongoose.connect('mongodb://localhost:clover/clover', function(err) {
  if (err) { console.log(err); return; }
  console.log("Client DB: connected");

  app.use(morgan('combined'));
  app.use(cors(globalCorsOptions));
  app.use(bodyParser.json({type:'*/*'}));
  app.use('/v1', router);

  var port = process.env.PORT || 3090;
  var ip = process.env.IP || 'localhost';
  var server = http.createServer(app);

  console.log("Server listening on: ", ip, ":", port);
  server.listen(port, ip);
});
