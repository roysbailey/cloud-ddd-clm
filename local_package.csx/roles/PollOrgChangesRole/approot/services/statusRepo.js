/**
 * Created by rbailey on 15/01/14.
 */

var azure = require('azure');
var tableService = azure.createTableService();
var orgImportRunDetailsTableName = 'orgImportRunDetails';
var orgImportRunDetailsPartitionKey = 'orgImportRunDetailsPartition';
var orgImportRunDetailsRowKey = '1';

var Logger = require('./logger').Logger;
var logger = new Logger('statusRepo');

exports.getLatestImportDetails = function(callback){
    tableService.createTableIfNotExists(orgImportRunDetailsTableName, function(err){
        if(!err){
            logger.log('getLatestImportDetails', 'Table open')
            tableService.queryEntity(
                orgImportRunDetailsTableName,
                orgImportRunDetailsPartitionKey,
                orgImportRunDetailsRowKey,
                function(err, orgImportRunDetails){
                    if (!err){
                        logger.log('getLatestImportDetails', 'Loaded orgImportRunDetails from table')
                        callback(null, orgImportRunDetails);
                    } else if (err.statusCode === 404) {
                        logger.log('getLatestImportDetails', 'Could not find entry in table: orgImportRunDetails so creating blank seed entry')
                        orgImportRunDetails = createBlankorgImportRunDetails();
                        updateLatestImportDetails(orgImportRunDetails, function(err){
                            logger.log('getLatestImportDetails', 'Created blank seed entry with date: ' + orgImportRunDetails.lastImportedItemUpdateDate)
                            callback(err, orgImportRunDetails);
                        });
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

exports.putLatestImportDetails = function(latestProcessedEventDate, callback){
    var lastImportDetails = createBlankorgImportRunDetails();
    lastImportDetails.lastImportedItemUpdateDate = latestProcessedEventDate;
    logger.log('putLatestImportDetails', 'About to save last import details.  Last processed event: ' + latestProcessedEventDate);
    updateLatestImportDetails(lastImportDetails, callback);
}

function updateLatestImportDetails(lastImportDetails, callback){
    tableService.createTableIfNotExists(orgImportRunDetailsTableName, function(err){
        if(!err){
            logger.log('updateLatestImportDetails', 'Table openned ok');
            tableService.insertOrMergeEntity(orgImportRunDetailsTableName, lastImportDetails, function(err, data){
                logger.log('updateLatestImportDetails', 'Latest run details saved correctly to table storage');
                callback(null);
            });
        } else {
            logger.logErr(err);
            callback(err);
        }
    });
}

function createBlankorgImportRunDetails(){
    var orgImportRunDetails = {
        PartitionKey : orgImportRunDetailsPartitionKey
        , RowKey : orgImportRunDetailsRowKey
        , lastImportedItemUpdateDate : '2000-01-01 00:00:00'
    };

    return orgImportRunDetails;
}