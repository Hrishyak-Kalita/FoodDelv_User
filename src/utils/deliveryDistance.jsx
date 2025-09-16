// utils/deliveryDistance.js
export async function getCoordinatesFromAddress(address) {
  try {
    const apiKey = import.meta.env.VITE_LOCATIONIQ_KEY;
    const response = await fetch(
      `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(
        address
      )}&format=json&limit=1`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch coordinates from LocationIQ");
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("No results found");
    }

    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch (err) {
    console.error("getCoordinatesFromAddress error:", err.message);
    return { lat: null, lng: null };
  }
}

export function calculateDistanceInKm(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function calculateDeliveryCharge(distanceInKm) {
  const baseCharge = 20; // ₹20 flat fee
  const perKmCharge = 8; // ₹8 per km

  return baseCharge + distanceInKm * perKmCharge;
}
