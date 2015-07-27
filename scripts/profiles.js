var profiles = [
  {
    title: "Delhaize",
    matches: [
      'delh_kontich kontich',
      'delh_reet reet',
      'delh_wilrijk wilrijk',
      'delh_ boechout boechout'
    ]
  },
];

profiles.forEach(function(profile) {
  profile._id = new ObjectId();
  db.profiles.insert(profile);
  db.tegenpartij.find({ref: {$in: profile.matches}}).forEach(function(tegenPartij) {
    db.tegenpartij.update({_id: tegenPartij._id}, {$set: {profile: profile._id}});
  });
});

