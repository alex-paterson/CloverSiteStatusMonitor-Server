const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./services/router');
const mongoose = require('mongoose');
const cors = require('cors');

var whitelist = [
    'http://localhost:3000',
    'http://pupper.org',
]
var globalCorsOptions = {
    origin: function(origin, callback) {
        callback(null, whitelist.indexOf(origin) !== -1);
    }
};

mongoose.connect('mongodb://localhost:clover/clover')

app.use(morgan('combined'));
app.use(cors(globalCorsOptions));
app.use(bodyParser.json({type:'*/*'}));
app.use('/v1', router);

var port = process.env.PORT || 3090;
var ip = process.env.IP || '127.0.0.1';
var server = http.createServer(app);

console.log("Server listening on: ", ip, ":", port);
server.listen(port, ip);
