/**
 * Created by rbailey on 15/01/14.
 */

var azure = require('azure');
var tableService = azure.createTableService();
var orgImportRunDetailsTableName = 'orgImportRunDetails';
var orgImportRunDetailsPartitionKey = 'orgImportRunDetailsPartition';
var orgImportRunDetailsRowKey = '1';

exports.getLatestImportDetails = function(callback){
    tableService.createTableIfNotExists(orgImportRunDetailsTableName, function(err){
        if(!err){
            tableService.queryEntity(
                orgImportRunDetailsTableName,
                orgImportRunDetailsPartitionKey,
                orgImportRunDetailsRowKey,
                function(err, orgImportRunDetails){
                    if (!err){
                        callback(null, orgImportRunDetails);
                    } else if (err.statusCode === 404) {
                        orgImportRunDetails = createBlankorgImportRunDetails();
                        updateLatestImportDetails(orgImportRunDetails, function(err){
                            callback(err, orgImportRunDetails);
                        });
                    } else {
                        callback(err);
                    }
                });
        } else {
            callback(err);
        }
    });
};

exports.putLatestImportDetails = function(latestProcessedEventDate, callback){
    var lastImportDetails = createBlankorgImportRunDetails();
    lastImportDetails.lastImportedItemUpdateDate = latestProcessedEventDate;
    updateLatestImportDetails(lastImportDetails, callback);
}

function updateLatestImportDetails(lastImportDetails, callback){
    tableService.createTableIfNotExists(orgImportRunDetailsTableName, function(err){
        if(!err){
            tableService.insertOrMergeEntity(orgImportRunDetailsTableName, lastImportDetails, function(err, data){
                callback(err);
            });
        } else {
            callback(err);
        }
    });
}

function createBlankorgImportRunDetails(){
    var orgImportRunDetails = {
        PartitionKey : orgImportRunDetailsPartitionKey
        , RowKey : orgImportRunDetailsRowKey
        , lastImportedItemUpdateDate : '2014-01-15'
    };

    return orgImportRunDetails;
}