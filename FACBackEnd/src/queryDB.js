var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-west-2'});

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const params = {
    // Specify which items in the results are returned.
    FilterExpression: "IsGarbage = :isGarb AND Lat > :lat AND Lng < :lng",
    // Define the expression attribute value, which are substitutes for the values you want to compare.
    ExpressionAttributeValues: {
      ":isGarb": { BOOL: true },
      ":lat": { N: "1" },
      ":lng": { N: "1" },
    },
    // Set the projection expression, which are the attributes that you want.
    ProjectionExpression: "Lat, Lng, IsGarbage, IsCompost, IsRecycling",
    TableName: "Locations",
  };
  
  ddb.scan(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
      data.Items.forEach(function (element, index, array) {
        console.log(
            "printing",
            element.Lat.N + ", " + element.Lng.N + ", "
             + element.IsGarbage.BOOL + ", " + element.IsCompost.BOOL + ", " + element.IsRecycling.BOOL
        );
      });
    }
  });
  