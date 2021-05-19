# Find-A-Can

## Our Idea
There is so much trash in our cities and sometimes it’s hard to find a place to put your litter. We want to map all public garbage and recycling bins to make it easier to be a conscientious citizen. Sometimes it’s hard to find the nearest place to dispose of something, so it will help 
## Our Vision
We want to help people who want to make our cities cleaner. If it’s easier to find a trash bin for someone who doesn’t really want to litter, it would be less likely they litter. With no options, someone might just give up and drop their trash. Improperly handled trash hurts our local ecosystems. Our project is data driven and human powered. Our groundbreaking technology will allow citizens to help keep their neighborhoods clean and more easily dispose of waste in public.

While there exists an app that does this, it has some shortcomings we’d like to improve upon. It doesn’t differentiate garbage types, as recycling, compost, and garbage are all listed as the same thing. It also relies on unfiltered crowdsourced data, so it may not be very accurate in some locations. 

## Repository
- Documents: project specs, backend and frontend specs, installation and deployment guides
- Reports: reports to our project manager
- FACReact: React Native source code
- FACBackEnd: back end code running our can location database

## Progression on Use Cases
Currently working use cases
- Browse the map for local disposal locations
  - The map is updated live based off of the data stored in the back end as you stop panning
- Suggest a new can location
  - The + button on the app will send a request to the back end to add a marker
    - Currently adds a garbage can at the center of the screen. Will be updated in the future to add other types of cans

## Want to run the app?

[Check our user guide for instructions!](https://github.com/Find-A-Can/Find-A-Can/blob/main/Documents/User%20Guide.md)

## Want to contribute to the app?

[Check our developer guide here!](https://github.com/Find-A-Can/Find-A-Can/blob/main/Documents/Developer%20Documentation.md)

## Building 

First you need to prepare your computer and physical or virtual Android devices to build React Native apps
[Follow our setup instructions here](https://github.com/Find-A-Can/Find-A-Can/blob/main/Documents/Front-End%20Environment%20Setup.md)

You also need some setup for the back end to build properly. 
[Follow our setup instructions here](https://github.com/Find-A-Can/Find-A-Can/blob/main/Documents/Back-End%20Setup.md)

Next run the bash command `gradle test` in the Find-A-Can/ directory   
This will install all packages and test both the front and back ends  
Note that on some machines installing npm packages may take up to 15 minutes



## Running 

### Android App / Front End
Make sure your Android physical and/or virtual devices are connected and set up  
Open a shell window in Find-A-Can/FACReact  
Run `npx react-native start`  
This will boot a program called Metro that is used to read back any console logging from the app  
Leave this shell open

Next compile and run the android app in a new shell window in /Find-A-Can/  
Run `gradle run-android`  
This will compile and run the app on all connected virtual or physical Android devices

### Back end

Open a shell in `FACBackend` and run

 `docker build . -t facbackend_server && docker compose down && docker compose up`

Now, the backend is running on a docker container on `localhost:8080`


