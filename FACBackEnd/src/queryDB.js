const AWS = require('aws-sdk')
/**
* Returns requested items of the query from DynamoDb database
* Prints Number of items received on success of querying, prints error otherwise
*
* @param  config configuration for which database to connect to
* @param  filterExpr condition to filter by on the database
* @param exprAttributeVal object key value pairs to use as part of filterExpr
* @param projExpr fields to project as the query result of each item
* @return      Returns requested items as an array of the query
*
*/
async function query (filterExpr, exprAttributeVal, projExpr, config = { region: 'us-west-2' }) {
  // Set the region
  AWS.config.update(config)
  // Create DynamoDB service object
  const ddb = new AWS.DynamoDB.DocumentClient(config)

  const params = {
    // Specify which items in the results are returned.
    FilterExpression: filterExpr,
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: exprAttributeVal,
    // Set the projection expression, which are the attributes that you want.
    ProjectionExpression: projExpr,
    TableName: 'TrueLocations'
  }
  const request = await ddb.scan(params, function (err, data) {
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
