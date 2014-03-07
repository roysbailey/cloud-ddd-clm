// Require our external dependencies.
var express = require('express'),
    io = require('socket.io'),
    path = require('path'),
    home = require('./routes/home'),
    provider = require('./routes/provider'),
    contract = require('./routes/contract'),
    pollForChanges = require('./processors/pollForChanges').pollForChanges,
    webEventPublisher = require('./eventPublication/webEventPublisher');

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
webEventPublisher.initialise(io);
pollForChanges(webEventPublisher.onRefreshedOrgsCallback, webEventPublisher.onOrgEventCallback);

// Listen on the web port for our web app requests.
var port = process.env.port || 8080;
server.listen(port);


