const { request } = require('express')

async function query (filterExpr, exprAttributeVal, projExpr) {
  const AWS = require('aws-sdk')
  // Set the region
  AWS.config.update({ region: 'us-west-2' })
  output = []
  // Create DynamoDB service object
  const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

  const params = {
    // Specify which items in the results are returned.
    FilterExpression: filterExpr,
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: exprAttributeVal,
    // Set the projection expression, which are the attributes that you want.
    ProjectionExpression: projExpr,
    TableName: 'Locations'
  }
  var request = await ddb.scan(params, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Received ' + String(data.Count) + ' points')
    }
  }).promise()
   
  // console.log(request)
  return request.Items
}
module.exports = { query }
