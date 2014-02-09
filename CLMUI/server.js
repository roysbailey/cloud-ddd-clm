var express = require('express'),
    path = require('path'),
    home = require('./routes/home.js'),
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
app.get('/provider-search', home.providerSearch);

app.listen(port);