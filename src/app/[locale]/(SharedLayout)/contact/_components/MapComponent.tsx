"use client";

import React, { useState } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";

const mapContainerStyle = {
  height: "100%",
  width: "100%",
  borderRadius: "16px",
};

const center = {
  lat: 24.7136,
  lng: 46.6753,
};

const locations = [
  {
    id: 1,
    name: "Main Office",
    position: { lat: 24.7136, lng: 46.6753 },
    popup: "Main Office - Contact Us",
  },
  {
    id: 2,
    name: "Branch Office 1",
    position: { lat: 24.7743, lng: 46.7382 },
    popup: "Branch Office 1 - Sales",
  },
  {
    id: 3,
    name: "Branch Office 2",
    position: { lat: 24.6537, lng: 46.7152 },
    popup: "Branch Office 2 - Support",
  },
];

const MapComponent: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  return (
    <div className="max-w-[1280px] w-full h-[300px] md:h-[400px] lg:h-[570px] rounded-[16px] mx-auto mt-24 px-4 xl:px-0">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={handleMapLoad}
          options={{ scrollwheel: true, disableDefaultUI: false }}
        >
          {mapLoaded &&
            locations.map(({ id, position, popup }) => (
              <MarkerF
                key={id}
                position={position}
                icon={{
                  url: "/assets/images/homehellers/hero.svg",
                  scaledSize: new window.google.maps.Size(40, 40),
                  anchor: new window.google.maps.Point(20, 40),
                }}
                title={popup}
              />
            ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
