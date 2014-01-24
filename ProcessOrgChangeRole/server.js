var eventQueueRepo = require('./../services/eventQueueRepo');
var orgCacheRepo = require('./services/orgCacheRepo');
var orgEventToCacheMapper = require('./services/orgEventContentToOrgCache');
var config = require('../config').config;
var Logger = require('../services/logger').Logger;
var logger = new Logger('pollForChanges');

// Start polling new messages on our queue
pollForChanges();

function pollForChanges() {

    var eventsToProcessCount;
    var eventsProcessedCount;

    pollQueue();

    function pollQueue(){
        logger.log("pollQueue", "Org event processor starting");

        eventQueueRepo.loadEvents(function(err, events){
            if (!err) {
                logger.log("pollQueue", "Loaded messages.  Number to process is: " + events.length);
                processAllEvents(events);
            } else {
                if (err.statusCode === 404) {
                    logger.log("loadEvents", "No messages to process: ");
                } else {
                    logger.logErr("Failed to load events to process: " + err);
                }

                processedAllEvents();
            }
        });
    }

    function processAllEvents(events) {
        eventsProcessedCount = 0;
        eventsToProcessCount = events.length;

        var moreEvents = true;
        while(moreEvents) {
            getNextEvent(function(err, event){
                if (!err) {
                    processEvent(event);
                } else {
                    moreEvents = false;
                }
            });
        }

        processedAllEvents();

        function getNextEvent(callback) {
            if (eventsProcessedCount >= eventsToProcessCount) {
                callback({ statusCode: 404 })
            } else {
                callback(null, events[eventsProcessedCount++]);
            }
        }
    }

    function processedAllEvents() {
        logger.log("processedAllEvents", "Sleeping for following interval: " + config.pollQueuePollInterval);
        setTimeout(
            pollQueue,
            config.pollQueuePollInterval);
    }

    function processEvent(wrappedEvent){
        var event = wrappedEvent.event;
        var eventType = wrappedEvent.eventType;
        logger.log("ProcessEvent", 'About to apply [' + eventType + '] for eventID: ' + event.id);

        if (eventType === 'update') {
            var orgCacheItem = orgEventToCacheMapper.map(event);
            orgCacheRepo.upsertOrg(orgCacheItem, function(err){
                if (!err) {
                    logger.log("ProcessEvent", "Update applied for: " + event.id);
                } else {
                    logger.logErr("Failed to [update] Event:" + event.id + " - Error: " + err);
                }
            });
        } else if (eventType === 'delete') {
            orgCacheRepo.deleteOrgFromCache(event.content.ukprn, function(err){
                if (!err) {
                    logger.log("ProcessEvent", "[delete] applied for: " + event.id);
                } else {
                    logger.logErr("Failed to [delete] Event:" + event.id + " - Error: " + err);
                }
            });
        } else {
            logger.logErr("Unknown eventType: " + eventType + ' when processing event: ' + event.id);
        }
    }
}