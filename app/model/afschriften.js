Afschriften = new Mongo.Collection('afschriften');

Afschriften.helpers({
  getTegenpartij: function() {
    return Tegenpartijen.findOne(this.tegenpartij);
  }
});

Tegenpartijen = new Mongo.Collection('tegenpartij');

Tegenpartijen.helpers({
  getProfile: function() {
    return Profiles.findOne(this.profile);
  },
  getTitle: function() {
    var t = this.title || this.number || this.ref;
    if(this.profile){
      console.log(this.profile);
      var p = this.getProfile();
      if(p){
        t = this.getProfile().title + ' (' + t + ')';
      }
    }
    return t;
  }
});

Groepen = new Mongo.Collection('groepen');

Profiles = new Mongo.Collection('profiles');
