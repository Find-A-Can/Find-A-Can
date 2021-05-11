# Back-End Design
Database: We will use a flat MySQL database, using Amazon DynamoDB to store the information.
The schema will be the following:
```
CREATE TABLE Locations (
    Lat Number,
    Lng Number,
    IsGarbage BOOL,
    IsCompost BOOL,
    IsRecycling BOOL
);
```
In this case, Lat is the partition key in our database and Lng is the sort key.
This will allow for each entry in the table to represent a single trash station, and indicate what kinds of trash disposal facilities are available at every location.
The lat and lng fields correspond the the latitude and longitude of the trash station.

Lat and Lng will be on a scale from -180 to 180.

# API Endpoints
## Get Requests:
getTrashCansInArea

- Parameters: NorthLatitude, EastLongitude, SouthLatitude, WestLongitude
- Returns: A GeoJSON object of the locations of the trash cans
    - Each can will be its own Feature,  
       With the properties "isGarbage":"true|false", "isCompost":"true|false", and "isRecycling":"true|false"

This is an example GeoJSON that we will be using. This has a single can location with both garbage and compost, but not recycling.
```JSON
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "isGarbage": "true",
        "isCompost": "true",
        "isRecycling": "false"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -122.3068857192993,
          47.65706299337809
        ]
      }
    }
  ]
}
```

## Post Request:
addNewTrashCan

- Parameters: Latitude, Longitude, isGarbage, isCompost, isRecycling
- Returns: A success or failure parameter

