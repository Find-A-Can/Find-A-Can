const queryDB = require('./queryDB.js')
const putItem = require('./putItem')
const { resultToGeoJSON, isQueryInvalid, convertQueryTypes } = require('./helper')
const express = require('express')
const app = express()
app.use(express.json())

// port number used for main connections
const port = 3000

/**
 * The GET request for getting all trash cans within a rectangle described by the position of the
 * edges of the rectangle. The GET request has four (4) parameters
 *
 * @param {Float} NorthLatitude The latitude of the northern end of the bounding box to query
 * @param {Float} SouthLatitude The latitude of the southern end of the bounding box to query
 * @param {Float} EastLongitude The longitude of the eastern end of the bounding box to query
 * @param {Float} WestLongitude The longitude of the western end of the bounding box to query
 * @returns A GeoJSON array of cans within the bounding box with the given form of:
 *        {
 *        type: 'Feature',
 *         properties: {
 *           isGarbage: Boolean,
 *           isCompost: Boolean,
 *           isRecycling: Boolean
 *          },
 *          geometry: {
 *            type: 'Point',
 *            coordinates: [
 *              Latitude (Float),
 *              Longitude (Float)
 *            ]
 *          }
 *        }
 */
app.get('/getTrashCansInArea', async (req, res) => {
  const currQuery = req.query

  const projectionExpression = 'Lat, Lng, IsCompost, IsGarbage,IsRecycling'
  const condition = 'Lat between :south and :north and Lng between :west and :east'
  const expression = {
    ':north': parseFloat(currQuery.NorthLatitude),
    ':south': parseFloat(currQuery.SouthLatitude),
    ':east': parseFloat(currQuery.EastLongitude),
    ':west': parseFloat(currQuery.WestLongitude)
  }

  queryDB.query(condition, expression, projectionExpression)
    .then(result => {
      return resultToGeoJSON(result)
    }).then(result => {
      res.json(result).status(200)
    }).catch(() => {
      res.sendStatus(500)
    })
})

app.use(express.json())

/**
 * The POST request for adding a new can to our database with the given parameters.
 * @param {Float} latitude The latitude of the new can location
 * @param {Float} longitude The longitude of the new can location
 * @param {Boolean} isGarbage a boolean to tell if a garbage can is available at the location
 * @param {Boolean} isCompost a boolean to tell if composting is available at the submitted location
 * @param {Boolean} isRecycling a boolean to tell if recycling is available at the submitted location
 * @returns The status of the query, 500 and 400 for an error, 200 for success. Modifies a persistent database
 *          to include the new can location
 */
app.post('/addNewTrashCan', (req, res) => {
  let { query } = req

  // console.log(req.query)

  if (isQueryInvalid()) {
    res.sendStatus(400)
  }

  query = convertQueryTypes(query)

  putItem.putItem(query.latitude, query.longitude, query.isGarbage, query.isCompost, query.isRecycling)
    .then((result, error) => {
      if (error) res.sendStatus(500)
      else res.send(result).status(200)
    })
})

app.post('/update', (req, res) => {
  console.log(req.query)
  res.send('received!')
})

app.listen(port, () => console.log(`The Find-A-Can backend is listening on port ${port}!`))
