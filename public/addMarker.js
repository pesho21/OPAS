var map = L.map('map').setView([0, 0], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 2,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.Control.geocoder().addTo(map);
  var markers = [];
  var currentLocationMarker;
  var circle;

function addMarker(lat, lng, popupContent) {
            fetch('/markers', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    latitude: lat,
                    longitude: lng,
                    pollutionType: popupContent[0],
                    description: popupContent[1],
                    photo: popupContent[2]
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add marker');
                }
                location.reload();
                return response.json();
            })
         return response.json(); 
        }
    

function displayMarkers(lat, lng, popupContent) {
    var marker = L.marker([lat, lng]).addTo(map);
    if (popupContent) {
      marker.bindPopup(popupContent);
    }
    markers.push(marker);
    updateCircleColor();
}