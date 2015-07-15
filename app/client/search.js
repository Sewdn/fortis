Template.search.onRendered(function(){
  var self = this;
  this.autorun(function() {
    var q = Session.get('searchQuery');
    if(!q){
      var $i = self.$('input'),
          $tf = self.$('.mdl-textfield');
      $i.val('');
      $tf.removeClass('is-focused is-dirty');
    }
  });
});

Template.search.events({
  "keyup input": _.throttle(function(e, t) {
    var query = $(e.target).val().trim();
    if(query && query.length > 0){
      Session.set('searchQuery', query);
    } else {
      Session.set('searchQuery', null);
    }
  }, 500)
});