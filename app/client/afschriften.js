Template.afschriften.onCreated(function(){
  var self = this;
  this.selected = new ReactiveVar();
  this.year = new ReactiveVar();
  this.summary = new ReactiveVar();
  this.autorun(function(){
    var tp = Session.get('tegenpartij'),
        search = Session.get('searchQuery');
    self.subscribe('afschriften',
      self.year.get(),
      tp,
      search
    );
    if(tp) {
      Meteor.call('summary',
        tp,
        self.year.get(),
      function(err, data) {
        self.summary.set(data);
      });
    }
  });
});

Template.afschriften.onRendered(function(){
  var self = this;
});

Template.afschriften.helpers({
  'years': function() {
    return [2015, 2014, 2013, 2012, 2011, 2010];
  },
  'all': function(){
    return Afschriften.find({}, {sort: {date: -1}});
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
    return s && s.equals(this._id) ? 'is-selected': '';
  },
  selected: function() {
    var s = Template.instance().selected.get();
    return s && Afschriften.findOne(s);
  },
  selectedTegenpartij: function() {
    return Tegenpartijen.findOne(new Mongo.ObjectID(Session.get('tegenpartij')));
  },
  accentYear: function(year) {
    return Template.instance().year.get() === year ? "mdl-button--accent": "";
  },
  summary: function() {
    return Template.instance().summary.get();
  }
});

Template.afschriften.events({
  "click tr": function(event, template){
    template.selected.set(this._id);
  },
  "click .years button": function(event, template){
    var y = template.year.get(),
        nY = parseInt($(event.currentTarget).data('year'));
    if(y === nY){
      nY = null;
    }
    template.year.set(nY);
  }
});