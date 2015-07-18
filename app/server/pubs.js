Meteor.publishComposite('afschriften', function(year, tegenpartij, groep, search){
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

  if(groep) {
    //lookup all tegenpartijen
    var tps = _.map(Tegenpartijen.find({groups: new Mongo.ObjectID(groep)}).fetch(), function(t) {
      return t._id;
    });
    q = _.extend(q, {
      tegenpartij: {$in: tps}
    });
  }

  if(search) {
    q = _.extend(q, {
      DETAILS: {$regex: new RegExp(search, "i")}
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

Meteor.publish('tegenpartijen', function(search) {
  var q = {};
  if(search) {
    q = _.extend(q, {$or:[
      {ref: {$regex: new RegExp(search, "i")}},
      {title: {$regex: new RegExp(search, "i")}},
      {number: {$regex: new RegExp(search, "i")}}
    ]});
  }
  return Tegenpartijen.find(q);
});

Meteor.publish('groups', function() {
  return Groepen.find();
});
