var gcvs = {
  '735016783614': 'Red & Ivory',
  'M038718187469': 'telenet domiciliering',
  '405050461148': 'telenet',
  '402752609152': 'acerta',
  '375111099940': 'verkeersbelasting',
  '679200231036': 'auto belasting',
  '799575735923': 'auto verzekering DVV',
  '408403100137': 'auto garage Willy',
  '679200222144': 'belastingen Boom',
  '679200223558': 'belastingen Lier',
  '679200349355': 'btw mechelen',
  '679200300047': 'btw',
  '001448928507': 'Boekhouding KMO',
  '063242529640': 'Boekhouding Thys',
  '001327775002': 'participatiefonds',
  '777591050277': 'provinciebelasting',
  '679165450775': 'RSVZ',
  '435410980188': 'SVMB',
  '310160464055': 'tonershop',
  '096221204982': 'VKB',
  '091012514645': 'vlaamse zorgkas',
  '733017537731': 'xerius'
};

db.groepen.insert({title: 'GCV'});
var gcv = db.groepen.findOne();
// db.afschriften.aggregate([
//   {$match: {
//     tegenpartij: {$in: Object.keys(gcv)}
//   }},
//   {$group: {
//     _id: "$tegenpartij",
//     transactions: { $sum: 1 },
//     total: { $sum: "$amount" }
//   }}
// ]).forEach(function(record) {
//   record.tegenpartij = gcv[record._id];
//   printjson(record);
// });
db.tegenpartij.update({$or:[
  {ref: {$in: Object.keys(gcvs)}}
]}, {$addToSet: {groups: gcv._id}}, {multi: true});
