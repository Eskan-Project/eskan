import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

// Configure Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Cache for geocoding results
const geocodeCache = {};

/**
 * Initialize a map in the specified container
 * @param {string} containerId - The ID of the DOM element to contain the map
 * @param {Object} coordinates - The starting coordinates {lat, lng}
 * @param {Object} options - Additional map options
 * @returns {Object} - Map and marker objects
 */
export function initializeMap(containerId, coordinates, options = {}) {
  const mapOptions = { scrollWheelZoom: false, ...options };
  const map = L.map(containerId, mapOptions).setView(
    [coordinates.lat, coordinates.lng],
    13
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const marker = L.marker([coordinates.lat, coordinates.lng], {
    draggable: true,
  }).addTo(map);

  return { map, marker };
}

/**
 * Initialize a map with popup for locations like contact page
 * @param {string} containerId - The ID of the DOM element to contain the map
 * @param {Object} coordinates - The starting coordinates {lat, lng}
 * @param {string} popupContent - HTML content for the popup
 * @param {Object} options - Additional map options
 * @returns {Object} - Map and marker objects
 */
export function initializeMapWithPopup(
  containerId,
  coordinates,
  popupContent,
  options = {}
) {
  const mapOptions = { scrollWheelZoom: false, ...options };
  const map = L.map(containerId, mapOptions).setView(
    [coordinates.lat, coordinates.lng],
    13
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const marker = L.marker([coordinates.lat, coordinates.lng])
    .addTo(map)
    .bindPopup(popupContent)
    .openPopup();

  return { map, marker };
}

/**
 * Initialize a map with advanced options for property detail views
 * @param {string} containerId - The ID of the DOM element to contain the map
 * @param {Object} coordinates - The starting coordinates {lat, lng}
 * @param {string} title - Title for the popup
 * @param {string} locationText - Location text for the popup
 * @param {string} markerColor - Color for the marker
 * @returns {Object} - Map instance and marker
 */
export function initializePropertyMap(
  containerId,
  coordinates,
  title,
  locationText,
  markerColor = "red"
) {
  // Create map with optimization options
  const map = L.map(containerId, {
    scrollWheelZoom: false,
    fadeAnimation: false,
    zoomAnimation: false,
    markerZoomAnimation: false,
  }).setView([coordinates.lat, coordinates.lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const marker = L.marker([coordinates.lat, coordinates.lng], {
    icon: getCustomIcon(markerColor),
  })
    .addTo(map)
    .bindPopup(`<b>${title || "Unknown Property"}</b><br>${locationText}`);

  marker.openPopup();

  // Add pulse animation to the marker if needed
  if (marker._icon) {
    marker._icon.classList.add("map-marker-pulse");
  }

  return { map, marker };
}

/**
 * Get custom icon for map markers
 * @param {string} color - Color for the marker (e.g., "red", "blue")
 * @returns {Object} - Leaflet Icon object
 */
export function getCustomIcon(color) {
  return L.icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

/**
 * Update marker position on the map
 * @param {Object} map - The Leaflet map object
 * @param {Object} marker - The Leaflet marker object
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
export function updateMarkerPosition(map, marker, lat, lng) {
  marker.setLatLng([lat, lng]);
  map.setView([lat, lng], 13);
}

/**
 * Get user's current geolocation
 * @returns {Promise} - Resolves with coordinates {lat, lng}
 */
export function getUserGeolocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      reject(new Error("Geolocation is not supported by your browser."));
    }
  });
}

/**
 * Geocode a location text to coordinates
 * @param {string} locationText - The location text to geocode
 * @returns {Promise} - Resolves with coordinates {lat, lon}
 */
export async function geocodeLocation(locationText) {
  // Check if result is already in cache
  if (geocodeCache[locationText]) {
    console.log("Using cached geocode result for:", locationText);
    return geocodeCache[locationText];
  }

  console.log("Geocoding location:", locationText);
  const locationParts = locationText.split("-");
  const filteredLocation = locationParts.slice(0, 2).join(" ");
  const query = encodeURIComponent(filteredLocation);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
    );
    const data = await response.json();
    const result = data.length > 0 ? data[0] : null;

    // Cache the result
    geocodeCache[locationText] = result;

    return result;
  } catch (error) {
    console.error("Geocoding fetch error:", error);
    return null;
  }
}
