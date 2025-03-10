export async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "Eskan/1.0 (mahmoud.aboalela2786@gmail.com)",
        },
      }
    );
    const data = await response.json();
    if (data && data.address.village) {
      return data.address.village;
    }
    return "";
  } catch (error) {
    console.error("Reverse Geocoding error:", error);
    return "";
  }
}
