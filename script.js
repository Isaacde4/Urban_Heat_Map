// All major city coordinates in Ghana
const cityCoordinates = {
  accra: [[5.6037, -0.1870],[5.6090, -0.1900]],
  kumasi: [[6.6885, -1.6244],[6.6900, -1.6200]],
  tema: [[5.6690, 0.0166]],
  takoradi: [[4.8971, -1.7600]],
  cape_coast: [[5.1056, -1.2466]],
  tamale: [[9.4078, -0.8530]],
  bolgatanga: [[10.7878, -0.8500]],
  sunyani: [[7.3384, -2.3260]],
  techiman: [[7.5833, -1.9333]],
  ho: [[6.6000, 0.4700]]
};

// City markers
const cityMarkers = {
  accra: [{coords:[5.6037,-0.1870], name:"Accra Central"}],
  kumasi: [{coords:[6.6885,-1.6244], name:"Kumasi Central"}],
  tema: [{coords:[5.6690,0.0166], name:"Tema"}],
  takoradi: [{coords:[4.8971,-1.7600], name:"Takoradi"}],
  cape_coast: [{coords:[5.1056,-1.2466], name:"Cape Coast"}],
  tamale: [{coords:[9.4078,-0.8530], name:"Tamale"}],
  bolgatanga: [{coords:[10.7878,-0.8500], name:"Bolgatanga"}],
  sunyani: [{coords:[7.3384,-2.3260], name:"Sunyani"}],
  techiman: [{coords:[7.5833,-1.9333], name:"Techiman"}],
  ho: [{coords:[6.6000,0.4700], name:"Ho"}]
};

// Mock temperature data
const mockData = {
  accra: [[5.6037,-0.1870,32],[5.6090,-0.1900,33]],
  kumasi: [[6.6885,-1.6244,30],[6.6900,-1.6200,31]],
  tema: [[5.6690,0.0166,31]],
  takoradi: [[4.8971,-1.7600,30]],
  cape_coast: [[5.1056,-1.2466,29]],
  tamale: [[9.4078,-0.8530,28]],
  bolgatanga: [[10.7878,-0.8500,27]],
  sunyani: [[7.3384,-2.3260,29]],
  techiman: [[7.5833,-1.9333,30]],
  ho: [[6.6000,0.4700,28]]
};

// Initialize map
const map = L.map('map').setView([6.7, -1.6], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let heat;
let currentMarkers = [];

// Function to update city
function updateCity(city) {
  const realData = mockData[city];

  if (heat) heat.remove();

  heat = L.heatLayer(realData, {
    radius: 25,
    blur: 15,
    maxZoom: 17,
    gradient: {0.2:'blue',0.4:'lime',0.6:'orange',0.8:'red'}
  }).addTo(map);

  // Remove old markers
  currentMarkers.forEach(m => map.removeLayer(m));
  currentMarkers = [];

  // Add city markers
  cityMarkers[city].forEach(loc => {
    const marker = L.marker(loc.coords).addTo(map).bindPopup(loc.name);
    currentMarkers.push(marker);
  });

  // Auto zoom to bounds
  const bounds = L.latLngBounds(realData.map(p => [p[0], p[1]]));
  map.fitBounds(bounds, { padding: [50,50] });

  // Highlight hottest spot
  const hottest = realData.reduce((max,p) => p[2]>max[2]?p:max, realData[0]);
  L.circleMarker([hottest[0],hottest[1]], { radius:15, color:'red' })
    .addTo(map)
    .bindPopup(`Hottest Spot: ${hottest[2]}°C`)
    .openPopup();
}

// City selector
const citySelect = document.getElementById("citySelect");
citySelect.addEventListener("change", () => updateCity(citySelect.value));

// Initial load
updateCity('accra');
