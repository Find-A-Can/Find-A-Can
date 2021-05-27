/**
 * A case-insensitive function to convert a string into a boolean
 *
 * @param {string} input The value to convert into a boolean
 * @returns true if the input string is the same as 'true', false otherwise
 */
const toBoolean = (input) => {
  const val = ('' + input).toLowerCase()
  return val === 'true'
}

/**
 * A helper function that converts the output from the AWS DynamoDB query to the
 * GeoJSON format
 *
 * @param {AWS.DynamoDB.DocumentClient.ItemList} itemList The list of items returned
 *        from a query to the AWS DynamoDB database.
 * @returns The data present in itemList represented as a GeoJSON object
 */
const resultToGeoJSON = (itemList) => {
  const GeoJSONList = itemList.map(e => {
    return {
      type: 'Feature',
      properties: {
        isGarbage: e.IsGarbage,
        isCompost: e.IsCompost,
        isRecycling: e.IsRecycling
      },
      geometry: {
        type: 'Point',
        coordinates: [
          e.Lat,
          e.Lng
        ]
      }
    }
  })
  return {
    type: 'FeatureCollection',
    features: GeoJSONList
  }
}

/**
 * A helper function to determine if a POST request on the endpoint addNewTrashCan
 * is invalid and should not be processed.
 *
 * @param {qs.ParsedQs} query The query body of a Post request to the endpoint
 * @returns true if the query is invalid, false if it is valid
 */
const isQueryInvalid = (query) => {
  return typeof query.latitude === 'undefined' ||
            typeof query.longitude === 'undefined' ||
            typeof query.isGarbage === 'undefined' ||
            typeof query.isCompost === 'undefined' ||
            typeof query.isRecycling === 'undefined'
}

/**
 * Converts all elements of the query body of a POST request to the correct typing
 *
 * @param {qs.ParsedQs} query The query body of a POST request to the endpoint
 * @returns the same information as the query body in the form of a JavaScript object
 *          where the elements have the correct typing
 */
const convertQueryTypes = (query) => {
  return {
    latitude: query.latitude.toString(),
    longitude: query.longitude.toString(),
    isGarbage: toBoolean(query.isGarbage),
    isCompost: toBoolean(query.isCompost),
    isRecycling: toBoolean(query.isRecycling)
  }
}

module.exports = { toBoolean, resultToGeoJSON, isQueryInvalid, convertQueryTypes }
