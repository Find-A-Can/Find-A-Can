const express = require('express')
const app = express()

const port = 3000

const dummyData = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [125.6, 10.1]
  },
  properties: {
    IsTrash: true,
    IsRecycling: true,
    IsCompost: true
  }
}

app.get('/locations', (req, res) => {
  res.json(dummyData)
})

app.listen(port, () => console.log(`Hello world app is listening on port ${port}!`))
