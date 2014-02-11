/**
 * Created by rbailey on 10/02/14.
 */

var providerRepo = require('../services/providerRepo');

exports.index = function(req, res){
    res.render('provider/index', { searchText: ''} );
}

exports.providerSearch = function(req, res){
    providerRepo.searchProviders(req.query.searchText, function(err, data) {
        res.render('provider/index', { providers: data, fromSearch: true, searchText: req.query.searchText });
    });
}

exports.providerContracts = function(req, res){
    providerRepo.searchProviders(req.query.searchText, function(err, data) {
        res.render('provider/index', { providers: data, fromSearch: true, searchText: req.query.searchText });
    });
}
