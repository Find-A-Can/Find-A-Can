
const queryDB = require('../src/queryDB.js')
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
const testInvalid = [-1, -1, -1, -1]
test('query result should be nothing', async () => {
  const projectionExpression = 'Lat, Lng, IsCompost, IsGarbage,IsRecycling'
  const condition = 'Lat between :south and :north and Lng between :west and :east'
  const expression = {
    ':north': parseFloat(testInvalid[0]),
    ':south': parseFloat(testInvalid[1]),
    ':east': parseFloat(testInvalid[2]),
    ':west': parseFloat(testInvalid[3])
  }
  expect.hasAssertions()
  const Items = await queryDB.query(config, condition, expression, projectionExpression)
  var expected = []
  expect(Items).toStrictEqual(expected)
})
