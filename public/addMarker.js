var map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 2,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var markers = [];
  var currentLocationMarker;
  var circle;

function addMarker(lat, lng, popupContent) {
    console.log(popupContent);
    // Create marker data object
    const markerData = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        pollutionType: popupContent[0],
        description: popupContent[1],
        photo: popupContent[2]
    };
    console.log(markerData);
    // Make POST request to /markers endpoint
    fetch('/markers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(markerData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add marker');
        }
        return response.json(); // Parse response JSON
    })
    .then(newMarker => {
        // Add marker to map
        var marker = L.marker([newMarker.latitude, newMarker.longitude]).addTo(map);
        if (popupContent) {
            marker.bindPopup(popupContent[0] + '<br>' + popupContent[1] + '<br><img src="' + popupContent[2] + '" width="200" height="200">');
        }
        markers.push(marker);
        updateCircleColor();
        console.log('Marker added successfully');
    })
    .catch(error => {
        console.error('Error adding marker:', error);
        alert('Failed to add marker');
    });
}
