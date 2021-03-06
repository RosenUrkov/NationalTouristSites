/* globals google $ toastr */
function initMap() {
    const cords = $('#landmarkTitle').text();
    const longitude = Number($('#cordslong').attr('data-lon'));
    const latitude = Number($('#cordslat').attr('data-lat'));

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 9,
        center: { lat: latitude, lng: longitude },
    });

    const geocoder = new google.maps.Geocoder();
    setTimeout((x) => {
        geocodeAddress(geocoder, map);
    }, 300);
}

function geocodeAddress(geocoder, resultsMap) {
    const address = document.getElementById('address').value;

    geocoder.geocode({ 'address': address }, (results, status) => {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);

            const marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                // Animation can be DROP,BOUNCE,no,po
                animation: google.maps.Animation.BOUNCE,
            });
        } else {
            toastr.error('Map loading failed!');
        }
    });
}
