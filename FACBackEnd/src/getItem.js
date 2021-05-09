function generateGetItem (lat, lng) {
    return {
        TableName: 'Locations',
        Key: {
          'Lat' : {N: lat},
          'Lng' : {N: lng}
        },
        ProjectionExpression: 'Lat, Lng, IsCompost, IsGarbage, IsRecycling'
      };
}
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-2'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var getItem = generateGetItem('47.5638167', '-122.1675567');
// Call DynamoDB to read the item from the table
ddb.getItem(getItem, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.Item);
    }
  });