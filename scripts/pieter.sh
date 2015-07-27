mongo bank --eval 'db.dropDatabase();'
. import_fortis.sh ../data/2010.csv
. import_fortis.sh ../data/2011.csv
. import_fortis.sh ../data/2012.csv
. import_fortis.sh ../data/2013.csv
. import_fortis.sh ../data/2014.csv
. import_fortis.sh ../data/2015.csv
. import_fortis.sh ../data/2015_2.csv
mongo bank < opkuis_fortis.js
mongo bank < gcv.js
mongo bank < profiles.js
