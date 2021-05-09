# Back-End Design
Database: We will use a flat MySQL database, using Amazon DynamoDB to store the information.
The schema will be the following:
```
CREATE TABLE Locations (
    lat DECIMAL(9,6),
    lng DECIMAL(9,6),
    isGarbage BIT,
    isCompost BIT,
    isRecycling BIT
);
```
This will allow for each entry in the table to represent a single trash station, and indicate what kinds of trash disposal facilities are available at every location.
The lat and lng fields correspond the the latitude and longitude of the trash station.

lat and long will be on a scale from -180 to 180.

# API Endpoints
## Get Requests:
getTrashCansInArea

- Parameters: MaxLatitude, MaxLongitude, MinLatitude, MinLongitude
- Returns: A GeoJSON object of the locations of the trash cans
    - Each can will be its own Feature,  
       With the properties "isGarbage":"true|false", "isCompost":"true|false", and "isRecycling":"true|false"

## Post Request:
addNewTrashCan

- Parameters: Latitude, Longitude, isGarbage, isCompost, isRecycling
- Returns: A success or failure parameter

