# Set up AWS DynamoDB

This backend is designed to communicate with a free AWS Dynamo DB server. Make sure you have one set up  
[https://aws.amazon.com/dynamodb/](https://aws.amazon.com/dynamodb/)  
Set it up and get your API keys  
[https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html)

## Add API Keys to back end

In the `/FACBackend/` folder, add a new file `.env`.  
Add your AWS Dynamo DB keys so the file looks exactly like this
```
ACCESS_KEY=ACCESSKEYHERE
SECRET_KEY=SECRETKEYHERE
```

# Installs

## Docker 
Install Docker [https://docs.docker.com/docker-for-windows/install/](https://docs.docker.com/docker-for-windows/install/)  
Ensure you have WSL 2 installed as described in the install instructions

## Gradle 
Download a gradle binary  
[https://gradle.org/install/](https://gradle.org/install/)

Extract the .zip file into `C:/Gradle/gradle-{gradle version}/`  
For example the newest version and newest install would be `C:/Gradle/gradle-7.0.1/`  

### Add Gradle to path variable
1. In windows search, go to "edit environment variables for your account"
2. Click "Environment Variables..." on the bottom right
3. Click on the user variable "Path" and hit "Edit..."
4. Click "New" 
5. Paste a new line `C:/Gradle/gradle-7.0.1/`
6. Hit "OK"

Finally check your gradle by opening a shell and typing `gradle -v`  
It should report back your gradle version if installed correctly

# Build and run Docker Container
Starting in the directory of ```FACBackend```, run

 `docker build . -t facbackend_server && docker compose down && docker compose up`

Now, the backend is running on a docker container on `localhost:8080`
