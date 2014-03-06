/**
 * Created by rbailey on 23/01/14.
 */

function Logger(area, verbose){
    this.area = area;
    this.verbose = verbose;
}

Logger.prototype = {
    area: 'Area not set',
    verbose: false,
    log: function(context, msg, forceShow){
        if (this.verbose || forceShow)
            console.log('[%s][%s] - %s', this.area ,context, msg);
    },
    logErr: function(errMsg){
        console.log('[%s][ERROR] - %s', this.area ,errMsg);
    }
}

exports.Logger = Logger;
