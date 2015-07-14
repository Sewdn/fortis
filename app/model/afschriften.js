Afschriften = new Mongo.Collection('afschriften');
Tegenpartijen = new Mongo.Collection('tegenpartij');

Afschriften.helpers({
  getTegenpartij: function() {
    return Tegenpartijen.findOne(this.tegenpartij);
  }
});
