const { DocumentClient } = require('aws-sdk/clients/dynamodb')

const isTest = process.env.JEST_WORKER_ID
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
  await ddb
    .put({ TableName: 'Locations', Item: { Lat: 40, Lng: 40, IsGarbage: true, IsCompost: false, IsRecycling: true } })
    .promise()

  const { Item } = await ddb.get({ TableName: 'Locations', Key: { Lat: 40, Lng: 40 } }).promise()

  expect(Item).toEqual({
    Lat: 40,
    Lng: 40,
    IsGarbage: true,
    IsCompost: false,
    IsRecycling: true
  })
})
