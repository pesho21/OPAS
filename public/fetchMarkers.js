async function fetchMarkers() {
  console.log('Fetching markers...');
  fetch('/markers')
    .then(response => response.json())
    .then(markers => {
      markers.forEach(marker => {
        displayMarkers(marker.latitude, marker.longitude, `<strong>Type:</strong> ${marker.pollutionType}<br><strong>Description:</strong> ${marker.description}<br><img src="${marker.photo}" width="200" height="200">`);
      });
    })
    .catch(error => console.error('Error fetching markers:', error));
}

window.addEventListener('load', fetchMarkers);