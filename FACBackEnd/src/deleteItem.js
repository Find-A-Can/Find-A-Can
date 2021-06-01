function generateDeleteItem (lat, lng) {
  return {
    TableName: 'TrueLocations',
    Key: {
      Lat: { N: lat },
      Lng: { N: lng }
    }
  }
}
function deleteItem (lat, lng) {
  const AWS = require('aws-sdk')
  // Set the region
  AWS.config.update({ region: 'us-west-2' })

  // Create the DynamoDB service object
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

  const params = generateDeleteItem(lat, lng)

  // Call DynamoDB to delete the item from the table
  ddb.deleteItem(params, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Success', data)
    }
  })
}
module.exports = { deleteItem }
