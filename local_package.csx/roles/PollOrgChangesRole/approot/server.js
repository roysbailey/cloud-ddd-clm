var statusRepo = require('./services/statusRepo');
var eventSourceRepo = require('./services/eventSourceRepo');
var eventQueueRepo = require('./services/eventQueueRepo');

var Logger = require('./services/logger').Logger;
var logger = new Logger('server');


var pollIntervalMS = 10000;

// Start polling for changes
run();

function run(){

    var currentPollNumber;
    var latestProcessedEventDate;
    var lastProcessedEventDateFromPrevPoll;
    var eventsProcessedInPoll;

    start();

    function start(){
        eventsProcessedInPoll = 0;
        currentPollNumber = currentPollNumber ? currentPollNumber+1 : 0;
        logger.log('start', 'Started new poll');
        statusRepo.getLatestImportDetails(function(err, orgImportRunDetails){
            if (!err){
                lastProcessedEventDateFromPrevPoll = orgImportRunDetails.lastImportedItemUpdateDate ? orgImportRunDetails.lastImportedItemUpdateDate : '2000-01-01 00:00:00';
                latestProcessedEventDate = lastProcessedEventDateFromPrevPoll;
                logger.log('start', 'Last processed event date: ' + latestProcessedEventDate);
                eventSourceRepo.findFeedContainingUpdate(latestProcessedEventDate, function(err, feedObject){
                    if (!err){
                        logger.log('start', 'Loaded feedID: ' + feedObject.id + ' to process');
                        onFeedAvailableToProcess(feedObject);
                    } else if (err.statusCode == 404) {
                        logger.log('start', 'No new events since last poll');
                    } else {
                        logger.logErr(err);
                    }
                });
            } else {
                logger.logErr(err);
            }
        });
    }

    function onFeedAvailableToProcess(feedObj){
        var lastImportedItemUpdateDate = lastProcessedEventDateFromPrevPoll;

        var eventsToProcess = feedObj.entries.filter(function(event){
            logger.log('onFeedAvailableToProcess', 'Event: ' + event.id + ' = createdDate: ' + event.createdDate + ' > ' + lastImportedItemUpdateDate);
            return new Date(event.createdDate) > new Date(lastImportedItemUpdateDate);
        });

        var eventsToProcessCount = eventsToProcess.length;
        eventsProcessedInPoll += eventsToProcessCount;
        logger.log('onFeedAvailableToProcess', 'Feed: ' + feedObj.id + ' contains ' + feedObj.entries.length + ' event and of these ' + eventsToProcessCount + ' are new');
        if (eventsToProcessCount !== 0){
            eventsToProcess.forEach(function(eventToProcess){
                latestProcessedEventDate = new Date(eventToProcess.createdDate) > new Date(latestProcessedEventDate) ? eventToProcess.createdDate : latestProcessedEventDate;
                logger.log('onFeedAvailableToProcess', 'Adding event to queue: ' + eventToProcess.id);
                eventQueueRepo.addEvent(eventToProcess, onProcessedEvent);
            });
        } else {
            // No events to process here, but we may have other later feeds to process, so signal this feed as processed and it will check!
            eventFeedProcessed();
        }

        function onProcessedEvent(err, event){
            logger.log('onProcessedEvent', 'Following event is now queued: ' + event.id);
            eventsToProcessCount--;
            if (eventsToProcessCount === 0) eventFeedProcessed();
        }

        function eventFeedProcessed(){
            logger.log('eventFeedProcessed', 'Completed processing feed: ' + feedObj.id);
            feedProcessed(feedObj);
        }
    }

    function feedProcessed(feedObj){
        if (feedObj._links.nextArchive){
            eventSourceRepo.getFeedFromURI(feedObj._links.nextArchive.href, function(err, feedObject){
                if (!err){
                    logger.log('feedProcessed', 'Loaded feed for processing: ' + feedObject.id);
                    onFeedAvailableToProcess(feedObject);
                } else {
                    logger.logErr(err);
                }
            });
        } else {
            // We are now completed!
            logger.log('feedProcessed', 'No more feeds available to process');
            done();
        }

    }

    function done(){
        logger.log('eventFeedProcessed', 'Queued '+ eventsProcessedInPoll + ' events, latest event is: ' + latestProcessedEventDate);

        statusRepo.putLatestImportDetails(latestProcessedEventDate, function(err){
            if (err)
                logger.logErr(err);

            logger.log('Poll completed: Updated last run details, and about to sleep until next poll: ' + pollIntervalMS);

            // All completed, so lets sleep and run again at next poll interval
            setTimeout(
                run,
                pollIntervalMS);
        });
    }
}

