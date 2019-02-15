# ColbyShuttle

## API
iframe URL: https://colbyshuttle.ridesystems.net

Base API URL: http://colbyshuttle.ridesystems.net/Services/JSONPRelay.svc

To get all possible endpoints: ?wsdl <br>
To get route: /GetRoutes  <br>
To get routes for map: /GetRoutesForMap  <br>
To get vehicle location: /GetMapVehiclePoints <br>
To get the vehicle name and ids: /GetVehicles and /GetVehicleRoutes <br>
To get map stop estimates:/GetMapStopEstimates <br>
To get next stop estimate: / GetRouteVehicleEstimates <br>
To get active shuttle routes: /GetScheduleRouteActiveTimeSpans

## Structure
This is a monorepo of sorts. Within this repo you will find the following projects:
* **Announcer (/announcer)**: an application that, every minute, announces the locations of each bus
* **API (/api)**: a nice wrapper around the GET http requests
* **GUI (/gui)**: an application that maps the buses on a map using MapBox 
*  **Twilio Text Status Update Bot (/textupdater)**: texts updates to people so that they don't need to look at the app when waiting for the bus to arrive