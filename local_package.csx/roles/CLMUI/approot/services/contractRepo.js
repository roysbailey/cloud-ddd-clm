/**
 * Created by rbailey on 10/02/14.
 */

var azure = require('azure');
var tableService = azure.createTableService();
var config = require('../config').config;
var Logger = require('./logger').Logger;
var logger = new Logger('contractRepo');

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
            logger.log('getProviderContracts: ' + ukprn, 'Azure table open, about to query storage')
            var query = azure.TableQuery
                .select()
                .from(config.contractStore_TableName)
                .where('PartitionKey eq ?', ukprn.toString());

            tableService.queryEntities(query, callback);
        } else {
            logger.logErr(err);
            callback(err);
        }
    });
};

exports.getContract = function(ukprn, contractNo, callback){
    tableService.createTableIfNotExists(config.orgCache_TableName, function(err){
        if(!err){
            logger.log('getContract: ' + contractNo, 'Azure table open, about to query storage')
            tableService.queryEntity(
                config.contractStore_TableName,
                ukprn,
                contractNo,
                callback);
        } else {
            logger.logErr(err);
            callback(err);
        }
    });
}

exports.saveContract = function(modifiedContract, callback){
    tableService.createTableIfNotExists(config.contractStore_TableName, function(err) {
        if(!err){
                logger.log('saveContract: ' + modifiedContract.contractNo, 'Azure table open, about to save to storage')
                enrichEntityWithRowMetadata(modifiedContract);
                tableService.insertOrReplaceEntity(config.contractStore_TableName, modifiedContract, callback);
            } else {
                logger.logErr(err);
                callback(err);
            }
        });

    function enrichEntityWithRowMetadata(entity){
        entity.PartitionKey = entity.ukprn.toString();
        entity.RowKey = entity.contractNo;

        return entity;
    }
}

