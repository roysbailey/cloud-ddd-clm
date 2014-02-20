var express = require('express'),
    path = require('path'),
    home = require('./routes/home'),
    provider = require('./routes/provider'),
    contract = require('./routes/contract'),
    port = process.env.port || 1337;

var app = express();

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: path.join(__dirname, '/pictures')}));
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', home.index);
app.get('/provider', provider.index);
app.get('/provider/search', provider.providerSearch);
app.get('/contract/:ukprn', contract.providerContracts);
app.post('/contract/:ukprn', contract.contractCreatePost);
app.get('/contract/:ukprn/create', contract.contractCreate);
app.get('/contract/:ukprn/:contractNo/edit', contract.contractEdit);

app.listen(port);