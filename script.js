// ---------------------------
// 1️⃣ Temperature Data for Cities
// ---------------------------

const cityData = {
    accra: [
        [5.6037, -0.1870, 32],
        [5.6090, -0.1900, 33],
        [5.6100, -0.1800, 31],
        [5.6000, -0.1950, 34],
        [5.6050, -0.2000, 32]
    ],
    kumasi: [
        [6.6885, -1.6244, 30],
        [6.6900, -1.6200, 31],
        [6.6850, -1.6300, 29],
        [6.6800, -1.6250, 32],
        [6.6870, -1.6280, 30]
    ]
};

// ---------------------------
// 2️⃣ Map Initialization
// ---------------------------

const map = L.map('map').setView([6.7, -1.6], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Initialize heat layer for Accra
let heat = L.heatLayer(cityData['accra'], {
    radius: 25,
    blur: 15,
    maxZoom: 17,
    gradient: {0.2: 'blue', 0.4: 'lime', 0.6: 'orange', 0.8: 'red'}
}).addTo(map);

// ---------------------------
// 3️⃣ City Selector Event
// ---------------------------

const citySelect = document.getElementById("citySelect");

citySelect.addEventListener("change", () => {
    const selectedCity = citySelect.value;

    // Remove existing heat layer
    heat.remove();

    // Add new heat layer
    heat = L.heatLayer(cityData[selectedCity], {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {0.2: 'blue', 0.4: 'lime', 0.6: 'orange', 0.8: 'red'}
    }).addTo(map);

    // Center map to the selected city
    const coords = selectedCity === 'accra' ? [5.6037, -0.1870] : [6.6885, -1.6244];
    map.setView(coords, 12);
});
