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

# API Endpoints
## Get Requests:
getSurroundingTrashCans

- Parameters: Latitude, Longitude, radius (in miles)
- Returns: A GeoJSON object of the locations of the trash cans

## Post Request:
addNewTrashCan

- Parameters: Latitude, Longitude, isGarbage, isCompost, isRecycling
- Returns: A success or failure parameter

