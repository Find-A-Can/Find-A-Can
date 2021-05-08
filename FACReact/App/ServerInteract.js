

const geojsontest = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "marker-color": "tomato",
          "marker-size": "medium",
          "marker-symbol": "square"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -122.30759382247925,
            47.65881179780758
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "marker-color": "blue",
          "marker-size": "medium",
          "marker-symbol": ""
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -122.30946063995361,
            47.65437463432688
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "marker-color": "yellow",
          "marker-size": "medium",
          "marker-symbol": "triangle"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -122.30370998382567,
            47.65544421310926
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "marker-color": "aqua",
          "marker-size": "medium",
          "marker-symbol": "circle"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            -122.30332374572754,
            47.6584071209998
          ]
        }
      }
    ]
  }

export async function getCans(newRegion) {
  console.log("getting cans in " + JSON.stringify(newRegion, null, 2));
  return geojsontest;
}

export function getDefaultData() {
  return {
    "type": "FeatureCollection",
    "features": []
  }
}
