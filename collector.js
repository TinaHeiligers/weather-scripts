const { config } = require('dotenv');
const DarkSky = require('dark-sky');
const fs = require('file-system')

config({ path: `${__dirname}/.env` });

const darkSky = new DarkSky(process.env.DARK_SKY);

const lat = 33.3560276;
const long = -111.7443246;

function getDates() {
  let d = new Date('2010-01-01');
  const dateRanges = [];

  for (let i = 0; i < 365; i++) {
    d.setDate(d.getDate() - 1);
    dateRanges.push(d.toISOString().slice(0, 10))
  }
  return dateRanges;
}


function getWeatherData() {
  const dates = getDates();
  fs.writeFile('./data/dates_2009.json', JSON.stringify(dates, null, 2));
  const weatherDataPromises = [];

  for (let i = 0; i <= dates.length; i++) {
    weatherDataPromises.push(darkSky
      .latitude(lat.toString())
      .longitude(long)
      .time(dates[i])
      .units('si')
      .get()
    )
  }

  return weatherDataPromises;
}

function runGetAndWriteWeatherData() {
  const promises = getWeatherData();

  Promise.all(promises).then(results => {
    fs.writeFile('./data/data_2009.json', JSON.stringify(results, null, 2));
    console.log(results)
  })
};

return runGetAndWriteWeatherData();
