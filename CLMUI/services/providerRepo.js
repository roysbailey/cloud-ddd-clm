/**
 * Created by rbailey on 10/02/14.
 */

var providerList = [
    { ukprn: 12345678, name: "Birmingham University", city: "Birmingham" },
    { ukprn: 23456789, name: "Aston University", city: "Birmingham" },
    { ukprn: 34567890, name: "St Andrews University", city: "St Andrews" }
];

exports.searchProviders = function(searchText, callback) {

    var selectedProviders = providerList.filter(function(item){
       return item.name.indexOf(searchText) !== -1
           || item.city.indexOf(searchText) !== -1;
    });

    callback(null, selectedProviders);
};