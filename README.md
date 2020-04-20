These scripts are used to fetch weather data from Dark Sky, do some basic data manipulation and save it to file.

- `collector.js`: fetches data from Dark Sky and writes the data to file (json format). An array of dates for the data is also written to file
- `toJsonl.js` reads the stored data from file, does some basic data manipulation (converts the unix-second dates to unix-millisecond) and rewrites the data to file in jsonl format.

The intention is to use filebeat to read the data from file, send it to logstash for pipeline processing and write the data to an elasticsearch index on the cloud.
ref: https://www.elastic.co/guide/en/logstash/current/advanced-pipeline.html

## Filebeat
Files to be read are listed in the `filebeat.yml` file within the `filebeat-7.6.1-darwin-x86_64` folder as a sibling to this repo.
To start filebeat and read the files specified in the `filebeat.input` paths run:
```
$ cd Projects/filebeat-7.6.1-darwin-x86_64
$ ./filebeat -e -c filebeat.yml -d "publish"
```
Each file will be read once, and add an entry to the `./data/registry` file to indicate that the data has been read.
Data won't be read again, even if filebeat is stopped and restarted. In order to repeat the process, delete the record of a file having been read from the data/registry file (or delete the whole file to remove records from all the files that have been read).

If `output.console` is specified, the output is written to the terminal, we want the output to go to logstash.
To send the data, change the output to logstash:
```
<!-- in filebeat.yml -->
output.logstash:
  hosts: ["localhost:5044"]
```
The `filebeat.yaml` file should now look something like:
```
# use: ./filebeat -e -c filebeat.yml -d "publish"
filebeat.inputs:
- paths:
  - ../weather-scripts/data/data_2020.jsonl
  - ../weather-scripts/data/data_2018.jsonl
  json.keys_under_root: true
  json.add_error_key: true
output.logstash:
  hosts: ["localhost:5044"]
###

```
## Logstash
Logstash is a sibling project to this one found at `Projects/logstash-7.6.1`.
Logstash takes a configuration file with 3 main headings. To read input from the beat (in this case, filebeat), we set the input to a beat hashed to a port and test that the connection is working, we set the output to stdout:
```
# in logstash-simple.conf

input {
  beats {
    port => "5044"
  }
}
# filter {

# }
output {
  # elasticsearch { hosts => ["<cloud-id>"] }
  stdout { codec => rubydebug }
}
```
Test this out by running: `bin/logstash -f logstash-simple.conf --config.test_and_exit`. THere might be warnings about the `logstash.yml` file but this file is there to run multiple pipelines and the warnings can be ignored for now.
Once the test passes, start up logstash to see the output in stdout:
`bin/logstash -f logstash-simple.conf --config.reload.automatic`


## Changing mappings and mutating fields

Use a reindex operation to mutate document fields using pipelines. The new index should be created using an updated version of the old indexes' template.
Steps to reindex using pipelines for field mutations:
1. Create the pipeline that will do the mutation
2. Test the pipeline using the `_ingest/pipeline/simulate` API with a representative document that will be reindexed.
3. Update the index template:
```
PUT_template/daily_data_template
{
  ....original template _with_ the new fields
}
```
3. Reindex from the old index to the new one:
```
POST _reindex
{
  "source": {
    "index": "daily_data_"
  },
  "dest": {
    "index": "daily_data_1",
    "pipeline": "daily_data_pipelines"
  }
}
```
Note: Both the `daily_data_` and the `daily_data_1` indices match the index defined in the `daily_data_template`.

## Ingest pipelines
There are two index pipelines used when reindexing from the original mapping into a new index where the data data date is parsed out. The date is parsed to group the data by month. A new index is created from the reindexed data so that the original data is preserved but the grouped data is comparable.

## Index Aliases

From v3 (50003) of the daily_data_template, the daily_data_* indices are aliased to `all_daily_data`.
v3 (50003, unfortunately the same version as the later version `daily_data_template_v4.json`) of the template adds the index alias.

From v4 (1004) of the hourly_data_template, the hourly_data_* and the hourly_data* indices are aliased to `all_hourly_data`.
v2 (1001 -> I know, unfortunately nomenclature) of the template adds the index alias.
AFAIK, hourly data hasn't been reindexed or transformed yet in es. I need to figure out how best to structure the data _after_ deciding how I want to compare it.
