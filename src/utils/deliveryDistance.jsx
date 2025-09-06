import axios from "axios";

export async function getDistanceAndETA(userLoc, restaurantLoc) {
  const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${restaurantLoc.lat},${restaurantLoc.lng}&destinations=${userLoc.lat},${userLoc.lng}&key=${API_KEY}`;

  const res = await axios.get(url);
  const data = res.data.rows[0].elements[0];

  return {
    distanceKm: data.distance.value / 1000, // meters → km
    etaMinutes: Math.ceil(data.duration.value / 60)
  };
}

export function calculateDeliveryCharge(distanceKm) {
  const baseCharge = 50;
  if (distanceKm <= 3) return baseCharge;
  return baseCharge + (distanceKm - 3) * 12; // ₹12/km after 3 km
}
