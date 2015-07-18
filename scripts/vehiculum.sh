mongo bank --eval 'db.dropDatabase();'
. import_kbc.sh ../data/vehiculum.csv
mongo bank < opkuis_kbc.js
