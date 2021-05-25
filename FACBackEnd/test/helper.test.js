const { toBoolean, resultToGeoJSON, isQueryInvalid, convertQueryTypes } = require('../src/helper')

/**
 * A helper function for the testing framework that produces random
 * data in the format of AWS.DynamoDB.DocumentClient.ItemList
 * @returns {AWS.DynamoDB.DocumentClient.ItemList} An itemList
 *           populated with random data
 */
const createRandomResult = () => {
  // Create between 1 and 10 elements
  const numItems = Math.floor(Math.random() * 10) + 1
  const itemList = []
  for (let i = 0; i < numItems; i++) {
    itemList.push(
      {
        IsGarbage: (Math.random() < 0.5),
        IsRecycling: (Math.random() < 0.5),
        IsCompost: (Math.random() < 0.5),
        Lat: (Math.random * 200 - 100),
        Lng: (Math.random * 200 - 100)
      }
    )
  }
  return itemList
}

describe('testing toBoolean function', () => {
  it('expect string \'true\' to output true', () => {
    expect.hasAssertions()
    const testString = 'true'
    expect(toBoolean(testString)).toBeTruthy()
  })
  it('expect string \'false\' to output false', () => {
    expect.hasAssertions()
    const testString = 'false'
    expect(toBoolean(testString)).toBeFalsy()
  })
  it('expect string \'True\' to output true', () => {
    expect.hasAssertions()
    const testString = 'True'
    expect(toBoolean(testString)).toBeTruthy()
  })
  it('expect string \'False\' to output false', () => {
    expect.hasAssertions()
    const testString = 'False'
    expect(toBoolean(testString)).toBeFalsy()
  })
  it('expect string \'awefajief\' to output false', () => {
    expect.hasAssertions()
    const testString = 'awefajief'
    expect(toBoolean(testString)).toBeFalsy()
  })
})

describe('testing resultToGeoJSON function', () => {
  const randomItemList = createRandomResult()
  const GeoJSONList = resultToGeoJSON(randomItemList)
  const allFeatures = GeoJSONList.features
  it('expect all of the GeoJSON components to be defined', () => {
    expect.hasAssertions()
    expect(GeoJSONList.type).toBe('FeatureCollection')
    expect(allFeatures).toBeDefined()
    for (let i = 0; i < allFeatures.length; i++) {
      expect(allFeatures[i].type).toBe('Feature')
      expect(allFeatures[i].properties).toBeDefined()
      expect(allFeatures[i].geometry).toBeDefined()
      expect(allFeatures[i].geometry.type).toBe('Point')
    }
  })
  it('expect all IsGarbage in the GeoJSON to be equal to the ItemList', () => {
    expect.hasAssertions()
    for (let i = 0; i < allFeatures.length; i++) {
      expect(allFeatures[i].properties.isGarbage).toBe(randomItemList[i].IsGarbage)
    }
  })
  it('expect all IsRecycling in the GeoJSON to be equal to the ItemList', () => {
    expect.hasAssertions()
    for (let i = 0; i < allFeatures.length; i++) {
      expect(allFeatures[i].properties.isRecycling).toBe(randomItemList[i].IsRecycling)
    }
  })
  it('expect all IsCompost in the GeoJSON to be equal to the ItemList', () => {
    expect.hasAssertions()
    for (let i = 0; i < allFeatures.length; i++) {
      expect(allFeatures[i].properties.isCompost).toBe(randomItemList[i].IsCompost)
    }
  })
  it('expect all Lat/Lng in the GeoJSON to be equal to the ItemList', () => {
    expect.hasAssertions()
    for (let i = 0; i < allFeatures.length; i++) {
      expect(allFeatures[i].geometry.coordinates[0]).toBe(randomItemList[i].Lat)
      expect(allFeatures[i].geometry.coordinates[1]).toBe(randomItemList[i].Lng)
    }
  })
})

describe('testing isQueryValid function', () => {
  const goodQuery = {
    latitude: 10.232,
    longitude: 10231.1,
    isGarbage: 'true',
    isCompost: 'false',
    isRecycling: 'true'
  }
  const badQuery = {
    latitude: 10.232,
    isGarbage: 'true',
    isRecycling: 'true'
  }
  it('expect the good query to return false', () => {
    expect.hasAssertions()
    expect(isQueryInvalid(goodQuery)).toBeFalsy()
  })
  it('expect the bad query to return true', () => {
    expect.hasAssertions()
    expect(isQueryInvalid(badQuery)).toBeTruthy()
  })
})

describe('testing convertQueryTypes method', () => {
  const query = {
    latitude: 10.232,
    longitude: 10231.1,
    isGarbage: 'true',
    isCompost: 'false',
    isRecycling: 'true'
  }
  const convertedQuery = convertQueryTypes(query)
  it('expect that the latitude and longitude are strings', () => {
    expect.hasAssertions()
    expect(typeof convertedQuery.latitude).toBe('string')
    expect(typeof convertedQuery.longitude).toBe('string')
  })
  it('expect that the isGarbage, isCompost, and isRecycling are all Boolean', () => {
    expect.hasAssertions()
    expect(typeof convertedQuery.isGarbage).toBe('boolean')
    expect(typeof convertedQuery.isCompost).toBe('boolean')
    expect(typeof convertedQuery.isRecycling).toBe('boolean')
  })
})
