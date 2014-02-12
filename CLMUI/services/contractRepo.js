/**
 * Created by rbailey on 10/02/14.
 */

var contractList = [
    { ukprn: 12345678, contractNo: "CE123", startDate: "01/08/2014", endDate: "31/07/2015", FSPCode: "EOF1415", orgUnitName: "Central England", contractValue: 20000.00 },
    { ukprn: 12345678, contractNo: "CE332", startDate: "01/08/2013", endDate: "31/07/2014", FSPCode: "EOF1314", orgUnitName: "Central England", contractValue: 15500.00 },
    { ukprn: 23456789, contractNo: "SW123", startDate: "01/08/2014", endDate: "31/07/2015", FSPCode: "EOF1415", orgUnitName: "Central England", contractValue: 54000.00 }
];

exports.getProviderContracts = function(ukprn, callback) {
    var selectedContracts = contractList.filter(function(item){
       return item.ukprn === ukprn;
    });

    callback(null, selectedContracts);
};

exports.Contract = Contract;

exports.getContract = getContract;

exports.saveContract = function(ukprn, contractNo, startDate, endDate, FSPCode, orgUnitName, contractValue, callback) {
    getContract(contractNo, function(err, contract){
        var isCreating = !contract;
        if (isCreating) {
            contract = new Contract(ukprn);
            contract.contractNo = contractNo;
        }
        contract.endDate = endDate;
        contract.FSPCode = FSPCode
        contract.startDate = startDate;
        contract.orgUnitName = endDate;
        contract.contractValue = contractValue;

        if (isCreating) {
            contractList.push(contract);
        }

        callback(null, contract);
    });
}


function getContract(contractNo, callback){
    var selectedContract = contractList.filter(function(item){
        return item.contractNo === contractNo;
    });

    selectedContract = selectedContract.length == 1 ? selectedContract[0] : undefined;

    callback(null, selectedContract);
}

function Contract(ukprn) {
    this.ukprn = ukprn;
    this.contractNo = "";
    this.startDate = "";
    this.endDate = "";
    this.FSPCode = "";
    this.orgUnitName = "";
    this.contractValue = 0.0;
}