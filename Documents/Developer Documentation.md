# How to Obtain the Source Code
Clone this git repository 

# Layout of the Directory
Documents: project specs, backend and frontend specs, installation and deployment guides  
Reports: reports to our project manager  
FACReact: React Native source code  
FACBackEnd: back end code running our can location database  

# How to Build the Software

## Set up AWS DynamoDB

This backend is designed to communicate with a free AWS Dynamo DB server. Make sure you have one set up  
[https://aws.amazon.com/dynamodb/](https://aws.amazon.com/dynamodb/)  
Set it up and get your API keys  
[https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html)

## Add API Keys to back end

In the `/FACBackend/` folder, edit the file `.env`.  
Add your AWS Dynamo DB keys so the file looks exactly like this
```
ACCESS_KEY=ACCESSKEYHERE
SECRET_KEY=SECRETKEYHERE
```

Open a shell in the `/Find-A-Can` folder and run the command
`git update-index --assume-unchanged .\FACBackEnd\.env`  
This will prevent you from accidentally adding an API key to a commit

## Installs

### Docker 
Install Docker [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)  
Ensure you have WSL 2 installed as described in the install instructions

### Gradle 
Download a gradle binary  
[https://gradle.org/install/](https://gradle.org/install/)

Extract the .zip file into `C:/Gradle/gradle-{gradle version}/`  
For example the newest version and newest install would be `C:/Gradle/gradle-7.0.1/`  

#### Add Gradle to path variable
1. In windows search, go to "edit environment variables for your account"
2. Click "Environment Variables..." on the bottom right
3. Click on the user variable "Path" and hit "Edit..."
4. Click "New" 
5. Paste a new line `C:/Gradle/gradle-7.0.1/`
6. Hit "OK"

Finally check your gradle by opening a shell and typing `gradle -v`  
It should report back your gradle version if installed correctly

## Build and run Docker Container
Starting in the directory of ```FACBackend```, run

 `docker build . -t facbackend_server && docker compose down && docker compose up`

Now, the backend is running on a docker container on `localhost:8080`

# How to Test the Software
Use the command `gradle test` at the top level directory to run the tests for both the frontend and backend

# How to Add New Tests
When naming test files, name it after the file you are testing such as `filename.test.js` in the `FACBackend/test` folder. Each test must pass our jest rules that is described in our `.eslintrc.json` in order to be qualified as a valid test and won't compile if violated.

# How to Build a Release of the Software
