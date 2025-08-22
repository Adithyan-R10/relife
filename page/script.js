let map;

async function initMap() {
    map = new google.maps.Map(document.querySelector(".MAP"), {
        center: { lat: 9.9312, lng: 76.2673 },
        zoom: 8,
    });

    const res = await fetch('/shelter');
    const shelters = await res.json();

    shelters.forEach(shelter => {
        new google.maps.Marker({
            position: { lat: shelter.latitude, lng: shelter.longitude },
            map,
            title: shelter.name,
        });
    });
}

function setupSearchBox() {
    const input = document.querySelector(".input");
    const searchBox = new google.maps.places.SearchBox(input);

    // Bias search results towards map's viewport
    map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
    });

    searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
            if (!place.geometry || !place.geometry.location) return;

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        map.fitBounds(bounds);
    });
}
