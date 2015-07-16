Afschriften = new Mongo.Collection('afschriften');
if (Meteor.isServer) {
  Afschriften._ensureIndex({
    "DETAILS": "text"
  });
}

Afschriften.helpers({
  getTegenpartij: function() {
    return Tegenpartijen.findOne(this.tegenpartij);
  }
});

Tegenpartijen = new Mongo.Collection('tegenpartij');

Tegenpartijen.helpers({
  getTitle: function() {
    return this.title || this.number || this.ref;
  }
});

Groepen = new Mongo.Collection('groepen');
