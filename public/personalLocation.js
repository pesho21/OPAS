function addPersonalLocationMarker(lat, lng, popupContent, isPersonalLocation = false) {
  var markerIcon;

  if (isPersonalLocation) {
    markerIcon = L.icon({
      iconUrl: 'person_marker.png',
      iconSize: [130, 72],
      iconAnchor: [65, 72],
      popupAnchor: [0, -36],
      shadowSize: [41, 41]
    });
  } else {
    markerIcon = L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }

  var marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
  if (popupContent) {
    marker.bindPopup(popupContent);
  }
  markers.push(marker);
  updateCircleColor();
}

function updateCircleColor() {
  if (!circle) return;
  var clickedLocation = circle.getLatLng();
  var markersWithinRadius = 0;
  for (var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    var markerLocation = marker.getLatLng();
    var markerDistance = clickedLocation.distanceTo(markerLocation);
    if (markerDistance <= circle.getRadius()) {
      markersWithinRadius++;
    }
  }
  if (markersWithinRadius >= 5) {
    circle.setStyle({ color: 'red', fillColor: 'red' });
  } else if (markersWithinRadius >= 3) {
    circle.setStyle({ color: 'orange', fillColor: 'orange' });
  } else {
    circle.setStyle({ color: 'yellow', fillColor: 'yellow' });
  }
}

function getCurrentLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      addPersonalLocationMarker(lat, lng, "<strong>Your Current Location</strong>", true);
      map.setView([lat, lng], 16); 
      currentLocationMarker = L.latLng(lat, lng);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

getCurrentLocation();