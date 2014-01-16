var statusRepo = require('./services/statusRepo');
var eventSourceRepo = require('./services/eventSourceRepo');
var eventQueueRepo = require('./services/eventQueueRepo');

var pollIntervalMS = 10000;

// Start polling for changes
run();

function run(){

    var latestProcessedEventDate;
    var eventsProcessedInPoll;

    start();

    function start(){
        eventsProcessedInPoll = 0;
        statusRepo.getLatestImportDetails(function(err, orgImportRunDetails){
            if (!err){
                latestProcessedEventDate = orgImportRunDetails.lastImportedItemUpdateDate ? orgImportRunDetails.lastImportedItemUpdateDate : '2000-01-01 00:00:00';
                eventSourceRepo.findFeedContainingUpdate(orgImportRunDetails.lastImportedItemUpdateDate, function(err, feedObject){
                    if (!err){
                        onFeedAvailableToProcess(feedObject, orgImportRunDetails.lastImportedItemUpdateDate);
                    } else if (err.statusCode == 404) {
                        console.log('Now new updates.  Last update processed: ' + orgImportRunDetails.lastImportedItemUpdateDate);
                    } else {
                        handleError(err);
                    }
                });
            } else {
                handleError(err);
            }
        });
    }

    function onFeedAvailableToProcess(feedObj, lastImportedItemUpdateDate){
        var eventsToProcess = feedObj.entries.filter(function(event){
            return event.createdDate > lastImportedItemUpdateDate;
        });

        var eventsToProcessCount = eventsToProcess.length;
        eventsProcessedInPoll += eventsToProcessCount;
        eventsToProcess.forEach(function(eventToProcess){
            latestProcessedEventDate = eventToProcess.createdDate > latestProcessedEventDate ? eventToProcess.createdDate : latestProcessedEventDate;
            eventQueueRepo.addEvent(eventToProcess, onProcessedEvent);
        })

        function onProcessedEvent(err, event){
            eventsToProcessCount--;
            if (eventsToProcessCount === 0) eventFeedProcessed();
        }

        function eventFeedProcessed(){
            feedProcessed(feedObj);
        }
    }

    function feedProcessed(feedObj){
        if (feedObj.links.nextArchive){
            eventSourceRepo.getFeedFromURI(feedObj.links.nextArchive, function(err, feedObject){
                if (!err){
                    callback(null, feedObject);
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
        console.log('Queued [%02d] events, latest event is: ' + latestProcessedEventDate, eventsProcessedInPoll);

        statusRepo.putLatestImportDetails(latestProcessedEventDate, function(err){
            if (err) handleError(err)

            console.log('Poll completed:: Updated last run details, and about to sleep until next poll: %02d', pollIntervalMS);

            // All completed, so lets sleep and run again at next poll interval
            setTimeout(
                run,
                pollIntervalMS);
        });
    }

    function handleError(err){
        console.log('Poll failed with error: ' + err);
    }
}

