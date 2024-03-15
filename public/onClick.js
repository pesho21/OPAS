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
      var markerLocation = marker.getLatLng();
      var markerDistance = clickedLocation.distanceTo(markerLocation);
      if (markerDistance <= 100) {
        markersWithinRadius++;
      }
    }

    if (markersWithinRadius >= 5) {
      if (!circle) {
        circle = L.circle(clickedLocation, {
          radius: 500,
          color: 'red',
          fillColor: 'red',
          fillOpacity: 0.2
        }).addTo(map);
      }
    } else if (markersWithinRadius >= 3) {
      if (!circle) {
        circle = L.circle(clickedLocation, {
          radius: 500,
          color: 'orange',
          fillColor: 'orange',
          fillOpacity: 0.2
        }).addTo(map);
      }
    } else if (markersWithinRadius >= 1) {
      if (!circle) {
        circle = L.circle(clickedLocation, {
          radius: 500,
          color: 'yellow',
          fillColor: 'yellow',
          fillOpacity: 0.2
        }).addTo(map);
      }
    }

    document.getElementById('pollutionType').value = '';
    document.getElementById('description').value = '';
    document.getElementById('photo').value = '';
    document.getElementById('markerForm').style.display = 'block';
    document.getElementById('markerForm').style.left = e.containerPoint.x + 'px';
    document.getElementById('markerForm').style.top = e.containerPoint.y + 'px';
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