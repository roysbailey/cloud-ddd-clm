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
    var ukprnNum = parseInt(req.params.ukprn);
    var emptyContract = new contractRepo.Contract(ukprnNum);
    emptyContract.ukprn = ukprnNum;
    res.render('contract/contractEdit', { mode: "create", contract: emptyContract });
}

exports.contractEdit = function(req, res) {
    var contract = contractRepo.getContract(req.params.contractNo, function(err, contract){
        res.render('contract/contractEdit', { mode: "update", contract: contract});
        return;
    });

    res.redirect('/');
}




