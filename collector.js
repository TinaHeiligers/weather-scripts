const Dotenv = require('dotenv');
const DarkSky = require('dark-sky');

Dotenv.config({ path: `${__dirname}/.env` });

const darkSky = new DarkSky(process.env.DARK_SKY);

const lat = 33.3560276;
const long = -111.7443246;

function getDates() {
  let d = new Date();
  const dateRanges = [];

  for (let i = 0; i < 10; i++) {
    d.setDate(d.getDate() - 1);
    dateRanges.push(d.toISOString().slice(0, 10))
  }
  return dateRanges;
}


function getWeatherData() {
  const dates = getDates();
  const weatherDataPromises = [];

  for (let i = 0; i <= dates.length; i++) {
    console.log(dates[i]);
    weatherDataPromises.push(darkSky
      .latitude(lat.toString())
      .longitude(long)
      .time(dates[i])
      .get()
    )
  }

  return weatherDataPromises;
}

const promises = getWeatherData();

Promise.all(promises).then(results => console.log(results));



