mongoimport -d bank -c afschriften --upsert --upsertFields="Omschrijving" --type='csv' --headerline --file=$1
mongo bank < bank_kbc.js
