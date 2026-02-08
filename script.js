const cityCoordinates = {
  accra: [
    [5.6037, -0.1870],
    [5.6090, -0.1900],
    [5.6100, -0.1800],
    [5.6000, -0.1950],
    [5.6050, -0.2000]
  ],
  kumasi: [
    [6.6885, -1.6244],
    [6.6900, -1.6200],
    [6.6850, -1.6300],
    [6.6800, -1.6250],
    [6.6870, -1.6280]
  ]
};

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

const apiKey = "7cb07fba41761d119e2030b279249734";

// Initialize map
const map = L.map('map').setView([6.7, -1.6], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let heat;
let currentMarkers = [];

// Mock temperature data
const mockData = {
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

// Fetch real temperature data with fallback
async function getCityTemperature(city) {
  const coordsList = cityCoordinates[city];
  const tempPoints = [];

  for (let coords of coordsList) {
    const [lat, lon] = coords;
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("API fetch failed");
      const data = await response.json();
      tempPoints.push([lat, lon, data.main.temp]);
    } catch (error) {
      console.warn("Using mock data for", city, coords);
      // fallback to mock
      const mockPoint = mockData[city].find(p => p[0] === lat && p[1] === lon);
      tempPoints.push(mockPoint);
    }
  }

  return tempPoints;
}

// Update city heatmap
async function updateCity(city) {
  const realData = await getCityTemperature(city);

  if (heat) heat.remove();

  heat = L.heatLayer(realData, {
    radius: 25,
    blur: 15,
    maxZoom: 17,
    gradient: {0.2:'blue',0.4:'lime',0.6:'orange',0.8:'red'}
  }).addTo(map);

  currentMarkers.forEach(m => map.removeLayer(m));
  currentMarkers = [];

  cityMarkers[city].forEach(loc => {
    const marker = L.marker(loc.coords).addTo(map).bindPopup(loc.name);
    currentMarkers.push(marker);
  });

  const bounds = L.latLngBounds(realData.map(p => [p[0], p[1]]));
  map.fitBounds(bounds, { padding: [50,50] });

  const hottest = realData.reduce((max, p) => p[2] > max[2] ? p : max, realData[0]);
  L.circleMarker([hottest[0], hottest[1]], { radius: 15, color: 'red' })
    .addTo(map)
    .bindPopup(`Hottest Spot: ${hottest[2]}°C`)
    .openPopup();
}

// City selector
const citySelect = document.getElementById("citySelect");
citySelect.addEventListener("change", () => updateCity(citySelect.value));

// Initial load
updateCity('accra');
