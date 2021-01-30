var express = require('express');
var app = express();
var bodyParser = require("body-parser")
var path = require('path')
var webpack = require('webpack')
var config = require('./webpack.config')
var compiler = webpack(config)
var mongoose = require('mongoose')
var configuration = require('./serverConfig')
var vhost = require('vhost')
var api = require('./api/api')

var opts = {
    useNewUrlParser: true,
    appname: "Mini Twitter",
    poolSize: 10,
    autoIndex: false,
    bufferMaxEntries: 0,
    loggerLevel: "error", //error / warn / info / debug
    keepAlive: 120,
    validateOptions: true,
    useUnifiedTopology: true
}

let connectString = configuration.mongodb.connectionString
mongoose.connect(connectString, opts, function (err) {
    if (err) throw err;
    console.log("==> Conexión establecida con MongoDB");
})

app.use('*', require('cors')());
/*app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/

app.use('/public', express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}))

app.use(vhost('api.*', api));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(configuration.server.port, function () {
    console.log('Example app listening on port 8080!')
});