/**
 * Created by rbailey on 23/01/14.
 */

exports.config = {
    orgEventsQueueName: "orgeventsqueue",
    numMessagesToPullFromQueue: 2,
    pollQueuePollInterval: 5000,

    orgCache_TableName: 'orgCache',
    orgCache_PartitionKey: 'orgPartition',

    contractStore_TableName: 'contracts'
};