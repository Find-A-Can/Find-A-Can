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

## Building 
First you need to prepare your computer and physical or virtual Android devices to build React Native apps
[Follow our setup instructions here](https://github.com/Find-A-Can/Find-A-Can/blob/main/Documents/Front-End%20Environment%20Setup.md)

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
