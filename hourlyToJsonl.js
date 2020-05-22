const fs = require('file-system')
const moment = require('moment')
const year = 1971;
const dataFileRead = JSON.parse(fs.readFileSync(`./data/raw/data_${year}.json`));
const dateFileRead = JSON.parse(fs.readFileSync(`./data/raw/dates_${year}.json`));

const openedDataForHourlyFile = fs.openSync(`./data/hourly_data/hourly_data_${year}.jsonl`, "w");

function convertTimeFromUnixToISO8600(unixTime, offset) {
  return moment.unix(unixTime).utcOffset(-offset * 60).toISOString()
};

// TODO: make transformations to the element's elements here.
const arrayOfConvertedDailyDataForYear = dataFileRead.map((element, index) => {
  if (year !== 2020 && index !== dataFileRead.length - 1) {
    const hourlyData = element.hourly.data.map(datum => {

      for (const property in datum) {
        if (property === "time") {
          datum[property] = convertTimeFromUnixToISO8600(datum[property], 7)
        } else if (property.endsWith('Time')) {
          datum[property] = convertTimeFromUnixToISO8600(datum[property], 7)
        }
      }
      fs.writeSync(openedDataForHourlyFile, JSON.stringify(datum) + '\n');
      return datum;
    })
    return hourlyData;
  }
  const dateForEntrySkipped = convertTimeFromUnixToISO8600(dataFileRead[dataFileRead.length - 1].currently.time, 7)
  console.log('skipping last entry', dateForEntrySkipped)
})



fs.closeSync(openedDataForHourlyFile);

