export function query (filterExpr, exprAttributeVal, projExpr) {
  const AWS = require('aws-sdk')
  // Set the region
  AWS.config.update({ region: 'us-west-2' })

  // Create DynamoDB service object
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

  const params = {
    // Specify which items in the results are returned.
    FilterExpression: filterExpr,
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: exprAttributeVal,
    // Set the projection expression, which are the attributes that you want.
    ProjectionExpression: projExpr,
    TableName: 'Locations'
  }

  ddb.scan(params, function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Success', data)
      data.Items.forEach(function (element, index, array) {
        console.log(
          'printing',
          element.Lat.N + ', ' + element.Lng.N + ', ' +
             element.IsGarbage.BOOL + ', ' + element.IsCompost.BOOL + ', ' + element.IsRecying.BOOL
        )
      })
    }
  })
}
module.exports = { query }
