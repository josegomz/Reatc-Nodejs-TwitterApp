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

var fs = require('fs')
var http = require('http')
var https = require('https')

function startServer() {
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

    app.use('/public', express.static(__dirname + '/public'))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json({ limit: '10mb' }))

    if (process.env.NODE_ENV !== 'production') {
        app.use(require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: config.output.publicPath
        }))
        44.
    }

    app.use(vhost('api.*', api));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'index.html'))
    });

    app.listen(configuration.server.port, function () {
        console.log('Example app listening on port!'+configuration.server.port)
    });

    
}
if (require.main === module) {
    startServer();
} else {
    module.exports = startServer;
}