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

TODO:
- [ ] Convert as much data as possible _before_ writing the file to jsonl.
- [ ] Specify index for logstash to write to.
