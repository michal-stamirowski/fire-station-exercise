# Front-end ui fire station test 


## Prerequisites:
-node.js version v8.9.1 or higher.

## Installing:
-in project directory install dependencies with 
```
npm install
```
-start express serwer with
```
npm start
```
-after that the server should start on port 80. Go to
```
http://localhost:80/
```
in your browser.

## How to use

The app loads with default data provided with task. 
To add city, road or change maximum time of arrival on site pick from select according option and provide input confirming with plus button.

The city tables are color coded. 

Red - means that city nor it's neighbours doesn't have fire station or it can't get in time. 

Blue - means that city itself doesn't have fire station, but it's neigbhour does and it can get in time on site. 

Green - means that city itself has a fire station.

Every city got a dropdown with every connecting road. 

The search tool points you in the right direction, revealing the dropdown of matched input city.

## Author

### Micha³ Stamirowski 2018
