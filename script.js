// ---------------------------
// 1️⃣ Temperature Data
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
// 2️⃣ City Markers
// ---------------------------
const cityMarkers = {
  accra: [
    { coords: [5.6037, -0.1870], name: "Accra Central" },
    { coords: [5.6000, -0.1800], name: "Korle Bu" }
  ],
  kumasi: [
    { coords: [6.6885, -1.6244], name: "Kumasi Central" },
    { coords: [6.6900, -1.6200], name: "Kwame Nkrumah University" }
  ]
};

// ---------------------------
// 3️⃣ Map Initialization
// ---------------------------
const map = L.map('map').setView([6.7, -1.6], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Initialize heat layer
let heat;

// Keep track of markers
let currentMarkers = [];

// ---------------------------
// 4️⃣ Update City Function
// ---------------------------
function updateCity(city) {
  // Remove previous heat layer
  if (heat) heat.remove();

  // Add new heat layer
  heat = L.heatLayer(cityData[city], {
    radius: 25,
    blur: 15,
    maxZoom: 17,
    gradient: {0.2:'blue',0.4:'lime',0.6:'orange',0.8:'red'}
  }).addTo(map);

  // Remove old markers
  currentMarkers.forEach(m => map.removeLayer(m));
  currentMarkers = [];

  // Add new markers
  cityMarkers[city].forEach(loc => {
    const marker = L.marker(loc.coords).addTo(map).bindPopup(loc.name);
    currentMarkers.push(marker);
  });

  // Automatically zoom to hotspots
  const bounds = L.latLngBounds(cityData[city].map(p => [p[0], p[1]]));
  map.fitBounds(bounds, { padding: [50,50] });

  // Optional: Highlight hottest spot
  const hottest = cityData[city].reduce((max, p) => p[2] > max[2] ? p : max, cityData[city][0]);
  L.circleMarker([hottest[0], hottest[1]], { radius: 15, color: 'red' })
    .addTo(map)
    .bindPopup(`Hottest Spot: ${hottest[2]}°C`)
    .openPopup();
}

// ---------------------------
// 5️⃣ City Selector Event
// ---------------------------
const citySelect = document.getElementById("citySelect");

citySelect.addEventListener("change", () => {
  const selectedCity = citySelect.value;
  updateCity(selectedCity);
});

// ---------------------------
// 6️⃣ Initial Load
// ---------------------------
updateCity('accra');
