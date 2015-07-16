Meteor.methods({
  'summary': function(tp, groep, year) {

    var q = {};
    
    if(tp) {
      q = _.extend(q, {
        tegenpartij: new MongoInternals.NpmModule.ObjectID(tp)
      });
    }

    if(groep) {
      //lookup all tegenpartijen
      var tps = _.map(Tegenpartijen.find({groups: MongoInternals.NpmModule.ObjectID(groep)}).fetch(), function(t) {
        return MongoInternals.NpmModule.ObjectID(t._id._str);
      });
      q = _.extend(q, {
        tegenpartij: {$in: tps}
      });
    }

    console.log(q);

    if(year) {
      var start = new Date(year, 0, 1);
      var end = new Date(year, 11, 31);
      q = _.extend(q, {date: {$gte: start, $lt: end}});
    }

    var pipeline = [
      {$match: q},
      {$group: {_id: 1, sum: {$sum: "$amount"}, total: {$sum: 1}}}
    ];
    var result = Afschriften.aggregate(pipeline);
    return result && result.length && result[0] ? result [0] : {sum: 0, total: 0};
  }
});