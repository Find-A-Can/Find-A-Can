const getItem = require('./getItem.js')
const queryDB = require('./queryDB.js')

const express = require('express')
const app = express()

const port = 3000

const dummyData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        isGarbage: true,
        isCompost: true,
        isRecycling: true
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -122.30759382247925,
          47.65881179780758
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        isGarbage: true,
        isCompost: true,
        isRecycling: true
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -122.30946063995361,
          47.65437463432688
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        isGarbage: true,
        isCompost: true,
        isRecycling: true
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -122.30370998382567,
          47.65544421310926
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        isGarbage: true,
        isCompost: true,
        isRecycling: true
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -122.30332374572754,
          47.6584071209998
        ]
      }
    }
  ]
}

app.get('/getTrashCansInArea', async (req, res) => {
  currQuery = req.query

  projectionExpression = 'Lat, Lng, IsCompost, IsGarbage,IsRecycling'
  condition = 'Lat between :south and :north and Lng between :west and :east'
  expression = {
    ':north': parseInt(currQuery.NorthLatitude),
    ':south': parseInt(currQuery.SouthLatitude),
    ':east': parseInt(currQuery.EastLongitude),
    ':west': parseInt(currQuery.WestLongitude)
  }
  
  data = await queryDB.query(condition, expression, projectionExpression)

  output = data.map((e) => {
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

  res.json(output)
})

app.post('/update', (req, res) => {
  console.log(req.query)
  res.send('received!')
})

app.listen(port, () => console.log(`Hello world app is listening on port ${port}!`))
