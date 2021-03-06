const queryDB = require('../src/queryDB.js')
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

describe('testing DynamoDB get queries', () => {
  const projectionExpression = 'Lat, Lng, IsCompost, IsGarbage,IsRecycling'
  const condition = 'Lat between :south and :north and Lng between :west and :east'
  it('query result should be nothing', async () => {
    expect.hasAssertions()
    await putItem.putItem('40', '40', true, false, true, config)
    await putItem.putItem('46', '40', true, false, true, config)

    const testInvalid = [-1, -1, -1, -1]
    const expression = {
      ':north': parseFloat(testInvalid[0]),
      ':south': parseFloat(testInvalid[1]),
      ':east': parseFloat(testInvalid[2]),
      ':west': parseFloat(testInvalid[3])
    }
    const Items = await queryDB.query(condition, expression, projectionExpression, config)
    const expected = []
    expect(Items).toStrictEqual(expected)
  })
  it('query result of valid lat range and lng range', async () => {
    expect.hasAssertions()
    await putItem.putItem('40', '40', true, false, true, config)
    await putItem.putItem('46', '40', true, false, true, config)
    const test = [45, 39, 41, 30]
    const expression = {
      ':north': parseFloat(test[0]),
      ':south': parseFloat(test[1]),
      ':east': parseFloat(test[2]),
      ':west': parseFloat(test[3])

    }
    const Items = await queryDB.query(condition, expression, projectionExpression, config)
    const expected = [{ Lat: 40, Lng: 40, IsGarbage: true, IsCompost: false, IsRecycling: true }]
    expect(Items).toStrictEqual(expected)
  })
  it('query result of finding IsGarbage', async () => {
    expect.hasAssertions()
    const isGarbCondition = 'Lat between :south and :north and Lng between :west and :east and IsGarbage = :isgarb'
    const test = [45, 39, 41, 30]
    await putItem.putItem('40', '40', true, false, true, config)
    await putItem.putItem('46', '40', true, false, true, config)
    const expression = {
      ':north': parseFloat(test[0]),
      ':south': parseFloat(test[1]),
      ':east': parseFloat(test[2]),
      ':west': parseFloat(test[3]),
      ':isgarb': true
    }
    const Items = await queryDB.query(isGarbCondition, expression, projectionExpression, config)
    const expected = [{ Lat: 40, Lng: 40, IsGarbage: true, IsCompost: false, IsRecycling: true }]
    expect(Items).toStrictEqual(expected)
  })
})
