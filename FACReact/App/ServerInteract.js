/** 
 * ServerInteract manages any connections to the garbage can location server
 *  */

// Dummy data to send back to front end
// To be removed when API is working
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

// Max waiting time before giving up on an API request
//  In ms so 1000 = 1 second
const MAXAPIWAITTIME = 3 * 1000;

// URL to server
// TODO fill with amazon server URL
const CONNECTIONURL = 'http://IPv4:3000'

/**
 * Takes a region and calls to the server to find any cans in that region
 * @param {Object} newRegion Rectangular search region
 * @param {Number} newRegion.latitude Center latitude value of rectangle
 * @param {Number} newRegion.latitudeDelta Latitude size of view rectangle
 * @param {Number} newRegion.longitude Center longitude value of rectangle
 * @param {Number} newRegion.longitudeDelta Longitude size of view rectangle
 * 
 * @returns {Object} GeoJSON FeatureCollection of cans found in area
 * 
 * @throws Error if either the request takes more than MAXAPIWAITTIME ms 
 *  or the network request fails
 */
export async function getCans(newRegion) {
  console.log("getting cans in " + JSON.stringify(newRegion, null, 2));
  //return geojsontest;

  // creates rectangle with highest latitude and longitude values as the first
  //  point and the lowest as the second
  let firstLat = newRegion.latitude + (newRegion.latitudeDelta / 2);
  let secondLat = newRegion.latitude - (newRegion.latitudeDelta / 2);
  let firstLong = newRegion.longitude + (newRegion.longitudeDelta / 2);
  let secondLong = newRegion.longitude - (newRegion.longitudeDelta / 2);
 
  // Makes GET request to server using the points
  let fetchPromise = fetch(CONNECTIONURL + '/getSurroundingTrashCans?' +
  'firstLatitude=' + firstLat + '&firstLongitude=' + firstLong + 
  '&secondLatitude=' + secondLat + '&secondLongitude=' + secondLong, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
  .then((response) => response.json())
  .then((json) => {
    console.log("GET trash cans in an area succeeded");
    console.log(json);

    // TODO replace with returned data
    return geojsontest;
  })
  .catch((error) => {
    console.log("GET trash cans in an area failed");
    console.error(error);
  });

  // Timeout to prevent infinite wait time for fetch
  // At the end of timeout ejects from function
  const delay = (timeout, error) => new Promise(
    (resolve, reject) => setTimeout(() => { 
      // TODO replace with reject once API can be connected to
      // This placeholder makes it load the test data on fail
      resolve(error); 
      //reject(error); 
    }, timeout)
  );

  // Leaves function when the first promise is returned
  // This is when the timeout ends, the network request succeeds or the request fails
  await Promise.race([fetchPromise, 
    delay(MAXAPIWAITTIME, 'Timeout on add cans reached, no response after ' 
      + MAXAPIWAITTIME + "ms")
  ]);

  // TODO remove once API is connectable
  return geojsontest;
}

/**
 * Returns an empty GeoJSON FeatureCollection for initialization
 * @returns {Object} Empty GeoJSON FeatureCollection
 */
export function getDefaultData() {
  return {
    "type": "FeatureCollection",
    "features": []
  }
}

/**
 * Sends a POST request to the database to add a new can
 * 
 * @param {Number} latitude Latitude of new can
 * @param {Number} longitude Longitude of new can
 * @param {Boolean} isGarbage Whether can takes garbage
 * @param {Boolean} isCompost Whether can takes compost
 * @param {Boolean} isRecycling Whether can takes recycling
 * 
 * @throws Error if the request takes more than MAXAPIWAITTIME ms 
 *  or the network request fails
 * 
 * @returns {String} message on success
 */
export async function addNewCan(
  latitude, longitude, isGarbage, isCompost, isRecycling) {

  // Makes POST request to server to add a new can
  let fetchPromise = fetch(CONNECTIONURL + '/addNewTrashCan', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: {
      latitude: latitude, 
      longitude: longitude, 
      isGarbage: isGarbage, 
      isCompost: isCompost, 
      isRecycling: isRecycling,
    }
  })
  .then((response) => response.json())
  .then((json) => {
    console.log("Add new trash can succeeded");
    console.log(json);

    return "added new can";
  })
  .catch((error) => {
    console.log("Add new trash can failed");
    console.error(error);
  });

  // Timeout to prevent infinite wait time for fetch
  // At the end of timeout ejects from function
  const delay = (timeout, error) => new Promise(
    (resolve, reject) => setTimeout(() => { 
      reject(error); 
    }, timeout)
  );

  // Leaves function when the first promise is returned
  // This is when the timeout ends, the network request succeeds or the request fails
  await Promise.race([fetchPromise, 
    delay(MAXAPIWAITTIME, 'Timeout on add cans reached, no response after ' 
      + MAXAPIWAITTIME + "ms")
  ]);
}