/**
* Returns a json object with given lat, lng, isCompost, isGarbage, isRecycling
*
*
* @param  lat string representation of desired latitude of can location
* @param lng string represntation of desired longitude of can location
* @param isGarb boolean value representing if given can location allows garbage waste
* @param isCompost boolean value representing if given can location allows compost waste
* @param isRecycling boolean value representing if given can location allows recylcing waste
* @return      json object with given lat, lng, isCompost, isGarbage, isRecycling
*/
function generateItem (lat, lng, isCompost, isGarbage, isRecycling) {
  return {
    TableName: 'TrueLocations',
    Item: {
      Lat: { N: lat },
      Lng: { N: lng },
      IsCompost: { BOOL: isCompost },
      IsGarbage: { BOOL: isGarbage },
      IsRecycling: { BOOL: isRecycling }
    }
  }
}
/**
* Returns response from database after insertion of item. HTTP 200 response on success, HTTP 400 otherwise.
* Prints Success on success of inserting item, prints error otherwise
* https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html

* @param  lat string representation of desired latitude of can location
* @param lng string represntation of desired longitude of can location
* @param isGarb boolean value representing if given can location allows garbage waste
* @param isCompost boolean value representing if given can location allows compost waste
* @param isRecycling boolean value representing if given can location allows recylcing waste
* @param  config configuration for which database to connect to
* @return      response to the putItem action into the database. On success, returns HTTP 200, HTTP 400 otherwise
*/
function putItem (lat, lng, isGarb, isCompost, isRecycling, config = { region: 'us-west-2' }) {
  const AWS = require('aws-sdk')
  // Set the region
  // Create the DynamoDB service object
  const ddb = new AWS.DynamoDB(config)
  const newItem = generateItem(lat, lng, isCompost, isGarb, isRecycling)
  // Call DynamoDB to add the item to the table
  return ddb.putItem(newItem, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Success', data)
    }
  }).promise()
}
module.exports = { putItem }
