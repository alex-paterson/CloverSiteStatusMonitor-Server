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
    'http://clovermon.online',
    'clovermon.online'
];
var globalCorsOptions = {
    origin: function(origin, callback) {
        callback(null, whitelist.indexOf(origin) !== -1);
    }
};

mongoose.connect('mongodb://localhost:clover/clover');

app.use(morgan('combined'));
app.options('*', cors());
app.use(cors(globalCorsOptions));
app.use(bodyParser.json({type:'*/*'}));

app.use('/v1', router);


var port = process.env.PORT || 3090;
var ip = process.env.IP || '127.0.0.1';
var server = http.createServer(app);

console.log("Server listening on: ", ip, ":", port);
server.listen(port, ip);
