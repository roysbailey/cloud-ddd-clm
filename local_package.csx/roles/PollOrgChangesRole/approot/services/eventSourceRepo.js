/**
 * Created by rbailey on 16/01/14.
 */

var Client = require('node-rest-client').Client;
var restClient = new Client();
var hostName = "http://ec2-54-72-34-117.eu-west-1.compute.amazonaws.com";
var eventSourceEntryPoint = hostName + '/providers/notifications';
var Logger = require('./logger').Logger;
var logger = new Logger('eventSourceRepo');

exports.findFeedContainingUpdate = function(lastImportedItemUpdateDate, callback){

    if (lastImportedItemUpdateDate !== '2000-01-01 00:00:00') {
        // Start looking from the "recent feeds" entry point
        logger.log('findFeedContainingUpdate', 'Process feeds to find container for: ' + lastImportedItemUpdateDate);
        processFeed(eventSourceEntryPoint);
    } else {
        logger.log('findFeedContainingUpdate', 'Seed date detected, so find first feed');
        findFirstFeed(eventSourceEntryPoint);
    }

    function processFeed(uri) {
        getFeedFromURI(uri, function(err, data){
            logger.log('processFeed', 'Processing feed: ' + uri);
            if (!err){
                logger.log('processFeed', 'check if feed contains lastImportDate: ' + uri);
                checkFeedContainsProcessDate(data, lastImportedItemUpdateDate);
            } else {
                logger.logErr(err);
                callback(err);
            }
        });
    }

    function checkFeedContainsProcessDate(feedObj, dateToMatch) {
        var entriesWithMatchingDate = feedObj.entries.filter(function(entry){
           return  entry.createdDate === dateToMatch;
        });

        if (entriesWithMatchingDate.length > 0) {
            logger.log('checkFeedContainsProcessDate', 'Found a match for: ' + dateToMatch);
            callback(null, feedObj);
        } else {
            logger.log('checkFeedContainsProcessDate', 'No match found in this feed');
            if (feedObj._links.previousArchive) {
                logger.log('checkFeedContainsProcessDate', 'Look in previous feed: ' + feedObj._links.previousArchive.href);
                processFeed(getFQDNLink(hostName, feedObj._links.previousArchive.href));
            } else {
                // Did not find the created date in ANY feed :-(
                logger.log('checkFeedContainsProcessDate', 'Could not find a match for last processed, and NO previous link, so lets return a 404 nothing to do!');
                callback({ statusCode: 404 }, feedObj);
            }
        }
    }

    function findFirstFeed(url) {
        logger.log('findFirstFeed', 'Looking at URL: ' + url);
        getFeedFromURI(url, function(err, feedObj) {
           if (!err) {
               if (feedObj._links.previousArchive) {
                   logger.log('findFirstFeed', 'Found a previous link: ' + feedObj._links.previousArchive);
                   findFirstFeed(getFQDNLink(hostName, feedObj._links.previousArchive.href));
               } else {
                   logger.log('findFirstFeed', 'Found first feed: ' + feedObj.id);
                   callback(null, feedObj);
               }
           } else {
               logger.logErr(err);
               callback(err);
           }
        });
    }
}

exports.getFeedFromURI = function(feedURI, callback){
    getFeedFromURI(feedURI, callback);
};


function getFeedFromURI(feedURI, callback){

    // If given a relative URI, make it absolute.
    if (feedURI.indexOf(":") == -1)
        feedURI = getFQDNLink(hostName, feedURI);

    logger.log('getFeedFromURI', 'About to load feed from: ' + feedURI);
    restClient.get(feedURI, function(data, response){
        var feedObj = JSON.parse(data);
        logger.log('getFeedFromURI', 'Load feed from uri and converted to JSON.  ID: ' + feedObj.id);
        callback(null, feedObj);
    }).on('error',function(err){
            logger.logErr('ERROR [getFeedFromURI] - something went wrong on the request: ' + err.request.options);
            callback(err);
        });
}

function getFQDNLink(hostName, relativeHref){
    return hostName + relativeHref;
};
