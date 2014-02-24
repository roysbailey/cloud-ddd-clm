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
        } else {
            res.redirect('/');
        }
    });
}

exports.contractCreate = function(req, res) {
    var ukprnNum = parseInt(req.params.ukprn);
    var emptyContract = new contractRepo.Contract(ukprnNum);
    emptyContract.ukprn = ukprnNum;
    var vm = { mode: "create", isCreate: true, createdTakeTwo: 0 === 0, contract: emptyContract};
    res.render('contract/contractEdit', vm);
}

exports.contractCreatePost = function(req, res) {
    var updatedContract = new contractRepo.Contract(req.body.ukprn);
    updatedContract.contractNo = req.body.contractNo;
    updatedContract.startDate = req.body.startDate;
    updatedContract.endDate = req.body.endDate;
    updatedContract.FSPCode = req.body.FSPCode;
    updatedContract.orgUnitName = req.body.orgUnitName;
    updatedContract.contractValue = req.body.contractValue;
    contractRepo.saveContract(updatedContract, function(err, data) {
        res.redirect('contract/' + req.body.ukprn);
    });
}


exports.contractEdit = function(req, res) {
    var contract = contractRepo.getContract(req.params.contractNo, function(err, contract){
        if (contract){
            var vm = { mode: "update", isCreate: false, createdTakeTwo: 1 === 0, contract: contract};
            res.render('contract/contractEdit', vm);
        } else {
            res.redirect('/');
        }
    });
}




