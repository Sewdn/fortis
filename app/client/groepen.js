Template.groepen.onCreated(function(){
  var self = this;
  this.selected = new ReactiveVar();
  this.summary = new ReactiveVar();
  this.autorun(function(){
    var group = self.selected.get();
    if(group) {
      Meteor.call('summary',
        null,
        group,
      function(err, data) {
        self.summary.set(data);
      });
    }
  });
});

Template.groepen.helpers({
  'all': function(){
    return Groepen.find({});
  },
  isSelected: function() {
    var s = Template.instance().selected.get();
    return s && s === this._id._str ? 'is-selected': '';
  },
  selected: function() {
    var s = Template.instance().selected.get();
    return s && Groepen.findOne(new Mongo.ObjectID(s));
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
  summary: function() {
    return Template.instance().summary.get();
  }
});

Template.groepen.events({
  "click tr": function(event, template){
    template.selected.set(this._id._str);
  }
});