// Ensures DocumentClient is installed
const { DocumentClient } = require('aws-sdk/clients/dynamodb')
const putItem = require('../src/putItem.js')
const isTest = process.env.JEST_WORKER_ID
// Configuration for DocumentClient
const config = {
  convertEmptyValues: true,
  ...(isTest && {
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env'
  })
}
const ddb = new DocumentClient(config)
test('should insert item into table', async () => {
// Inserts item into table
  await putItem.putItem(config, '40', '40', true, false, true)
  const { Item } = await ddb.get({ TableName: 'Locations', Key: { Lat: 40, Lng: 40 } }).promise()
  // Checks if item is equivalent to what we expect
  expect(Item).toEqual({
    Lat: 40,
    Lng: 40,
    IsGarbage: true,
    IsCompost: false,
    IsRecycling: true
  })
})
