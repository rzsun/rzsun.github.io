/*
 * globals
 */
var map;
var infowindow = new google.maps.InfoWindow({maxWidth: 800});
var places = [];
var markerToIndex = {};
var curIndex = -1;

function initializeMap() {
    var mapOptions = {
        center: new google.maps.LatLng(51.50, -0.113358),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapTheme,
        disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

    drawEvents(placesPath);
}

function drawEvents(filePath) {
    $.getJSON(filePath, function(eventJSON) {
        for (var i = 0; i < eventJSON.length; i++) {
            function addMarker(place) {
                var contentString = '<div style=\'font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif;\'><h2>' + place.name + '</h2>';
                if(place.picture_path != null)
                    contentString = contentString + '<img src=\'/assets/europe-pt1-london/img/' + place.picture_path + '\' \n\ style=\'max-width:100%;max-height:500px;\'>';
                contentString = contentString + '<p style=\'font-size:1rem;\'>' + place.description + '</p></div>';
                
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(place.lat, place.lng),
                    map: map,
                    title: place.name,
                    draggable: false,
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.setContent(contentString);
                    infowindow.open(window.map, marker);
                    //pan to center to marker then pan down to center infowindow
                    //map.panTo(marker.getPosition());
                    //map.panBy(0, 0);
                    curIndex = markerToIndex[marker.getTitle()];
                });
                markerToIndex[marker.getTitle()] = i;

                placeObj = place;
                placeObj.marker = marker;
                placeObj.contentString = contentString;
                places[places.length] = placeObj;
            }
            addMarker(eventJSON[i]);
        }
    });
}

function next() {
    curIndex = (curIndex + 1) % places.length;
    infowindow.setContent(places[curIndex].contentString);
    infowindow.open(window.map, places[curIndex].marker);
    //pan to center to marker then pan down to center infowindow
    //map.panTo(places[curIndex].marker.getPosition());
}

function prev() {
    curIndex = (curIndex - 1) % places.length;
    infowindow.setContent(places[curIndex].contentString);
    infowindow.open(window.map, places[curIndex].marker);
    //pan to center to marker then pan down to center infowindow
    //map.panTo(places[curIndex].marker.getPosition());
}

google.maps.event.addDomListener(window, 'load', initializeMap);

$( "#next" ).click(next);
$( "#prev" ).click(prev);


