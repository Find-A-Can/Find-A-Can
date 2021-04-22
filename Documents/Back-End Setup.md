# Build Docker Container
Starting in the directory of ```FACBackend```, run

 `docker build -t FACBackEnd`

 Then, run 

`docker run -p 8080:10000 -d FACBackEnd`

Now, the backend is running on a docker container on `localhost:8080`