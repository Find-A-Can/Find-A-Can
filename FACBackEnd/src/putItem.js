function generateItem (lat, lng, isCompost, isGarbage, isRecycling) {
    return {
        TableName: 'Locations',
        Item: {
          'Lat' : {N: lat},
          'Lng' : {N: lng},
          'IsCompost' : {BOOL: isCompost},
          'IsGarbage' : {BOOL: isGarbage},
          'IsRecycling' : {BOOL: isRecycling},
        }
      };
}

var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-west-2'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var newItem = generateItem('47.5638167', '-122.1675567', false, true, true);

// Call DynamoDB to add the item to the table
ddb.putItem(newItem, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});