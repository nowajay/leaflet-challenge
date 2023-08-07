// Geojson link to data
let URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'


// Loop and log data.
d3.json(URL).then(function(data){
    createFeatures(data.features),
    console.log(data)
});

// Function for color of circles 
function depthColor(depth) {
    if (depth >= 90) return "#ff3300";
    else if (depth >= 70) return "#ff6600";
    else if (depth >= 50) return "#ff9900";
    else if (depth >= 30) return "#ffd633";
    else if (depth >= 10) return "#ccff66";
    else return "#66ff66";
};
    
// Pull data into functions
function createFeatures (earthquakeInfo) {

    //function for pop ups 
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
      };

    // Circle markers funcition
    function createCircleMarker(feature, latlng){
    let options = {
        radius:feature.properties.mag*5,
        fillColor: depthColor(feature.geometry.coordinates[2]),
        color: "black",
        weight: 1,
        opacity: 0.75,
        fillOpacity: 0.75
        } 
        return L.circleMarker(latlng,options);
    }

    //Geojson layer with markers 
    let earthquakes = L.geoJson(earthquakeInfo, {
        onEachFeature: onEachFeature, pointToLayer: createCircleMarker
    });

    createMap(earthquakes);
}

// Plot markers based on data with leaflet
function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create the map, giving it the streetmap and earthquakes layers.
    let myMap = L.map("map", {
      center: [
        38.450, -96.5795
      ],
      zoom: 4.5,
      layers: [street, earthquakes]
    });

    // Create a layer control.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    };