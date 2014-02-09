/**
 * Created by rbailey on 07/02/14.
 */

var providerList = [
    { ukprn: 12345678, name: "Birmingham University", city: "Birmingham" },
    { ukprn: 23456789, name: "Aston University", city: "Birmingham" },
    { ukprn: 34567890, name: "St Andrews University", city: "St Andrews" }
];

exports.index = function(req, res){
    res.render('home/index');
}

exports.providerSearch = function(req, res){

    // Back to the main page to display the list
    res.render('home/index', { providers: providerList, fromSearch: true, searchText: req.query.searchText });
}
