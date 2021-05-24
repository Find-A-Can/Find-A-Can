const AWS = require('aws-sdk')

async function query (config, filterExpr, exprAttributeVal, projExpr) {
  // Set the region
  AWS.config.update({ region: 'us-west-2' })
  // Create DynamoDB service object
  const ddb = new AWS.DynamoDB.DocumentClient(config)

  const params = {
    // Specify which items in the results are returned.
    FilterExpression: filterExpr,
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: exprAttributeVal,
    // Set the projection expression, which are the attributes that you want.
    ProjectionExpression: projExpr,
    TableName: 'Locations'
  }
  const request = await ddb.scan(params, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      // console.log('Received ' + String(data.Count) + ' points')
    }
  }).promise()

  // console.log(request)
  return request.Items
}
module.exports = { query }
