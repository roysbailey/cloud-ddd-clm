var azure = require('azure');

var queueService = azure.createQueueService();
var queueName = "bob1";

// Start polling new messages on our queue
pollForChanges();

function pollForChanges() {
    console.log("In callback");
    queueService.getMessages(queueName, function(err, messages){
        if(!error){
            // Process the message in less than 30 seconds, the message
            // We get a "collection" of messages at a time
            messages.forEach(function(message){
                console.log("processing: " + message.messagetext);
                queueService.deleteMessage(queueName
                    , message.messageid
                    , message.popreceipt
                    , function(error){
                        if(!error){
                            console.log("Message removed from queue");
                        }
                    });
            });

            // Check again in another 2 seconds.
            setTimeout(
                pollForChanges,
                2000);
        } else {
            console.log("Error receiving messages: " + err);
        }
    });
}