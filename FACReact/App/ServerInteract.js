/** 
 * ServerInteract manages any connections to the garbage can location server
 *  */

// Max waiting time before giving up on an API request
//  In ms so 1000 = 1 second
const MAXAPIWAITTIME = 10 * 1000;

// URL to server
// TODO fill with amazon server URL
const CONNECTIONURL = 'http://10.0.0.106:3000'

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
  let northLat = newRegion.latitude + (newRegion.latitudeDelta / 2);
  let southLat = newRegion.latitude - (newRegion.latitudeDelta / 2);
  let eastLong = newRegion.longitude + (newRegion.longitudeDelta / 2);
  let westLong = newRegion.longitude - (newRegion.longitudeDelta / 2);

  // ensures values are between -180 and 180
  // as our map view doesn't scroll vertically past the poles, 
  //  we do not have to normalize Latitude
  eastLong = (eastLong % 360 + 540) % 360 - 180;
  westLong = (eastLong % 360 + 540) % 360 - 180;
 
  // Makes GET request to server using the points
  let fetchPromise = fetch(CONNECTIONURL + '/locations?' +
  'NorthLatitude=' + northLat + '&EastLongitude=' + eastLong + 
  '&SouthLatitude=' + southLat + '&WestLongitude=' + westLong, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
  .then((response) => response.json())
  .then((json) => {
    console.log("GET trash cans in an area succeeded");
    //console.log(JSON.stringify(json, null, 2));

    return json;
  })
  .catch((error) => {
    console.log("GET trash cans in an area failed");
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
  return await Promise.race([fetchPromise, 
    delay(MAXAPIWAITTIME, 'Timeout on add cans reached, no response after ' 
      + MAXAPIWAITTIME + "ms")
  ]);
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