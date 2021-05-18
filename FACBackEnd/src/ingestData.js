const csv = require('csv-parser')
const fs = require('fs')
const putItem = require('./putItem')

/**
 * Takes a path to a local .csv file that contains data to be pushed to an AWS DynamoDB instance
 * The .csv file must have the headers 'LATITUDE', 'LONGITUDE' as numbers and the headers
 * 'isGarbage', 'isCompost', 'isRecycling' as boolean values
 *
 * The success/failure of operations are logged on the console.
 * @param {string} relativePath
 *
 */
function readFromCSV (relativePath) {
  fs.createReadStream(relativePath)
    .pipe(csv())
    .on('data', (row) => {
      putItem.putItem('' + row.LATITUDE, '' + row.LONGITUDE, Boolean(row.isGarbage), Boolean(row.isCompost), Boolean(row.isRecycling))
        .then((result, error) => {
          // will log errors if there is a failure, and will log the return parameter from AWS DynamoDB
          if (error) console.log(error)
          else console.log(result)
        })
    })
    .on('end', () => {
      // logs once the operation is finished
      console.log('finished')
    })
}

module.exports = { readFromCSV }
