/**
 * Created by rbailey on 16/01/14.
 */

var Client = require('node-rest-client').Client;
var restClient = new Client();
var hostName = "http://localhost:1337";
var eventSourceEntryPoint = hostName + '/providers/notifications';

exports.findFeedContainingUpdate = function(lastImportedItemUpdateDate, callback){

    if (lastImportedItemUpdateDate !== '2000-01-01 00:00:00') {
        // Start looking from the "recent feeds" entry point
        processFeed(eventSourceEntryPoint);
    } else {
        findFirstFeed(eventSourceEntryPoint);
    }

    function processFeed(uri) {
        getFeedFromURI(uri, function(err, data){
            if (!err){
                checkFeedContainsProcessDate(data, lastImportedItemUpdateDate);
            } else {
                callback(err);
            }
        });
    }

    function checkFeedContainsProcessDate(feedObj, dateToMatch) {
        var entriesWithMatchingDate = feedObj.entries.filter(function(entry){
           return  entry.createdDate === dateToMatch;
        });

        if (entriesWithMatchingDate.length > 0) {
            callback(null, feedObj);
        } else {
            if (feedObj._links.previousArchive) {
                processFeed(hostName + feedObj._links.previousArchive.href);
            } else {
                // Did not find the created date in ANY feed :-(
                callback({ statusCode: 404 }, feedObj);
            }
        }
    }

    function findFirstFeed(url) {
        getFeedFromURI(url, function(err, feedObj) {
           if (!err) {
               if (feedObj.links.previousArchive) {
                   findFirstFeed(feedObj.links.previousArchive);
               } else {
                   callback(null, feedObj);
               }
           } else {
               callback(err);
           }
        });
    }
};

exports.getFeedFromURI = function(feedURI, callback){
    getFeedFromURI(feedURI, callback);
};



function getFeedFromURI(feedURI, callback){
    restClient.get(feedURI, function(data, response){
        var feedObj = JSON.parse(data);
        callback(null, feedObj);
    }).on('error',function(err){
            console.log('something went wrong on the request', err.request.options);
            callback(err);
        });
}
