/**
 * Created by rbailey on 23/01/14.
 */

exports.config = {
    orgEventsQueueName: "orgeventsqueue",
    numMessagesToPullFromQueue: 2,
    pollQueuePollInterval: 2000,

    orgCache_TableName: 'orgCache',
    orgCache_PartitionKey: 'orgPartition'
};