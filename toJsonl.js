const fs = require('file-system')
const dataFileRead = JSON.parse(fs.readFileSync("./data/data_2010.json"));
const dateFileRead = JSON.parse(fs.readFileSync("./data/dates_2010.json"));

const openedDataForCurrentlyFile = fs.openSync("./data/currently_data_2010.jsonl", "w");
const openedDataForDailyFile = fs.openSync("./data/daily_data_2010.jsonl", "w");
const openedDataForHourlyFile = fs.openSync("./data/hourly_data_2010.jsonl", "w");

// TODO: make transformations to the element's elements here.
const arrayOfConvertedDailyDataForYear = dataFileRead.map((element, index) => {
  // the element is an object
  const convertedDataItem = {
    ...element,
    date: dateFileRead[index],
    currently: {
      ...element.currently
    },
    daily: {
      ...element.daily,
      // only the objects inside the array
      data: element.daily.data[0],
    },
    hourly: {
      // returns an array of objects
      data: element.hourly.data,
    }
  }
  const dailyDataEntries = { ...convertedDataItem.daily };
  const hourlyDataEntries = { ...convertedDataItem.hourly };
  delete convertedDataItem.daily;
  delete convertedDataItem.hourly;
  fs.writeSync(openedDataForCurrentlyFile, JSON.stringify(convertedDataItem) + '\n')
  fs.writeSync(openedDataForDailyFile, JSON.stringify(dailyDataEntries) + '\n');
  fs.writeSync(openedDataForHourlyFile, JSON.stringify(hourlyDataEntries) + '\n');
  return convertedDataItem;
});

fs.closeSync(openedDataForCurrentlyFile);
fs.closeSync(openedDataForDailyFile);
fs.closeSync(openedDataForHourlyFile);
