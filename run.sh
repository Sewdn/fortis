. setupdb.sh
if [ -z "$1" ]
  then
    port=3000
  else
    port=$1
fi
cd app
meteor --port=$port --settings=../settings.json
