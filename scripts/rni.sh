mongo bank --eval 'db.dropDatabase();'
. import_kbc.sh ../data/rni.csv
mongo bank < opkuis_kbc.js
