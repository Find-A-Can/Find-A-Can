const queryDB = require('./queryDB.js')
const putItem = require('./putItem')

const express = require('express')
const app = express()
app.use(express.json())

const port = 3000

const toBoolean = (input) => {
  const val = ('' + input).toLowerCase()
  return val === 'true'
}

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

  const config = { region: 'us-west-2' }

  queryDB.query(config, condition, expression, projectionExpression)
    .then(result => {
      return result.map(e => {
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
    }).then(result => {
      res.json({
        type: 'FeatureCollection',
        features: result
      }).status(200)
    }).catch(() => {
      res.sendStatus(500)
    })
})

app.use(express.json())

app.post('/addNewTrashCan', (req, res) => {
  const { query } = req

  // console.log(req.query)

  if (!query.latitude || !query.longitude || !query.isGarbage || !query.isCompost || !query.isRecycling) {
    res.sendStatus(400)
  }
  putItem.putItem('' + query.latitude, '' + query.longitude, toBoolean(query.isGarbage), toBoolean(query.isCompost), toBoolean(query.isRecycling))
    .then((result, error) => {
      if (error) res.sendStatus(500)
      else res.send(result).status(200)
    })
})

app.post('/update', (req, res) => {
  console.log(req.query)
  res.send('received!')
})

app.listen(port, () => console.log(`Hello world app is listening on port ${port}!`))
