Meteor.publish('afschriften', function(year, tegenpartij){
  var q = {};
    console.log(year);
  if(year){
    //check(year, Number);
    var start = new Date(year, 1, 1);
    var end = new Date(year, 12, 31);
    q = {date: {$gte: start, $lt: end}};
  }

  if(tegenpartij) {
    q = _.extend(q, {
      tegenpartij: tegenpartij
    });
  }

  return Afschriften.find(q, {sort: {date: -1}, limit: 15});
});