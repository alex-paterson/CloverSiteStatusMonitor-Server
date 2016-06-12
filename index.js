var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var router = require('./services/router');
var mongoose = require('mongoose');
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

mongoose.connect('mongodb://localhost:clover/clover');

app.use(morgan('combined'));
// app.use(cors(globalCorsOptions));
app.use(bodyParser.json({type:'*/*'}));

// app.options('*', cors());
// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://clovermon.online');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/v1', router);


var port = process.env.PORT || 3090;
var ip = process.env.IP || '127.0.0.1';
var server = http.createServer(app);

console.log("Server listening on: ", ip, ":", port);
server.listen(port, ip);
