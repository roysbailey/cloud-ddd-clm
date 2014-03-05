// Require our external dependencies.
var express = require('express'),
    io = require('socket.io'),
    path = require('path'),
    async = require('async'),
    home = require('./routes/home'),
    provider = require('./routes/provider'),
    contract = require('./routes/contract'),
    pollForChanges = require('./processors/pollForChanges').pollForChanges;

// Create our express server, and hook up to http and socket.io
var app = express()
    ,server = require('http').createServer(app)
    ,io = io.listen(server);

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: path.join(__dirname, '/pictures')}));
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
});

// Configure our routes.
app.get('/', home.index);
app.get('/provider', provider.index);
app.get('/provider/search', provider.providerSearch);
app.get('/contract/:ukprn', contract.providerContracts);
app.get('/contract/:ukprn/create', contract.contractCreate);
app.get('/contract/:ukprn/:contractNo/edit', contract.contractEdit);
app.post('/contract/:ukprn', contract.contractCreatePost);

// In the background, start polling the azure queue for any changes to the underlying org cache.
pollForChanges(onRefreshedOrgsCallback, onOrgEventCallback);

// Listen on the web port for our web app requests.
var port = process.env.port || 8080;
server.listen(port);

io.sockets.on('connection', function (socket) {
    socket.on('selected provider', function (data) {
        console.log('Client selected new provider with UKPRN: ' + data);
        socket.set('provider', data);
    });
});

// Called whenever a refresh has occurred, regardless of whether or NOT any updates were made...
// TODO - look a socket.io namespances here!
function onRefreshedOrgsCallback(err, data) {
    if (!err) {
        var connectedClients = io.sockets.clients();
        async.each(connectedClients,
            function(item, callback){
                // Sending as volatile, as it is not the end of the world if a client does not receive the update.
                item.volatile.emit('onRefreshedOrgs', data);
                callback();
            },
            function(err) {
                console.log('[onRefreshedOrgsCallback] - updated all clients');
            }
        );
    } else {
        console.log('[onRefreshedOrgsCallback] Error: ' + err);
    }
}

// Called whenever an event is processed for a given org.
function onOrgEventCallback(err, wrappedEvent) {
    if (!err) {
        // Get our list of all connections, and sent a socket message to any who are listening for our provider:
        var connectedClients = io.sockets.clients();
        async.filter(connectedClients,
            function(socket, callback) {
                socket.get('provider', function(err, ukprn) {
                    if (!err)
                        callback(wrappedEvent.event.content.ukprn === ukprn);
                    else
                        callback(false);
                });
            },
            function(results) {
                // Now we have a list of all clients interested in our provider,
                // lets send them an updated message!
                async.each(results, function(socket, callback){
                    socket.emit('onOrgEvent', wrappedEvent);
                    callback(null);
                });
            }
        );
    } else {
        console.log('[onOrgEventCallback] Error: ' + err);
    }
}