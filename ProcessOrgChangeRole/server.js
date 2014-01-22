var azure = require('azure');

var queueService = azure.createQueueService();
var eventQueueName = "orgeventsqueue";

// Start polling new messages on our queue
pollForChanges();

function pollForChanges() {

    start();

    function start(){
        log("start", "Org event processor starting");
        queueService.getMessages(eventQueueName, {numofmessages: 1}, function(err, messages){
            if(!err){
                if (messages.length) {
                    log("ProcessEvent", "Messages to process: " + messages.length);
                    // Process the message in less than 30 seconds, the message
                    // We get a "collection" of messages at a time
                    messages.forEach(function(message){
                        var event = JSON.parse(message.messagetext);
                        processEvent(event);
    //                    queueService.deleteMessage(queueName
    //                        , message.messageid
    //                        , message.popreceipt
    //                        , function(error){
    //                            if(!error){
    //                                console.log("Message removed from queue");
    //                            }
    //                        });
                    });
                }

                // Check again in another 2 seconds.
                setTimeout(
                    pollForChanges,
                    2000);
            } else {
                handleError(err);
            }
        });
    }

    function processEvent(event){
        log("ProcessEvent", event.id);
        var eventTypes = event.category.filter(function(category){
            return category.scheme === 'event';
        });

        var eventTypeTerm;
        eventTypes.forEach(function(eventType){
            eventTypeTerm = eventType.term;
        });
        log('ProcessEvent', event.id + ' - EventType: ' + eventTypeTerm);

        if (eventTypeTerm === 'update') {
            log("ProcessEvent", "Need to perform UPDATE for event: " + event.id);
        } else if (eventTypeTerm === 'delete') {
            log("ProcessEvent", "Need to perform DELETE for event: " + event.id);
        } else {
            handleError("Unknown eventType: " + eventTypeTerm + ' when processing event: ' + event.id);
        }
    }

    function handleError(err){
        log("ERROR", 'Poll failed with error: ' + err);
    }

    function log(context, msg){
        console.log('[ESProc][%s] - %s',context, msg);
    }
}