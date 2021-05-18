module.exports = {
  tables: [
    {
      TableName: 'Locations',
      KeySchema: [{ AttributeName: 'Lat', KeyType: 'HASH' }, { AttributeName: 'Lng', KeyType: 'RANGE' }],
      AttributeDefinitions: [{ AttributeName: 'Lat', AttributeType: 'N' }, { AttributeName: 'Lng', AttributeType: 'N' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 }
    }
  ]
}
