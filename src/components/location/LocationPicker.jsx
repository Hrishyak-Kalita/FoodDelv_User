import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function LocationPicker({ onLocationSelect }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [center, setCenter] = useState({ lat: 26.75, lng: 92.79 }); // Default center

  // Attempt to get user location automatically
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          setSelectedLocation(userLocation);
          onLocationSelect(userLocation);
        },
        (error) => {
          console.warn("Geolocation not allowed or failed:", error);
          // Keep default center
        }
      );
    }
  }, [onLocationSelect]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newLocation = { lat, lng };
    setSelectedLocation(newLocation);
    onLocationSelect(newLocation);
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={center}
        zoom={13}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </LoadScript>
  );
}

export default LocationPicker;
