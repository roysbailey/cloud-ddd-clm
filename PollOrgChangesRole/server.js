var statusRepo = require('./services/statusRepo');
var eventSourceRepo = require('./services/eventSourceRepo');
var eventQueueRepo = require('./services/eventQueueRepo');

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
        log('start', 'Started new poll:');
        statusRepo.getLatestImportDetails(function(err, orgImportRunDetails){
            if (!err){
                lastProcessedEventDateFromPrevPoll = orgImportRunDetails.lastImportedItemUpdateDate ? orgImportRunDetails.lastImportedItemUpdateDate : '2000-01-01 00:00:00';
                latestProcessedEventDate = lastProcessedEventDateFromPrevPoll;
                log('start', 'Last processed event date: ' + latestProcessedEventDate);
                eventSourceRepo.findFeedContainingUpdate(latestProcessedEventDate, function(err, feedObject){
                    if (!err){
                        log('start', 'Loaded feedID: ' + feedObject.id + ' to process');
                        onFeedAvailableToProcess(feedObject);
                    } else if (err.statusCode == 404) {
                        log('start', 'No new events since last poll');
                    } else {
                        handleError(err);
                    }
                });
            } else {
                handleError(err);
            }
        });
    }

    function onFeedAvailableToProcess(feedObj){
        var lastImportedItemUpdateDate = lastProcessedEventDateFromPrevPoll;

        var eventsToProcess = feedObj.entries.filter(function(event){
            return event.createdDate > lastImportedItemUpdateDate;
        });

        var eventsToProcessCount = eventsToProcess.length;
        eventsProcessedInPoll += eventsToProcessCount;
        log('onFeedAvailableToProcess', 'Feed: ' + feedObj.id + ' contains ' + feedObj.entries.length + ' event and of these ' + eventsToProcessCount + ' are new');
        if (eventsToProcessCount !== 0){
            eventsToProcess.forEach(function(eventToProcess){
                latestProcessedEventDate = eventToProcess.createdDate > latestProcessedEventDate ? eventToProcess.createdDate : latestProcessedEventDate;
                log('onFeedAvailableToProcess', 'Adding event to queue: ' + eventToProcess.id);
                eventQueueRepo.addEvent(eventToProcess, onProcessedEvent);
            });
        } else {
            // No events to process here, but we may have other later feeds to process, so signal this feed as processed and it will check!
            eventFeedProcessed();
        }


        function onProcessedEvent(err, event){
            log('onProcessedEvent', 'Following event is now queued: ' + event.id);
            eventsToProcessCount--;
            if (eventsToProcessCount === 0) eventFeedProcessed();
        }

        function eventFeedProcessed(){
            log('eventFeedProcessed', 'Completed processing feed: ' + feedObj.id);
            feedProcessed(feedObj);
        }
    }

    function feedProcessed(feedObj){
        if (feedObj._links.nextArchive){
            eventSourceRepo.getFeedFromURI(feedObj._links.nextArchive.href, function(err, feedObject){
                if (!err){
                    onFeedAvailableToProcess(feedObject);
                } else {
                    handleError(err);
                }
            });
        } else {
            // We are now completed!
            done();
        }

    }

    function done(){
        log('eventFeedProcessed', 'Queued '+ eventsProcessedInPoll + ' events, latest event is: ' + latestProcessedEventDate);

        statusRepo.putLatestImportDetails(latestProcessedEventDate, function(err){
            if (err) handleError(err)

            log('Poll completed: Updated last run details, and about to sleep until next poll: ' + pollIntervalMS);

            // All completed, so lets sleep and run again at next poll interval
            setTimeout(
                run,
                pollIntervalMS);
        });
    }

    function handleError(err){
        console.log('Poll failed with error: ' + err);
    }

    function log(context, msg){
        console.log('[ESPoll][%s][poll:%d] - %s',context, currentPollNumber, msg);
    }
}

