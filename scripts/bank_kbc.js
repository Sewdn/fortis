db.afschriften.update({bank: {$exists: false}}, {$set: {bank: 'kbc'}}, {multi: true});
