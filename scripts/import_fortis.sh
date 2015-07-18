mongoimport -d bank -c afschriften --upsert --upsertFields="JAAR + REFERTE" --type='csv' --headerline --file=$1
mongo bank < bank_fortis.js