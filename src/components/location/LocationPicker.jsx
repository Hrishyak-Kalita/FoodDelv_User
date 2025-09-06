import { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

function LocationPicker({ onLocationSelect }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
    onLocationSelect({ lat, lng }); // send back to parent
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={{ lat: 26.75, lng: 92.79 }} // default center
        zoom={13}
        onClick={handleMapClick}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
      </GoogleMap>
    </LoadScript>
  );
}

export default LocationPicker;
