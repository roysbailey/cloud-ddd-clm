/**
 * Created by rbailey on 16/01/14.
 */

var azure = require('azure');

var queueService = azure.createQueueService();
var eventQueueName = "orgChangeEventsQueue";

exports.addEvent = function(eventToProcess, callback){
    queueService.createQueueIfNotExists(eventQueueName, function(error){
        if(!error){
            queueService.createMessage(eventQueueName, eventToProcess, function(err){
                if(!err){
                    console.log("Message written to queue!" + eventToProcess.id);
                    callback(null, eventToProcess);
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);
        }
    });
};