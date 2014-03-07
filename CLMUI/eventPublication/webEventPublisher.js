/**
 * Created by rbailey on 07/03/14.
 */

var io = undefined
    async = require('async');

exports.initialise = function(socketio) {
    io = socketio;
    io.sockets.on('connection', function (socket) {
        socket.on('selected provider', function (data) {
            console.log('Client selected new provider with UKPRN: ' + data);
            socket.set('provider', data);
        });
    });
}

// Called whenever a refresh has occurred, regardless of whether or NOT any updates were made...
// TODO - look a socket.io namespances here!
exports.onRefreshedOrgsCallback = function (err, data) {
    if (!err) {
        var connectedClients = io.sockets.clients();
        async.each(connectedClients,
            function(item, callback){
                // Sending as volatile, as it is not the end of the world if a client does not receive the update.
                item.volatile.emit('onRefreshedOrgs', data);
                callback();
            },
            function(err) {
                console.log('[onRefreshedOrgsCallback] - updated all clients');
            }
        );
    } else {
        console.log('[onRefreshedOrgsCallback] Error: ' + err);
    }
}

// Called whenever an event is processed for a given org.
exports.onOrgEventCallback = function (err, wrappedEvent) {
    if (!err) {
        // Get our list of all connections, and sent a socket message to any who are listening for our provider:
        var connectedClients = io.sockets.clients();
        async.filter(connectedClients,
            function(socket, callback) {
                socket.get('provider', function(err, ukprn) {
                    if (!err)
                        callback(wrappedEvent.event.content.ukprn === ukprn);
                    else
                        callback(false);
                });
            },
            function(results) {
                // Now we have a list of all clients interested in our provider,
                // lets send them an updated message!
                async.each(results, function(socket, callback){
                    socket.emit('onOrgEvent', wrappedEvent);
                    callback(null);
                });
            }
        );
    } else {
        console.log('[onOrgEventCallback] Error: ' + err);
    }
}