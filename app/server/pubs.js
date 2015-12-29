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
    var regex = new RegExp(search, "i");
    q = _.extend(q, {
      $or: [
        {"JAAR + REFERTE": {$regex: regex}},
        {DETAILS: {$regex: regex}},
        {tegenpartijref: {$regex: regex}}
      ]
    });
  }

  return {
    find: function() {
      return Afschriften.find(q, {sort: {date: -1}, limit: 40});
    },
    children: [{
      find: function(afschrift) {
        return Tegenpartijen.find({_id: afschrift.tegenpartij});
      },
      children: [{
        find: function(tegenpartij) {
          if(tegenpartij.profile){
            return Profiles.find({_id: tegenpartij.profile});
          }
        }
      }]
    }]
  };
});

Meteor.publishComposite('tegenpartijen', function(search) {
  var q = {};
  if(search) {
    q = _.extend(q, {$or:[
      {ref: {$regex: new RegExp(search, "i")}},
      {title: {$regex: new RegExp(search, "i")}},
      {number: {$regex: new RegExp(search, "i")}}
    ]});
  }
  return {
    find: function(){
      return Tegenpartijen.find(q);
    },
    children: [{
      find: function(tegenpartij) {
        if(tegenpartij.profile){
          return Profiles.find({_id: tegenpartij.profile});
        }
      }
    }]
  };
});

Meteor.publish('groups', function() {
  return Groepen.find();
});
