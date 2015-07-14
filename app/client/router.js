FlowRouter.route('/', {
  action: function(params) {
    Session.set('tegenpartij', null);
    FlowLayout.render('layout', { main: "afschriften", "title": "Fortis Bankafschriften" });
  }
});

FlowRouter.route('/tegenpartijen', {
  action: function(params) {
    var o = { main: "afschriften", "title": "Tegenpartijen" },
        tp = Session.get('tegenpartij');
    if(tp) {
      o.title = tp;
    }
    FlowLayout.render('layout', o);
  }
});

FlowRouter.route('/groepen', {
  action: function(params) {
    
  }
});