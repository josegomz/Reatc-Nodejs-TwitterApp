var mongoose  = require('mongoose')
var configuration = require('./serverConfig')
const connectString = configuration.mongodb.connectionString

var opts = {
    useNewUrlParser: true,
    appname: "AnimalMongoDBTest",
    poolSize: 10,
    autoIndex: false,
    bufferMaxEntries: 0,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500,
    autoReconnect: true,
    loggerLevel: "error", //error / warn / info / debug
    keepAlive: 120,
    validateOptions: true
}

mongoose.connect(connectString, opts, function(err){
    if (err) throw err;
        console.log("==> Conexión establecida con MongoDB");
})