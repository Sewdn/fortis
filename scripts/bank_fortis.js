db.afschriften.update({bank: {$exists: false}}, {$set: {bank: 'fortis'}}, {multi: true});
