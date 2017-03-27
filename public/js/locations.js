
// App: Locations
// ------------------------------
//   createMap
//   handleInput
//     addMarker

// create application
(function(i){ i({name:"locations"}); })(initialzr);

// add node family "map"
locations.augment("map");

// Node: mapCreator
// creates map
locations.addNode("map", "createMap", function(args) {

    var map = new google.maps.Map(document.getElementById(args.selector), {
        zoom: args.zoom,
        center: {
            lat: args.lat,
            lng: args.lng
        }
    });

    return map;
});

// Node: addMarker
// adds marker to a map
locations.addNode("map", "addMarker", function(args) {

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(args.lat,args.lng)
    });

    marker.setMap(args.map);
    return marker;
});

// Node: handleInput
// handlers user input
locations.addNode("map", "handleInput", function(args) {

    // intercept submit event
    args.$submit.on("click", function(e) {

        // stop the default submission of the form
        e.preventDefault();

        // gather data
        var data = {
            lat: parseFloat(args.$lat.val()),
            lng: parseFloat(args.$lng.val())
        };

        // execute client callback with data
        args.callback(data)
    });
});

// entrypoint
jQuery(document).ready(function($) {

    // get map box from DOM
    var $mapBox = $(".map-box");

    // set coordinates for New York
    var newYorkCoordinates = {
        lat: 40.705311,
        lng: -74.258188
    };

    // 1. create map
    var map = locations.getNode("map", "createMap")({
        selector: "map",
        lat: newYorkCoordinates.lat,
        lng: newYorkCoordinates.lng,
        zoom: 3
    });

    // 2. intercept input
    locations.callNode("map", "handleInput", {
        $submit: $mapBox.find('.trigger.submit'),
        $lat: $mapBox.find('.lat'),
        $lng: $mapBox.find('.lng'),
        callback: function(data) {

            // 3. add marker to map
            locations.getNode("map", "addMarker")({
                map: map,
                lat: data.lat,
                lng: data.lng
            });
        }
    });
});