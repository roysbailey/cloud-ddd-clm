/**
 * Created by Roy on 24/01/14.
 */

var azure = require('azure');
var tableService = azure.createTableService();
var config = require('../../config').config;
var Logger = require('../../services/logger').Logger;
var logger = new Logger('orgCacheRepo');


exports.deleteOrgFromCache = function(ukprn, callback){
    tableService.createTableIfNotExists(config.orgCache_TableName, function(err){
        if(!err){
            tableService.deleteEntity(
                config.orgCache_TableName,
                {
                    PartitionKey: config.orgCache_PartitionKey,
                    RowKey: ukprn.toString()
                },
                callback
                );
        } else {
            callback(err);
        }
    });
};

exports.upsertOrg = function(org, callback){
    tableService.createTableIfNotExists(config.orgCache_TableName, function(err){
        if(!err){
            enrichEntityWithRowMetadata(org, org.ukprn.toString());
            tableService.insertOrMergeEntity(config.orgCache_TableName, org, callback);
        } else {
            callback(err);
        }
    });

    function enrichEntityWithRowMetadata(entity, rowid){
        entity.PartitionKey = config.orgCache_PartitionKey;
        entity.RowKey = rowid;

        return entity;
    }
}

