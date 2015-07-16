Template.groepen.onCreated(function(){
  var self = this;
  this.selected = new ReactiveVar();
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
  }
});

Template.groepen.events({
  "click tr": function(event, template){
    template.selected.set(this._id._str);
  }
});