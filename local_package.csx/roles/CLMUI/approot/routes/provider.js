/**
 * Created by rbailey on 10/02/14.
 */

var providerRepo = require('../services/providerRepo');
var Logger = require('../services/logger').Logger;
var logger = new Logger('providerController');

exports.index = function(req, res){
    res.render('provider/index', { searchText: ''} );
}

exports.providerSearch = function(req, res){
    providerRepo.searchProviders(req.query.searchText, function(err, providers) {
        if (err){
            logger.logErr(err);
            res.redirect('/');
        } else {
            logger.log('searchProviders:' + req.query.searchText, 'Matching providers.  Count: ' + providers.length);
            res.render('provider/index', { providers: providers, fromSearch: true, searchText: req.query.searchText });
        }
    });
}

//exports.providerContracts = function(req, res){
//    providerRepo.searchProviders(req.query.searchText, function(err, data) {
//        res.render('provider/index', { providers: data, fromSearch: true, searchText: req.query.searchText });
//    });
//}
