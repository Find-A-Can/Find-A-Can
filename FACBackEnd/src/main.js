const queryDB = require('./queryDB.js')

const express = require('express')
const app = express()

const port = 3000

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

  const data = await queryDB.query(condition, expression, projectionExpression)

  const output = data.map((e) => {
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

  const geoJSON = {
    type: 'FeatureCollection',
    features: output
  }

  res.json(geoJSON)
})

app.post('/update', (req, res) => {
  console.log(req.query)
  res.send('received!')
})

app.listen(port, () => console.log(`Hello world app is listening on port ${port}!`))
