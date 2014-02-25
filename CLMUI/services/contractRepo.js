/**
 * Created by rbailey on 10/02/14.
 */

var azure = require('azure');
var tableService = azure.createTableService();
var config = require('../../config').config;
var Logger = require('../../services/logger').Logger;
var logger = new Logger('contractRepo');

var contractList = [
    { ukprn: 12345678, contractNo: "CE123", startDate: "01/08/2014", endDate: "31/07/2015", FSPCode: "OLASS_1415", orgUnitName: "SWE", contractValue: 20000.00 },
    { ukprn: 12345678, contractNo: "CE332", startDate: "01/08/2013", endDate: "31/07/2014", FSPCode: "16-18APPS_1415", orgUnitName: "CNM", contractValue: 15500.00 },
    { ukprn: 23456789, contractNo: "SW123", startDate: "01/08/2014", endDate: "31/07/2015", FSPCode: "ASTO_1415", orgUnitName: "CEM", contractValue: 54000.00 }
];

exports.Contract = function(ukprn) {
    if (typeof ukprn == "string")
        ukprn = parseInt(ukprn);

    this.ukprn = ukprn;
    this.contractNo = "";
    this.startDate = "";
    this.endDate = "";
    this.FSPCode = "";
    this.orgUnitName = "";
    this.contractValue = 0.0;
}


exports.getProviderContracts = function(ukprn, callback) {
    tableService.createTableIfNotExists(config.orgCache_TableName, function(err){
        if(!err){
            var query = azure.TableQuery
                .select()
                .from(config.contractStore_TableName)
                .where('PartitionKey eq ?', ukprn.toString());

            tableService.queryEntities(query, callback);
        } else {
            callback(err);
        }
    });
};


exports.getContract = function(ukprn, contractNo, callback){
    tableService.createTableIfNotExists(config.orgCache_TableName, function(err){
        if(!err){
            tableService.queryEntity(
                config.contractStore_TableName,
                ukprn,
                contractNo,
                callback);
        } else {
            callback(err);
        }
    });
}

exports.saveContract = function(modifiedContract, callback){
    tableService.createTableIfNotExists(config.contractStore_TableName, function(err) {
        if(!err){
                enrichEntityWithRowMetadata(modifiedContract);
                tableService.insertOrReplaceEntity(config.contractStore_TableName, modifiedContract, callback);
            } else {
                callback(err);
            }
        });

    function enrichEntityWithRowMetadata(entity){
        entity.PartitionKey = entity.ukprn.toString();
        entity.RowKey = entity.contractNo;

        return entity;
    }

}


exports.getContract_local = function(contractNo, callback){
    var selectedContract = contractList.filter(function(item){
        return item.contractNo === contractNo;
    });

    selectedContract = selectedContract.length == 1 ? selectedContract[0] : undefined;

    callback(null, selectedContract);
}

exports.saveContract_local = function(modifiedContract, callback){
    var selectedContract = contractList.filter(function(item){
        return item.contractNo === modifiedContract.contractNo;
    });

    if (selectedContract.length == 1) {
        var index = contractList.indexOf(selectedContract[0]);
        contractList[index] = modifiedContract;
    } else {
        contractList.push(modifiedContract);
    }

    callback(null, selectedContract);
}


exports.getProviderContracts_local = function(ukprn, callback) {
    var selectedContracts = contractList.filter(function(item){
        return item.ukprn === ukprn;
    });

    callback(null, selectedContracts);
};
