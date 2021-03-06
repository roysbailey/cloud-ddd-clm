/**
 * Created by rbailey on 03/03/14.
 */

var eventQueueRepo = require('../services/eventQueueRepo');
var orgCacheRepo = require('../services/orgCacheRepo');
var orgEventToCacheMapper = require('../services/orgEventContentToOrgCache');
var config = require('../config').config;
var Logger = require('../services/logger').Logger;
var logger = new Logger('pollForChanges');
var DateTime = require('../services/DateTime').DateTime;

exports.pollForChanges = function(onRefreshedOrgsCallback, onOrgEventCallback) {

    var eventsToProcessCount;
    var eventsProcessedCount;
    var eventsToProcess;

    pollQueue();

    function pollQueue(){
        logger.log("pollQueue", "Org event processor starting");

        eventQueueRepo.loadEvents(function(err, events){
            if (!err) {
                logger.log("pollQueue", "Loaded messages.  Number to process is: " + events.length);
                processAllEvents(events);
            } else {
                if (err.statusCode === 404) {
                    logger.log("loadEvents", "No messages to process");
                    processedAllEvents();
                } else {
                    logger.logErr("Failed to load events to process: " + err);
                    processedAllEvents();
                }
            }
        });
    }

    function processAllEvents(events) {
        // Initialise globals back to "starting processing" state.
        eventsProcessedCount = 0;
        eventsToProcess = events;
        eventsToProcessCount = events.length;

        onProcessNextEvent(null);
    }

    // Called to process next event.  The last event processed is passed as a param.
    function onProcessNextEvent(err, lastProcessedEvent) {
        if (err) {
            logger.logErr("onProcessNextEvent - Error on entry: " + err);
        }

        // The previous event has been now processed, so lets call our "outer callback" so the UI consumer can update.
        // TODO this feels like it should be an EventEmitter implementation to me!  Consider re-factor
        if (lastProcessedEvent) {
            logger.log('onProcessNextEvent', 'Event processed: just about to call UI callback: ' + lastProcessedEvent.event.id, true);
            onOrgEventCallback(err, lastProcessedEvent);
        }

        // Read the next event processed
        var event = getNextEvent();
        if (event) {
            logger.log('onProcessNextEvent', 'new event to process: '  + event.id, true);
            processEvent(event, onProcessNextEvent);
        } else {
            processedAllEvents();
        }
    }

    function processEvent(wrappedEvent, callback){
        var event = wrappedEvent.event;
        var eventType = wrappedEvent.eventType;
        logger.log("ProcessEvent", 'About to apply [' + eventType + '] for eventID: ' + event.id);

        if (eventType === 'update') {
            var orgCacheItem = orgEventToCacheMapper.map(event);
            orgCacheRepo.upsertOrg(orgCacheItem, function(err){
                if (!err) {
                    logger.log("ProcessEvent", "Update applied for: " + event.id);
                    eventQueueRepo.dequeueEventFromQueue(wrappedEvent, function(err){
                        callback(null, wrappedEvent);
                    });
                } else {
                    logger.logErr("Failed to [update] Event:" + event.id + " - Error: " + err);
                    callback(err, wrappedEvent);
                }
            });
        } else if (eventType === 'delete') {
            orgCacheRepo.deleteOrgFromCache(event.content.ukprn, function(err){
                if (!err) {
                    logger.log("ProcessEvent", "[delete] applied for: " + event.id);
                    eventQueueRepo.dequeueEventFromQueue(wrappedEvent, function(){
                        callback(err, wrappedEvent);
                    });
                } else {
                    logger.logErr("Failed to [delete] Event:" + event.id + " - Error: " + err);
                    callback(err, wrappedEvent);
                }
            });
        } else {
            var err = "Unknown eventType: " + eventType + ' when processing event: ' + event.id;
            logger.logErr(err);
            callback(err, wrappedEvent);
        }
    }

    function processedAllEvents() {

        // Poll has completed, so lets call our "callback" so an event can be raised back to the clients.
        var dt = new DateTime();
        onRefreshedOrgsCallback(null, dt.formats['compound']['mySQL']);

        logger.log("processedAllEvents", "Sleeping for following interval: " + config.pollQueuePollInterval);
        setTimeout(
            pollQueue,
            config.pollQueuePollInterval);
    }

    function getNextEvent() {
        if (eventsProcessedCount >= eventsToProcessCount) {
            return undefined;
        } else {
            return eventsToProcess[eventsProcessedCount++];
        }
    }
}