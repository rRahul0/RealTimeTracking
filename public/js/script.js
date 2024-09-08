const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
        const {latitude, longitude} = position.coords;
        socket.emit("send-location", {latitude, longitude});
    }, function(error) {
        alert(error.message);
    },{
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    }
    );
} else {
    console.log("Geolocation is not supported by this browser.");
}


const map = L.map('map').setView([0, 0], 15)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© Rahul Karmakar'
}).addTo(map);


const marker = {}

socket.on("receive-location", (coords) => {
    map.setView([coords.latitude, coords.longitude]);
    if (marker[coords.id]) {
        marker[coords.id].setLatLng([coords.latitude, coords.longitude]);
    } else {
        marker[coords.id] = L.marker([coords.latitude, coords.longitude]).addTo(map);
    }
});

socket.on("disconnect", (id) => {
    map.removeLayer(marker[id]);
    delete marker[id];
});