/**
 * Created by rbailey on 10/02/14.
 */

var azure = require('azure');
var tableService = azure.createTableService();
var config = require('../../config').config;
var Logger = require('../../services/logger').Logger;
var logger = new Logger('providerRepo');


var providerList = [
    { ukprn: 12345678, name: "Birmingham University", city: "Birmingham" },
    { ukprn: 23456789, name: "Aston University", city: "Birmingham" },
    { ukprn: 34567890, name: "St Andrews University", city: "St Andrews" }
];

exports.searchProviders = function(searchText, callback) {

    tableService.createTableIfNotExists(config.orgCache_TableName, function(err){
        if(!err){
            var query = azure.TableQuery
                .select()
                .from(config.orgCache_TableName);

            tableService.queryEntities(
                query, function(err, providers){
                    if (!err) {
                        var selectedProviders = providers.filter(function(item){
                            return item.name.indexOf(searchText) !== -1
                                || item.city.indexOf(searchText) !== -1;
                        });

                        callback(null, selectedProviders);
                    } else {
                        callback(err);
                    }
                });
        } else {
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
            callback(err);
        }
    });
};


exports.getProvider_old = function(ukprn, callback) {
    var provider = providerList.filter(function(item){
        return item.ukprn === ukprn;
    });

    provider = provider.length == 1 ? provider[0] : undefined;

    callback(null, provider);
};


exports.searchProviders_old = function(searchText, callback) {

    var selectedProviders = providerList.filter(function(item){
        return item.name.indexOf(searchText) !== -1
            || item.city.indexOf(searchText) !== -1;
    });

    callback(null, selectedProviders);
};