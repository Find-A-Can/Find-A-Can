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
describe('testing insertion DynamoDB queries', () => {
  it('should insert item into table', async () => {
    expect.hasAssertions()
    // Inserts item into table
    await putItem.putItem('40', '40', true, false, true, config)
    const { Item } = await ddb.get({ TableName: 'Locations', Key: { Lat: 40, Lng: 40 } }).promise()
    // Checks if item is equivalent to what we expect
    expect(Item).toStrictEqual({
      Lat: 40,
      Lng: 40,
      IsGarbage: true,
      IsCompost: false,
      IsRecycling: true
    })
  })
})
