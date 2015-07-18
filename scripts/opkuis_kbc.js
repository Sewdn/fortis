var blacklist = [
  'cregbebb',
  'kredbebb',
  'bbrubebb',
  'gkccbebb',
  'pchqbebb',
  'gebabebb',
  'arspbe22',
  'abnanl2a',
  'internet'
];
db.afschriften.find({bank: 'kbc'}).forEach(function(record) {
  var d = record.Datum.split("/"),
      descr = record.Omschrijving;

  var update = {
    amount: parseFloat(record.Bedrag.replace(',', '.')),
    date: new Date(parseInt(d[2]), parseInt(d[1]) - 1, parseInt(d[0])),
    type: 'overschrijving',
    DETAILS: descr
  };
  var tp;
  if(descr.match(/BETALING/i)) {
    //BETALING AANKOPEN 29-06-2015 OM 11.38 UUR, WWWCOOLBLUE MET KBC-BANKKAART 6703 73XX XXXX X602 7
    update.type = 'betaling';
    var bet = descr.match(/UUR\, (.*?) MET/i);
    if(bet){
      tp = bet[1];
      // var d = descr.match(/(.*?) MET KBC-BANKKAART 6703 73XX XXXX X602 7/i);
      // update.beschrijving = d[1];
    }
  }

  if(descr.match(/GELDOPNAME AAN /i)) {
    update.type = 'opname';
    //TODO: opname heeft geen tegenpartij maar een locatie
  }

  if(descr.match(/OPLADING PROTON KAART/i)) {
    update.type = 'proton';
    //TODO: proton heeft geen tegenpartij
  }

  //TODO: credit card maandstaat
  //AFREKENING KBC-MASTERCARD UITGAVENSTAAT 158 KAARTNUMMER 5478 35XX XXXX 9705
  //"AFREKENING KBC-VISA UITGAVENSTAAT 174 KAARTNUMMER 4748 10XX XXXX 8438
  if(descr.match(/AFREKENING KBC-/i)) {
    update.type = 'afrekening';
    var cc = descr.match(/KBC-(MASTERCARD|VISA) UITGAVENSTAAT/i);
    if(cc) {
      tp = cc[1].toLowerCase();
    }
    cc = descr.match(/KBC-(MASTERCARD|VISA) (.*?) KAARTNUMMER/i);
    if(cc) {
      update.beschrijving = cc[2];
    }
  }

  //AFREKENING PORTOKOSTEN OP 30-09-2014
  if(descr.match(/AFREKENING PORTO/i)) {
    update.type = 'afrekening';
    tp = 'porto';
    update.beschrijving = descr;
  }

  //"AANREKENING KOSTEN OP 31-12-2014 VAN BE91 7350 3475 4276 IN EUR ZIE BIJLAGE FACTUUR VOLGT"
  if(descr.match(/AANREKENING KOSTEN/i)) {
    update.type = 'bijdrage';
    tp = 'kbc';
  }

  //AFREKENING OP 31-12-2014 VAN BE91 7350 3475 4276 IN EUR ZIE BIJLAGE
  if(descr.match(/AFREKENING OP /i)) {
    update.type = 'bijdrage';
    tp = 'kbc';
  }

  //"AANREKENING KAARTBIJDRAGE KBC-BANKKAART KAARTNUMMER 6703 42XX XXXX X601 2 1 VAN 01/2015 TOT 12/2015 EXTRA KBC-BANKKAART 
  if(descr.match(/AANREKENING KAARTBIJDRAGE /i)) {
    update.type = 'bijdrage';
    tp = 'kbc';
  }

  //OVERSCHRIJVING REFERENTIE 00352035014A0228 ZIE BIJLAGE
  var unknown = descr.match(/OVERSCHRIJVING REFERENTIE (.*?) ZIE BIJLAGE/i);
  if(unknown) {
    tp = unknown[1];
  }

  if(descr.match(/DOMICILIERING/i)) {
    //"EUROPESE DOMICILIERING SCHULDEISER     : ENI GAS  POWER NV/SA REF. SCHULDEISER: 151402973860 MANDAATREFERTE  : 61000000054797 EIGEN OMSCHR.   : 61000000054797 MEDEDELING      : IN-182112523308
    update.type = 'domiciliering';
    var r = descr.match(/MANDAATREFERTE\s+:\s+(.*) EIGEN/i);
    if(r && r.length) {
      tp = r[1];
    }
  }

  if(!tp) {
    var tpTests = [
      /OVERSCHRIJVING VAN (.*?) BANKIER/i,
      /OVERSCHRIJVING NAAR (.*?) BANKIER/i
    ],
    tpTestIndex = 0,
    tpMatch = descr.match(tpTests[tpTestIndex]);
    
    while(!tpMatch && tpTestIndex < tpTests.length) {
      tpMatch = descr.match(tpTests[tpTestIndex]);
      tpTestIndex++;
    }
    if(tpMatch) {
      tp = tpMatch[1];
    } else {
      printjson({'no ref found': descr});
      //if still no unique ref was found
    }
  }
  if(!update.beschrijving){
    var descrTests = [
      /MEDEDELING : (.*)/i,
      /BEGUNSTIGDE: (.*?) DOORGEGEVEN/i,
      /BEGUNSTIGDE: (.*?) MET INTERNET/i,
      /OPDRACHTGEVER: (.*?) REFERENTIE/i,
      /OPDRACHTGEVER: (.*)/i
    ];
    var descrTestIndex = 0;
    var descrMatch = descr.match(descrTests[descrTestIndex]);
    while(descrTestIndex < descrTests.length && !descrMatch) {
      descrMatch = descr.match(descrTests[descrTestIndex]);
      descrTestIndex++;
    }
    if(descrMatch) {
      update.beschrijving = descrMatch[1].trim().toLowerCase();
    } else {
      //printjson({'no descr found': descr});
    }
  }

  //lookup tegenpartij
  var original = tp;
  tp = tp.trim().toLowerCase().replace('internet', '');
  var tpRef = {ref: tp},
      tpRec = db.tegenpartij.findOne(tpRef);
  if(!tpRec){
    var tpId = new ObjectId();
    tpRef._id = tpId;
    tpRef.original = original;
    tpRef.number = original;
    //try to construct a human readable title
    if( update.type === 'overschrijving' ||
        update.type === 'betaling') {
      var tests = [
        /BEGUNSTIGDE: (.*?) DOORGEGEVEN/i,
        /BEGUNSTIGDE: (.*?) MET INTERNET/i,
        /BEGUNSTIGDE: (.*)/i,
        /OPDRACHTGEVER: (.*?) REFERENTIE/i,
        /OPDRACHTGEVER: (.*)/i,
        /UUR, (.*?) MET/
      ];
      var testIndex = 0;
      match = descr.match(tests[testIndex]);
      while(testIndex < tests.length && !match) {
        match = descr.match(tests[testIndex]);
        testIndex++;
      }
      if(match) {
        title = match[1].trim().toLowerCase();
        //remove bank codes
        blacklist.forEach(function(b){
          title = title.replace(b, '');
        });
        //strip of after company structure
        var companies = [
          'bvba',
          'b v b a',
          'cvba',
          'b.v.',
          'nv',
          'n.v',
          'n.v.',
          'sa',
          'nv/sa',
          'vzw'
        ];
        companies.forEach(function(c){
          var i = title.indexOf(" " + c + " ");
          if(i > 0) {
            title = title.substr(0, i);
          }
        });
        tpRef.title = title;
      } else {
        //no title found
        printjson({'no title found': descr});
      }
    } else if(update.type === 'domiciliering') {
      //EUROPESE DOMICILIERING SCHULDEISER : ENI GAS POWER NV/SA REF. SCHULDEISER: 151403328309 MANDAATREFERTE : 
      var d = descr.match(/SCHULDEISER\s+: (.*?) REF. /i);
      if(d && d.length) {
        title = d[1].trim().toLowerCase();
        tpRef.title = title;
      }
    }
    db.tegenpartij.insert(tpRef);
    tpRec = tpRef;
  }
  //remove bank codes from descriptions
  if(update.beschrijving){
    blacklist.forEach(function(b){
      update.beschrijving = update.beschrijving.replace(b, '');
    });
  }
  update.tegenpartij = tpRec._id;
  db.afschriften.update({_id: record._id}, {$set: update});
});
