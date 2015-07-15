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