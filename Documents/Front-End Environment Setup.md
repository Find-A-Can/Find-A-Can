# Front End Environment Setup
This will provide instructions on how to prepare to build the Android app yourself.  
All instructions are for Windows 10


Much of this is from the official React Native install page, so it is recommended to look at that if you have any issues  
[https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

## Installs
### Node
Install node version 12 or later  
[https://nodejs.org/en/](https://nodejs.org/en/)


If you already have it installed, or after you install, check your version in powershell with `node --version`

### Java JDK
Install a JDK version 8 or newer  
[https://openjdk.java.net/projects/jdk8/](https://openjdk.java.net/projects/jdk8/)

### Android Studio
Download Android Studio  
[https://developer.android.com/studio/index.html](https://developer.android.com/studio/index.html)

When you install, check the following options
- Android SDK
- Android SDK Platform
- Android Virtual Device
- Performance (Intel ® HAXM)

### Android SDK
On the Android studio home page, press configure -> SDK Manager  
Go to the "SDK Platforms" tab  
Check the box next to "Show Package Details" in the bottom right corner.  
Expand "Android 10 (Q)" and check  
- Android SDK Platform 29
- Intel x86 Atom_64 System Image

#### Configure the ANDROID_HOME environment variable
1. In windows search, go to "edit environment variables for your account"
2. Click "Environment Variables..." on the bottom right
3. Click new under user variables
4. Add the variable with name `ANDROID_HOME` and value `%LOCALAPPDATA%\Android\Sdk`
    - If you've chosen a non-default Android sdk location, use that one instad 
5. Hit "OK"

####  Add platform-tools to Path
1. In windows search, go to "edit environment variables for your account"
2. Click "Environment Variables..." on the bottom right
3. Click on the user variable "Path" and hit "Edit..."
4. Click "New" 
5. Paste a new line `%LOCALAPPDATA%\Android\Sdk\platform-tools`
    - If you've chosen a non-default Android sdk location, use that one instad 
6. Hit "OK"

## Set up Android test device
### Physical Device
To run on a physical device, use this tutorial  
[https://reactnative.dev/docs/running-on-device](https://reactnative.dev/docs/running-on-device)

### Virtual Device
Check your virtual devices in Android Studio  
- First open android studio to its front page  
- Hit "Configure", then "AVD Manager"  
- If there is a virtual device, make sure there is a green play arrow on the Actions column and a Play Store logo in the Play Store column.  
    - If it says "Download" click the word download to install the device
- If you want to make a new device, hit "Create Virtual Device..." 
    - This device must also have the Play Store logo in order for the map to function

### Add API Key
First, create a project and API Key  
[https://developers.google.com/maps/documentation/android-api/signup#release-cert](https://developers.google.com/maps/documentation/android-api/signup#release-cert)


Create a file `FACReact/android/local.properties`  
The file's contents should just be  
`MAPS_API_KEY=YOUR_API_KEY`


## Running the app
First enter a powershell window in the /FACReact/ directory


First run `npm install`  
This will install all dependencies necessary to build the project


Next run `npx react-native start`  
This will run a tool called Metro that will work as a debug console for the app

Open your Android Virtual Device or connect a physical device with USB debugging enabled

Open another powershell in /FACReact/  
Run `npx react-native run-android`  
This will compile the app and load it on all running Android devices.  
It will push to both a virtual machine and physical device at the same time if both are connected

In the Metro powershell, press `r` to push the app to the emulator

Use the app!
