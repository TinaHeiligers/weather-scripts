These scripts are used to fetch weather data from Dark Sky, do some basic data manipulation and save it to file.

- `collector.js`: fetches data from Dark Sky and writes the data to file (json format). An array of dates for the data is also written to file
- `toJsonl.js` reads the stored data from file, extracts the daily data and does some basic data manipulation (converts the unix-second dates to unix-millisecond) and rewrites the daily data to the `data/daily_data/` folder as a jsonl file as `daily_data_<year>.jsonl`.

- `hourlyToJsonl.js` reads the stored data from file, extracts the hourly data and does some basic data manipulation (converts the unix-second dates to unix-millisecond) and rewrites the hourly data to the `data/hourly_data/` folder as a jsonl file as `hourly_data_<year>.jsonl`.

Filebeat then reads the data from file, sends it to logstash for pipeline processing and writing the data to an elasticsearch index on the cloud.
ref: https://www.elastic.co/guide/en/logstash/current/advanced-pipeline.html

## Filebeat (manual process for now)
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
The `filebeat.yaml` file looks something like:
```
# use: ./filebeat -e -c filebeat.yml -d "publish"
filebeat.inputs:
- paths:
  - ../weather-scripts/data/daily_data/hourly_data_2020.jsonl
  - ...more file paths for daily data
  - ../weather-scripts/data/hourly_data/hourly_data_2020.jsonl
  - ...more file paths for hourly data
  json.keys_under_root: true
  json.add_error_key: true
output.logstash:
  hosts: ["localhost:5044"]
###

```
## Logstash
Logstash is a sibling project to this one found at `Projects/logstash-7.6.1`.
The data transformations take care of adding the `date` field (and removing the time from which the date was derived in a more usable format) to the daily data files. The `hourlyToJsonl.js` script doesn't add the `date` field and I use this field name as a filter for the index to send the data to.
The logstash filter also casts the `cloudCover` data to a float (if the first entry ES encounters is 0, the field will be mapped as an int). The template mappings should take care of that but there's no harm in ensuring we have the correct mapping type.

Logstash takes a configuration file with 3 main headings: input, filter and output. I read input from the beat (in this case, filebeat using a hashed port), add the filters that do the type casting and addition of meta fields used to send the daily and hourly data to separate indices and set the output to ES. To that the connection is working, comment out the ES output and only set the output to stdout:
```
# in logstash-simple.conf
# To run, use
# $ bin/logstash -f logstash-simple.conf --config.reload.automatic
# note that the config file is being used, not the yml
input {
  beats {
    port => "5044"
  }
}
filter {
  grok { match => [ "cloudCover", "%{NUMBER:cloudCover:float}" ] }

  if [date] != "" {
    mutate { add_field => { "[@metadata][collection]" => "daily" } }
  }
  else {
    mutate { add_field => { "[@metadata][collection]" => "hourly" } }
  }
  # filters: https://www.elastic.co/guide/en/logstash/current/filter-plugins.html
  # removing, changing, adding fields etc, use:
  # https://www.elastic.co/guide/en/logstash/current/plugins-filters-mutate.html

  # mutate {

  # }
}
output {
  elasticsearch {
    hosts => ["https://6f7074564b4f4251afa3af6e2ea0c970.us-central1.gcp.cloud.es.io:9243"]
    index => "%{[@metadata][collection]}_data"
    user => elastic
    password => fuGs2BCCcwiGfakFGP8cBJm4
  }

  # stdout { codec => rubydebug }
}

```
Test this out by running: `bin/logstash -f logstash-simple.conf --config.test_and_exit`. There might be warnings about the `logstash.yml` file but this file is there to run multiple pipelines and the warnings can be ignored for now.
A succesful test indicates a valid config and has a signature similar to:
```
Configuration OK
[2020-04-24T16:46:50,867][INFO ][logstash.runner          ] Using config.test_and_exit mode. Config Validation Result: OK. Exiting Logstash
```
Once the test passes, start up logstash to see the output in stdout:
`bin/logstash -f logstash-simple.conf --config.reload.automatic`


## Changing mappings and mutating fields

Use a reindex operation to mutate document fields using pipelines. The new index should be created using an updated version of the old indexes' template.
Steps to reindex using pipelines for field mutations (creating the new index that maps the date field from the daily data):
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

## TODO
1. figure out what needs to happen to get the new data into ES (pipelines etc that need to run)
2. upload new data and index to ES via filebeat -> logstash
