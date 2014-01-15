var http = require('http');
var azure = require('azure');
var statusRepo = require('./statusRepo');

var queueService = azure.createQueueService();
var queueName = "bob1";

statusRepo.getLatestImportDetails(function(err, orgImportRunDetails){
   if (!err){
       console.log('latestImportDetails: ' + orgImportRunDetails.lastImportedItemUpdateDate);
   } else {
       console.log('latestImportDetails FAILED: ' + err);
   }
});



//queueService.createQueueIfNotExists(queueName, function(error){
//    if(!error){
//        queueService.createMessage(queueName, "Hello world!", function(error){
//            if(!error){
//                console.log("Message written to queue!");
//            }
//        });
//    }
//});