db.afschriften.find({type: 'opname'}).forEach(function(record) {
  //var test = record.DETAILS.match(/MET KAART \d{4} ([dX]){4} XXXX X(d){3} d (.)* d{2}\/d{2}\/d{4}/);
  var regex = /MET KAART \d{4} \d{2}XX XXXX X\d{3} \d (.*?) \d{2}([\/\-]{1})\d{2}([\/\-]{1})\d{4}/i;
  match = regex.exec(record.DETAILS);
  if(match){
    printjson(match);
  }
});
