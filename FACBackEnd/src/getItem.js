/**
* Returns a json object with given latitude and longitude to retrieve from database
*
*
* @param  lat string representation of desired latitude of can location
* @param lng string represntation of desired longitude of can location
* @return      json object with given latitude and longitude as keys
*/
function generateGetItem (lat, lng) {
  return {
    TableName: 'Locations',
    Key: {
      Lat: { N: lat },
      Lng: { N: lng }
    },
    ProjectionExpression: 'Lat, Lng, IsCompost, IsGarbage, IsRecycling'
  }
}
/**
* Returns an Item from the given database with the given latitude and longitude.
* Prints Success on success of retrieving item, prints error otherwise
*
* @param  lat string representation of desired latitude of can location
* @param lng string represntation of desired longitude of can location
* @param  config configuration for which database to connect to
* @return      item at the specified latitude and longitude
*/
function getItem (lat, lng, config = { region: 'us-west-2' }) {
  const AWS = require('aws-sdk')
  // Set the region
  AWS.config.update(config)

  // Create the DynamoDB service object
  const ddb = new AWS.DynamoDB(config)
  const getItem = generateGetItem(lat, lng)
  // Call DynamoDB to read the item from the table
  return ddb.getItem(getItem, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Success', data.Item)
    }
  })
}
module.exports = { getItem }
