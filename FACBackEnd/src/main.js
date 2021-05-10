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

app.get('/locations', (req, res) => {
  res.json(dummyData)
})

app.post('/update', (req, res) => {
  console.log(req.query)
  res.send('recieved!')
})

app.listen(port, () => console.log(`Hello world app is listening on port ${port}!`))
