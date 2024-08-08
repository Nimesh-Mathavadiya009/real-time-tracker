const socket = io()

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords
            socket.emit("send-location",{latitude,longitude})
    }, (error) => {
        console.log(error.message)
    },
    {
            enableHighAccuracy: true,
            timeout: 4000,
            maximumAge: 0
    })
}
 
 const map = L.map("map").setView([0,0], 10)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map)

const markers = {}

socket.on("receive-location", (data) => {
        const {id, latitude, longitude} = data;
        map.setView([latitude,longitude], 10);
        if(markers[id]){
            markers[id].setLatLng([latitude,longitude])
        }
        else{
            markers[id] = L.marker([latitude,longitude]).addTo(map)
        }
})

socket.on("user-disconnect", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})