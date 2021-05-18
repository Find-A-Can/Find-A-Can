const csv = require('csv-parser')
const fs = require('fs')
const putItem = require('./putItem')

function readFromCSV (relativePath) {
  fs.createReadStream('./sampledata/seattlecanlocations.csv')
    .pipe(csv())
    .on('data', (row) => {
      // obj = JSON.parse(row)
      putItem.putItem('' + row.LATITUDE, '' + row.LONGITUDE, Boolean(row.isGarbage), Boolean(row.isCompost), Boolean(row.isRecycling))
        .then((result, error) => {
          if (error) console.log(error)
          else console.log(result)
        })
        // console.log(Boolean(row.isGarbage))
    })
    .on('end', () => {
      console.log('finished')
    })
}

module.exports = { readFromCSV }
