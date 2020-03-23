let unix_timestamp = 1483142400
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
var date = new Date(unix_timestamp * 1000);
console.log('unix_timestamp_date:', date)
// Hours part from the timestamp
var hours = date.getHours();
console.log('Hours part from the timestamp', hours)
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
console.log('Minutes part from the timestamp', minutes)
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();
console.log('Seconds part from the timestamp:', minutes)

// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

console.log('formattedTime:', formattedTime);
