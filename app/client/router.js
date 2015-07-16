FlowRouter.route('/', {
  action: function(params) {
    Session.set('tegenpartij', null);
    Session.set('groep', null);
    Session.set('searchQuery', null);
    FlowLayout.render('layout', { main: "afschriften", title: "Verrichtingen"});
  }
});

FlowRouter.route('/tegenpartijen/:id?', {
  action: function(params) {
    Session.set('searchQuery', null);
    Session.set('groep', null);
    if(params.id) {
      Session.set('tegenpartij', params.id);
      FlowLayout.render('layout', { main: "afschriften", title: "Verrichtingen"});
    } else {
      FlowLayout.render('layout', { main: "tegenpartijen", "title": "Tegenpartijen" });
    }
  }
});

FlowRouter.route('/groepen/:id?', {
  action: function(params) {
    Session.set('tegenpartij', null);
    Session.set('searchQuery', null);
    if(params.id) {
      Session.set('groep', params.id);
      FlowLayout.render('layout', { main: "afschriften", title: "Verrichtingen"});
    } else {
      FlowLayout.render('layout', { main: "groepen", "title": "Groepen" });
    }
  }
});