Meteor.publishComposite('afschriften', function(year, tegenpartij){
  var q = {};
  if(year){
    //check(year, Number);
    var start = new Date(year, 0, 1);
    var end = new Date(year, 11, 31);
    q = {date: {$gte: start, $lt: end}};
  }

  if(tegenpartij) {
    q = _.extend(q, {
      tegenpartij: new Mongo.ObjectID(tegenpartij)
    });
  }

  return {
    find: function() {
      return Afschriften.find(q, {sort: {date: -1}, limit: 15});
    },
    children: [{
      find: function(afschrift) {
        return Tegenpartijen.find({_id: afschrift.tegenpartij});
      }
    }]
  };
});