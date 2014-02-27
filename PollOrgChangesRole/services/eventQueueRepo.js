/**
 * Created by rbailey on 16/01/14.
 */

var azure = require('azure');
var config = require('../config').config;
var Logger = require('./logger').Logger;
var logger = new Logger('eventQueueRepo');

var queueService = azure.createQueueService();

exports.addEvent = function(eventToProcess, callback){
    logger.log('addEvent', 'About to add event to queue: ' + eventToProcess.id);
    queueService.createQueueIfNotExists(config.orgEventsQueueName, function(error){
        if(!error){
            var jsonEvent = JSON.stringify(eventToProcess);
            queueService.createMessage(config.orgEventsQueueName, jsonEvent, function(err){
                if(!err){
                    logger.log('addEvent', "Message written to queue!" + eventToProcess.id);
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

exports.loadEvents = function(callback) {
    queueService.getMessages(config.orgEventsQueueName, {numofmessages: config.numMessagesToPullFromQueue}, function(err, messages){
        // Note. we must process the message in less than 30 seconds, or the message will be put back on the queue by Azure.
        if(!err){
            if (messages.length) {
                logger.log("loadEvents", "Messages to process from queue: " + messages.length);
                var jsonEventMessages = [];
                messages.forEach(function(eventMessage){
                    var event = JSON.parse(eventMessage.messagetext);

                    // To make life easy for the consumer, locate the eventType and surface as a simple property
                    var eventTypes = event.category.filter(function(category){
                        return category.scheme === 'event';
                    });
                    var eventTypeTerm = "unknown";
                    eventTypes.forEach(function(eventType){
                        eventTypeTerm = eventType.term;
                    });

                    var wrappedEvent = {
                        eventType: eventTypeTerm,
                        event: event,
                        queueEventMessage: eventMessage
                    };

                    jsonEventMessages.push(wrappedEvent);
                });

                // return the complete set of events received as JSON objects to the consumer.
                callback(null, jsonEventMessages);
            } else {
                callback({statusCode: 404}, null);
            }
        } else {
            logger.logErr("Failed to load events from queue: " + err);
            callback(err, null);
        }
    });
};

exports.dequeueEventFromQueue = function(wrappedEvent, callback) {
    queueService.deleteMessage(config.orgEventsQueueName, wrappedEvent.queueEventMessage.messageid, wrappedEvent.queueEventMessage.popreceipt, function(err){
        callback(err, wrappedEvent);
    });
};