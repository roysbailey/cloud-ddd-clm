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