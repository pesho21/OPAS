function openForm() {
  document.getElementById("overlay").style.display = "block";
}

map.on('click', function(e) {
  var lat = e.latlng.lat.toFixed(6);
  var lng = e.latlng.lng.toFixed(6);
  var clickedLocation = L.latLng(e.latlng.lat, e.latlng.lng);

  var distance = currentLocationMarker.distanceTo(clickedLocation);

  if (distance > 500) {
    alert("You can't add a marker further than 500 meters from your current location.");
    return;
  }

  var markersWithinRadius = 0;
  for (var i = 0; i < markers.length; i++) {
    var marker = markers[i];
    if (marker === currentLocationMarker) {
      continue; 
    }
    var markerLocation = marker.getLatLng();
    var markerDistance = clickedLocation.distanceTo(markerLocation);
    if (markerDistance <= 100) {
      markersWithinRadius++;
    }
  }

  console.log("Markers within radius: " + markersWithinRadius);
  var withinExistingCircle = false;
  for (var j = 0; j < markers.length; j++) {
    var existingMarker = markers[j];
    if (existingMarker instanceof L.Circle) {
      var existingCircleCenter = existingMarker.getLatLng();
      var existingCircleDistance = existingCircleCenter.distanceTo(clickedLocation);
      if (existingCircleDistance <= existingMarker.getRadius()) {
        withinExistingCircle = true;
        break;
      }
    }
  }

  if (!withinExistingCircle) {
    var circleColor;
    if (markersWithinRadius >= 6) {
      circleColor = 'red';
    } else if (markersWithinRadius >= 4) {
      circleColor = 'orange';
    } else if (markersWithinRadius >= 2) {
      circleColor = 'yellow';
    }

    if (circleColor) {
      var newCircle = L.circle(clickedLocation, {
        radius: 500,
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 0.2
      }).addTo(map);
      markers.push(newCircle);
      console.log("New circle added with color: " + circleColor); 
    }
  }

  for (var k = 0; k < markers.length; k++) {
    var circle = markers[k];
    if (circle instanceof L.Circle) {
      updateCircleColor(circle);
    }
  }

  openForm();
  document.getElementById('pollutionType').value = '';
  document.getElementById('description').value = '';
  document.getElementById('photo').value = '';
  document.getElementById('markerForm').onsubmit = function(event) {
    event.preventDefault();

    var pollutionType = document.getElementById('pollutionType').value;
    var description = document.getElementById('description').value;
    var photo = document.getElementById('photo').files[0];
    if (pollutionType && description && photo) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          var maxWidth = 200;
          var maxHeight = 200;
          var width = img.width;
          var height = img.height;
          if (width > maxWidth || height > maxHeight) {
            var ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          var popupContent = [pollutionType, description, e.target.result];
          addMarker(lat, lng, popupContent);
           alert('Marker added successfully');
          document.getElementById('markerForm').style.display = 'none';
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(photo);
    } else {
      alert("Please provide valid information.");
    }
  };
});

function updateCircleColor(circle) {
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
  if (markersWithinRadius >= 8) {
    circle.setStyle({ color: 'red', fillColor: 'red' });
  } else if (markersWithinRadius >= 6) {
    circle.setStyle({ color: 'orange', fillColor: 'orange' });
  } else if (markersWithinRadius >= 4) {
    circle.setStyle({ color: 'yellow', fillColor: 'yellow' });
  } else if (markersWithinRadius >= 2) {
    circle.setStyle({ color: 'yellow', fillColor: 'yellow' });
  }
}
