// ==============================
// Urban Heat Map - Live Data JS
// ==============================

// Initialize map centered in Ghana
const map = L.map('ghanaMap').setView([6.5, -1.0], 6);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Keep track of heat layer and markers
let heat = null;
let currentMarkers = [];

// Cities we support
const cities = ["accra", "kumasi"];

// Convert city name to capitalized form
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to fetch data from Flask backend and update map
async function updateCity(city) {
    try {
        const response = await fetch("http://127.0.0.1:5000/temperature");
        const data = await response.json();

        if (!data[city] || !data[city].temp) {
            console.error("No temperature data for " + city);
            return;
        }

        const latLon = {
            "accra": [5.6037, -0.1870],
            "kumasi": [6.6885, -1.6244]
        };

        const temp = data[city].temp;

        // Remove existing heat layer if exists
        if (heat) heat.remove();

        // Add new heat layer
        heat = L.heatLayer([[latLon[city][0], latLon[city][1], temp]], {
            radius: 25,
            blur: 15,
            maxZoom: 17,
            gradient: {0.2:'blue',0.4:'lime',0.6:'orange',0.8:'red'}
        }).addTo(map);

        // Remove old markers
        currentMarkers.forEach(m => map.removeLayer(m));
        currentMarkers = [];

        // Add marker
        const marker = L.marker(latLon[city]).addTo(map)
            .bindPopup(`${capitalize(city)}: ${temp.toFixed(1)}°C`)
            .openPopup();
        currentMarkers.push(marker);

        // Zoom in
        map.setView(latLon[city], 10);

    } catch (error) {
        console.error("Error fetching temperature data:", error);
    }
}

// ==============================
// City selector dropdown logic
// ==============================

const select = document.getElementById("citySelect");

// Populate the dropdown dynamically
cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = capitalize(city);
    select.appendChild(option);
});

// When user selects a city, update map
select.addEventListener("change", () => {
    const city = select.value;
    updateCity(city);
});

// ==============================
// Initialize map with first city
// ==============================
updateCity(cities[0]);
