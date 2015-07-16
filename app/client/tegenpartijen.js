Template.tegenpartijen.onCreated(function(){
  var self = this;
  this.selected = new ReactiveVar();
  this.summary = new ReactiveVar();
  this.autorun(function(){
    var tp = self.selected.get(),
        search = Session.get('searchQuery');
    self.subscribe('tegenpartijen', search);
    if(tp) {
      Meteor.call('summary',
        tp,
      function(err, data) {
        self.summary.set(data);
      });
    }
  });
});

Template.tegenpartijen.onRendered(function(){
  var self = this;
});

Template.tegenpartijen.helpers({
  'all': function(){
    return Tegenpartijen.find({});
  },
  'eur': function(amount) {
    return "€"+amount.toFixed(2);
  },
  'dateFormat': function(date) {
    //return date.toString();
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return [day, monthIndex+1, year].join('/');
  },
  isSelected: function() {
    var s = Template.instance().selected.get();
    return s && s === this._id._str ? 'is-selected': '';
  },
  selected: function() {
    var s = Template.instance().selected.get();
    return s && Tegenpartijen.findOne(new Mongo.ObjectID(s));
  },
  summary: function() {
    return Template.instance().summary.get();
  }
});

Template.tegenpartijen.events({
  "click tr": function(event, template){
    console.log(this._id._str);
    template.selected.set(this._id._str);
  }
});