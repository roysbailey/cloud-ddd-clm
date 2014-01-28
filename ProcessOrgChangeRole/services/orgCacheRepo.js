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
            // Check the version in the cache with the version in the event. DONT overwrite new cache with STALE event!
            checkDoUpdate(org, function(err){
                if (!err || err.statusCode === 404){
                    enrichEntityWithRowMetadata(org, org.ukprn.toString());
                    stringifyEntity(org);
                    tableService.insertOrReplaceEntity(config.orgCache_TableName, org, callback);
                } else {
                    if (err.statusCode === 304) {
                        callback(null, org);
                    } else {
                        callback(err);
                    }
                }
            });
        }
    });

    function enrichEntityWithRowMetadata(entity, rowid){
        entity.PartitionKey = config.orgCache_PartitionKey;
        entity.RowKey = rowid;

        return entity;
    }

    function checkDoUpdate(updatedOrg, callback){
        var query = azure.TableQuery
            .select('metadata')
            .from(config.orgCache_TableName)
            .where('PartitionKey eq ?', config.orgCache_PartitionKey)
                .and('RowKey eq ?', updatedOrg.ukprn.toString());

        tableService.queryEntities(query, function(err, entities){
            if(!err){
                if (entities.length === 0) {
                    // Not in the DB at the moment, so insert...
                    callback({statusCode: 404});
                } else {
                    var orgInCache = entities[0];
                    objectifyEntity(orgInCache);
                    if (orgInCache.metadata.version < updatedOrg.metadata.version) {
                        // older version in DB, so update
                        callback(null);
                    } else {
                        // same or newer version in DB, DONT update
                        callback({statusCode: 304});
                    }
                }
            } else {
                callback(err);
            }
        });
    }

    function stringifyEntity(cachedOrgEntity) {
        cachedOrgEntity.metadata = JSON.stringify(cachedOrgEntity.metadata);
    }

    function objectifyEntity(cachedOrgEntity) {
        cachedOrgEntity.metadata = JSON.parse(cachedOrgEntity.metadata);
    }
}

