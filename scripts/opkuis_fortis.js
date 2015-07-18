db.afschriften.find({bank: 'fortis'}).forEach(function(record) {
  var d = record.UITVOERINGSDATUM.split("/"),
      descr = record.DETAILS.match(/MEDEDELING : (.)* UITGEVOERD OP/g);
    if(!descr || !descr.length) {
      descr = record.DETAILS.match(/MEDEDELING : (.)* VALUTADATUM/g);
    }
    var update = {
      amount: parseFloat(record.BEDRAG.replace(',', '.')),
      date: new Date(parseInt(d[2]), parseInt(d[1]) - 1, parseInt(d[0])),
      type: 'overschrijving'
    };
    var detect = false,
        tp;
    if(record.DETAILS.match(/BETALING MET BANKKAART/i) ||
      record['TEGENPARTIJ VAN DE VERRICHTING'].match(/BETALING MET BANKKAART/i)){
      update.type = 'betaling';
      detect = true;
    }

    if(record.DETAILS.match(/GELDOPNAME AAN /i) ||
      record['TEGENPARTIJ VAN DE VERRICHTING'].match(/GELDOPNAME AAN /i)){
      update.type = 'opname';
      //TODO: opname heeft geen tegenpartij maar een locatie
      detect = true;
    }

    if(record['TEGENPARTIJ VAN DE VERRICHTING'].match(/OPLADING PROTON KAART/i)){
      update.type = 'proton';
      //TODO: proton heeft geen tegenpartij
      detect = true;
    }

    if(record['TEGENPARTIJ VAN DE VERRICHTING'].match(/MAANDELIJKSE BIJDRAGE/i) ||
      record['TEGENPARTIJ VAN DE VERRICHTING'].match(/MAANDELIJKSE EQUIPERINGSKOSTEN/i)){
      update.type = 'bijdrage';
      detect = false;
      tp = 'fortis';
    }

    if(record.DETAILS.match(/DOMICILIERING/i)){
      update.type = 'domiciliering';
      detect = true;
    }
    if(detect){
      //MET KAART 6703 04XX XXXX X300 6 BOOM-CENTRUM BOOM 10-07-2015 UITGEVOERD OP 10-07 VALUTADATUM : 10/07/2015
      var regex = /MET KAART \d{4} \d{2}XX XXXX X\d{3} \d (.*?) \d{2}/i;
      match = regex.exec(record.DETAILS);
      if(match && match.length > 1){
        tp = match[1];
      }
    }
    if(!tp) {
      tp = record['TEGENPARTIJ VAN DE VERRICHTING'];
      if(tp === 'UW DOORLOPENDE OPDRACHT NAAR' ||
         tp === 'EUROPESE OVERSCHRIJVING NAAR' ||
         tp === 'EUROPESE OVERSCHRIJVING VAN' ||
         tp === 'EUROPESE DOMICILIERING VAN'){
        var r = record.DETAILS.match(/\ (BE|M){1}([0-9\ ]+)/g);
        if(r && r.length){
          tp = r[0];
        }
      }
      tp = tp.trim();
      var original = tp;
      tp = tp.replace(/\ /g, '');
      tp = tp.replace(/\-/g, '');
      if(tp.length === 16) {
        tp = tp.substr(tp.length - 12);
      }
    }
  if(descr && descr[0]){
    update.beschrijving = descr[0].replace("MEDEDELING : ", "").replace(" UITGEVOERD OP", "").replace(" VALUTADATUM", "").trim().toLowerCase();
  }
  //lookup tegenpartij
  tp = tp.toLowerCase().replace('internet', '').trim();
  var tpRef = {ref: tp},
      tpRec = db.tegenpartij.findOne(tpRef);
  if(!tpRec){
    var tpId = new ObjectId();
    tpRef._id = tpId;
    tpRef.original = record['TEGENPARTIJ VAN DE VERRICHTING'];
    tpRef.number = original;
    //try to construct a human readable title
    if( update.type === 'overschrijving' ||
        update.type === 'betaling') {
      var title = record.DETAILS.match(/(.*?) BE/i);
      if(! title) {
        title = record.DETAILS.match(/(.*) \d{3}-/i);
      }
      if(title){
        title = title[1];
        var strip = title.match(/,\d{2}[\-\+](.*)/i);
        if(strip) {
          title = strip[1];
        }
        var vanvia = title.match(/van (.*) via/i);
        if(vanvia) {
          title = vanvia[1];
        } else {
          vanvia = title.match(/van (.*) mededeling/i);
          if(vanvia) {
            title = vanvia[1];
          } else {
            vanvia = title.match(/^van (.*)/i);
            if(vanvia) {
              title = vanvia[1];
            }
          }
        }
        title = title.replace('INTERNET', ''),
        title = title.trim();
        title = title.toLowerCase();
        printjson(title);
        tpRef.title = title;
      } else {
        //no title found
        printjson(record.DETAILS);
      }
    }
    var insert = db.tegenpartij.insert(tpRef);
    tpRec = tpRef;
  }
  update.tegenpartij = tpRec._id;
  db.afschriften.update({_id: record._id}, {$set: update});
});
