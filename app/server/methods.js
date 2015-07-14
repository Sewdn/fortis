Meteor.methods({
  'summary': function(tp, year) {
    var q = {tegenpartij: new MongoInternals.NpmModule.ObjectID(tp._str)};
    if(year){
      var start = new Date(year, 1, 1);
      var end = new Date(year, 12, 31);
      q = _.extend(q, {date: {$gte: start, $lt: end}});
    }
    var pipeline = [
      {$match: q},
      {$group: {_id: "$tegenpartij", sum: {$sum: "$amount"}, total: {$sum: 1}}}
    ];
    var result = Afschriften.aggregate(pipeline);
    return result && result.length && result[0] ? result [0] : {sum: 0, total: 0};
  }
});