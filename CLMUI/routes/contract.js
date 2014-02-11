/**
 * Created by rbailey on 10/02/14.
 */

var providerRepo = require('../services/providerRepo');
var contractRepo = require('../services/contractRepo');

exports.providerContracts = function(req, res){
    var ukprnNum = parseInt(req.params.ukprn);
    providerRepo.getProvider(ukprnNum, function(err, provider){
        if (provider) {
            contractRepo.getProviderContracts(ukprnNum, function(err, contracts){
                res.render('contract/ProviderContracts', { provider: provider, contracts: contracts });
                return;
            });
        }
    });

    res.redirect('/');
}

exports.contractCreate = function(req, res) {
    res.send("Display create contract");
}

exports.contractDetail = function(req, res) {
    res.send("Display contract details");
}




