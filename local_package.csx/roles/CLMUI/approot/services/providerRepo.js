/**
 * Created by rbailey on 10/02/14.
 */

var azure = require('azure');
var tableService = azure.createTableService();
var config = require('../config').config;
var Logger = require('./logger').Logger;
var logger = new Logger('providerRepo');

exports.searchProviders = function(searchText, callback) {

    tableService.createTableIfNotExists(config.orgCache_TableName, function(err){
        if(!err){
            logger.log('searchProviders:' + searchText, 'Table open, about to search storage');
            var query = azure.TableQuery
                .select()
                .from(config.orgCache_TableName);

            tableService.queryEntities(
                query, function(err, providers){
                    logger.log('searchProviders:' + searchText, 'All providers found: ' + providers.length);
                    if (!err) {
                        var selectedProviders = providers.filter(function(item){
                            return item.name.indexOf(searchText) !== -1
                                || item.city.indexOf(searchText) !== -1;
                        });

                        logger.log('searchProviders:' + searchText, 'Num providers matching query: ' + providers.length);
                        callback(null, selectedProviders);
                    } else {
                        logger.logErr(err);
                        callback(err);
                    }
                });
        } else {
            logger.logErr(err);
            callback(err);
        }
    });
};

exports.getProvider = function(ukprn, callback) {
    tableService.createTableIfNotExists(config.orgCache_TableName, function(err){
        if(!err){
            tableService.queryEntity(
                config.orgCache_TableName,
                config.orgCache_PartitionKey,
                ukprn.toString(),
                callback);
        } else {
            logger.logErr(err);
            callback(err);
        }
    });
};
