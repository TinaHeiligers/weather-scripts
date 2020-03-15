const readline = require('readline');

const askForStartDate = (rl) => {
  return new Promise((resolve, reject) => {
    rl.question('Enter start date in the format yyyy-mm-dd: ', (answer) => {
      startDate = answer;
      console.log(`Start date ${answer}`)
      resolve(startDate);
    })
  })
}
const askForEndDate = (rl) => {
  return new Promise((resolve, reject) => {
    rl.question('Enter end date in the format yyyy-mm-dd: ', (answer) => {
      endDate = answer;
      console.log(`End date ${answer}`)
      resolve(endDate);
    })
  })
}

const main = async () => {
  let startDate = '';
  let endDate = '';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  startDate = await askForStartDate(rl);
  console.log('startDate', startDate)
  endDate = await askForEndDate(rl);
  console.log('startDate', startDate)
  if (startDate.length && endDate) {
    console.log('have them both')
  }
  rl.close();
  // TODO: take the start and end dates and use them in the collector script.
}
main();

// }
