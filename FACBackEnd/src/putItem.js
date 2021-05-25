function generateItem (lat, lng, isCompost, isGarbage, isRecycling) {
  return {
    TableName: 'Locations',
    Item: {
      Lat: { N: lat },
      Lng: { N: lng },
      IsCompost: { BOOL: isCompost },
      IsGarbage: { BOOL: isGarbage },
      IsRecycling: { BOOL: isRecycling }
    }
  }
}
// Inserts an item into the Location Table
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-table-read-write.html
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
