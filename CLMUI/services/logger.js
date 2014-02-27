/**
 * Created by rbailey on 23/01/14.
 */

function Logger(area){
    this.area = area;
}

Logger.prototype = {
    area: 'Area not set',
    log: function(context, msg){
        console.log('[%s][%s] - %s', this.area ,context, msg);
    },
    logErr: function(errMsg){
        console.log('[%s][ERROR] - %s', this.area ,errMsg);
    }
}

exports.Logger = Logger;
