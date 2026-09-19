"use client";

import React, { useEffect, useRef, useState } from "react";
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

function LoadedMap() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={() => setMapLoaded(true)}
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
  );
}

const MapComponent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mx-auto mt-12 h-[240px] w-full max-w-[1280px] overflow-hidden rounded-3xl px-4 shadow-[0_16px_40px_rgba(20,48,135,0.08)] md:mt-16 md:h-[360px] lg:h-[480px] xl:px-0"
    >
      {visible ? (
        <LoadedMap />
      ) : (
        <div
          className="h-full w-full rounded-[16px] bg-white"
          aria-hidden
        />
      )}
    </div>
  );
};

export default MapComponent;
