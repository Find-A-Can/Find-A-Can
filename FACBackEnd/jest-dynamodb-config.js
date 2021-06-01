module.exports = {
  tables: [
    {
      TableName: 'TrueLocations',
      KeySchema: [{ AttributeName: 'Lat', KeyType: 'HASH' }, { AttributeName: 'Lng', KeyType: 'RANGE' }],
      AttributeDefinitions: [{ AttributeName: 'Lat', AttributeType: 'N' }, { AttributeName: 'Lng', AttributeType: 'N' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }
    }
  ]
}
