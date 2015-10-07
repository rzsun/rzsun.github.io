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
        center: new google.maps.LatLng(centerLat, centerLng),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: mapTheme,
        disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

    drawEvents(assetsPath);
}

function drawEvents(filePath) {
    $.getJSON(filePath + "places.json", function(eventJSON) {
        for (var i = 0; i < eventJSON.length; i++) {
            function addMarker(place) {
                var contentString = '<div class="infowindow"><h2 class="infotitle"><a href="#" id="prev">&#10094;</a>' + place.name + '<a href="#" id="next">&#10095;</a></h2>';
                if(place.picture_path != null)
                    contentString = contentString + '<img src=\'' + filePath + 'img/' + place.picture_path + '\' \n\ style=\'max-width:100%;max-height:500px;margin:0\'>';
                contentString = contentString + '<p style=\'font-size:1rem;margin:0\'>' + place.description + '</p></div>';
                
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
                    map.panTo(marker.getPosition());
                    map.panBy(0, -160);
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
    map.panTo(places[curIndex].marker.getPosition());
    map.panBy(0, -160);
}

function prev() {
    curIndex = (curIndex - 1) % places.length;
    infowindow.setContent(places[curIndex].contentString);
    infowindow.open(window.map, places[curIndex].marker);
    //pan to center to marker then pan down to center infowindow
    map.panTo(places[curIndex].marker.getPosition());
    map.panBy(0, -160);
}

google.maps.event.addDomListener(window, 'load', initializeMap);

$(document).on('click', '#next', next);
$(document).on('click', '#prev', prev);

