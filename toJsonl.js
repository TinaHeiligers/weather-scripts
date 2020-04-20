const fs = require('file-system')
const moment = require('moment')
const year = 2003
const dataFileRead = JSON.parse(fs.readFileSync(`./data/data_${year}.json`));
const dateFileRead = JSON.parse(fs.readFileSync(`./data/dates_${year}.json`));

// const openedDataForDailyFile = fs.openSync(`./data/daily_data_${year}.jsonl`, "w");
const openedDataForDailyFile = fs.openSync(`./data/daily_data/daily_data_${year}.jsonl`, "w");

function convertTimeFromUnixToISO8600(unixTime, offset) {
  return moment.unix(unixTime).utcOffset(-offset * 60).toISOString()
};

// TODO: make transformations to the element's elements here.
const arrayOfConvertedDailyDataForYear = dataFileRead.map((element, index) => {
  if (year !== 2020 && index !== dataFileRead.length - 1) {
    let newDate;
    for (const property in element.daily.data[0]) {
      if (property === "time") {
        newDate = convertTimeFromUnixToISO8600(element.daily.data[0][property], 7);
      } else if (property.endsWith('Time')) {
        element.daily.data[0][property] = convertTimeFromUnixToISO8600(element.daily.data[0][property], 7)
      }
    }
    const dailyExtractedData = {
      ...element.currently,
      nearest_station: element.flags["nearest-station"],
      latitude: element.latitude,
      longitude: element.longitude,
      sources: element.flags.sources,
      timezone: element.timezone,
      ...element.daily.data[0],
      date: newDate
    }
    // delete the time key since we now have a date key
    delete dailyExtractedData.time;
    fs.writeSync(openedDataForDailyFile, JSON.stringify(dailyExtractedData) + '\n');
    return dailyExtractedData;
  }
  const dateForEntrySkipped = convertTimeFromUnixToISO8600(dataFileRead[dataFileRead.length - 1].currently.time, 7)
  console.log('skipping last entry', dateForEntrySkipped)
});

fs.closeSync(openedDataForDailyFile);

