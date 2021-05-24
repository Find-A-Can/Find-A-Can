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

function getItem (config, lat, lng) {
  const AWS = require('aws-sdk')
  // Set the region
  AWS.config.update({ region: 'us-west-2' })

  // Create the DynamoDB service object
  const ddb = new AWS.DynamoDB(config)
  const getItem = generateGetItem(lat, lng)
  // Call DynamoDB to read the item from the table
  ddb.getItem(getItem, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Success', data.Item)
    }
  })
}
module.exports = { getItem }
