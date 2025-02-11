// Initialize the map
let map;
let userLocation;

function initMap() {
    if (navigator.geolocation) {
        // Get user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Log the accurate location to the console
                console.log("Accurate Location:", position.coords);

                // Store user's location coordinates
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Initialize the map centered at the user's location
                map = new google.maps.Map(document.getElementById("map"), {
                    center: userLocation,
                    zoom: 15 // Zoom level for better detail
                });

                // Add a blue marker at the user's location
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "You are here",
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Blue marker icon
                });

                // Find nearby hospitals
                findNearbyHospitals(map, userLocation);
            },
            (error) => {
                console.error("Geolocation Error:", error);
                alert("Failed to get location. Ensure GPS is enabled.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Function to search and display nearby hospitals using the Google Places API
function findNearbyHospitals(map, location) {
    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch(
        {
            location: location,
            radius: 5000, // Search within 5 km radius
            type: "hospital" // Search for hospitals only
        },
        (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // For each hospital found, add a red marker to the map
                results.forEach((place) => {
                    new google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        title: place.name,
                        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // Red marker icon for hospitals
                    });
                });
            } else {
                console.error("Error fetching hospitals:", status);
            }
        }
    );
}
