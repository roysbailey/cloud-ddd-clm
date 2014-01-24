/**
 * Created by Roy on 24/01/14.
 */

exports.map = function(orgEvent) {

    var orgContent = orgEvent.content;

    var orgCacheEntry = {
        ukprn: orgContent.ukprn,
        name: orgContent.name,
        building: orgContent.buildingName + orgContent.flatName,
        postCode: orgContent.postCode,
        city: orgContent.city,
        metadata: {
            version: orgContent.version,
            versionDate: orgEvent.createdDate
        }
    };

    return orgCacheEntry;
}