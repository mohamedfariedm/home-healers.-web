"use client";
import { useState, useRef, useEffect } from "react";
import { X, Search, MapPin, Save } from "lucide-react";
import type { Location } from "@/types/booking";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  savedLocations: Location[];
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSave,
  savedLocations,
}: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    title: "الرياض - السعودية",
    address: "السعودية - الرياض - شارع الأمير محمد بن سلمان",
    latitude: 24.7136,
    longitude: 46.6753,
  });
  const [showSavedLocations, setShowSavedLocations] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    if (isOpen && !showSavedLocations) {
      loadGoogleMapsScript();
    }
  }, [isOpen, showSavedLocations]);

  const loadGoogleMapsScript = () => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places&language=ar`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsMapLoaded(true);
      initializeMap();
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    const riyadhCoords = { lat: 24.7136, lng: 46.6753 };

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: riyadhCoords,
      zoom: 12,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ color: "#f5f5f5" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
      ],
    });

    markerInstance.current = new window.google.maps.Marker({
      position: riyadhCoords,
      map: mapInstance.current,
      draggable: true,
      title: "الموقع المحدد",
    });

    // Handle map clicks
    mapInstance.current.addListener("click", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      markerInstance.current.setPosition({ lat, lng });

      // Reverse geocoding
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: any) => {
          if (status === "OK" && results[0]) {
            setSelectedLocation({
              title: "الموقع المحدد",
              address: results[0].formatted_address,
              latitude: lat,
              longitude: lng,
            });
          }
        }
      );
    });

    // Handle marker drag
    markerInstance.current.addListener("dragend", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: any) => {
          if (status === "OK" && results[0]) {
            setSelectedLocation({
              title: "الموقع المحدد",
              address: results[0].formatted_address,
              latitude: lat,
              longitude: lng,
            });
          }
        }
      );
    });
  };

  const handleSearch = () => {
    if (!window.google || !searchQuery.trim()) return;

    const service = new window.google.maps.places.PlacesService(
      mapInstance.current
    );
    const request = {
      query: searchQuery,
      fields: ["name", "geometry", "formatted_address"],
    };

    service.textSearch(request, (results: any, status: any) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results[0]
      ) {
        const place = results[0];
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();

        mapInstance.current.setCenter(location);
        markerInstance.current.setPosition(location);

        setSelectedLocation({
          title: place.name || "الموقع المحدد",
          address: place.formatted_address || "",
          latitude: lat,
          longitude: lng,
        });
      }
    });
  };

  const handleSaveLocation = () => {
    onSave(selectedLocation);
    onClose();
  };

  const handleSelectSavedLocation = (location: Location) => {
    setSelectedLocation(location);
    if (
      mapInstance.current &&
      markerInstance.current &&
      location.latitude &&
      location.longitude
    ) {
      const position = { lat: location.latitude, lng: location.longitude };
      mapInstance.current.setCenter(position);
      markerInstance.current.setPosition(position);
    }
    setShowSavedLocations(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1e1e1e]">
            {showSavedLocations ? "المواقع المحفوظة" : "اختيار الموقع"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!showSavedLocations ? (
          <div className="flex flex-col h-[80vh]">
            {/* Search Bar */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-300 p-4">
                <button
                  onClick={handleSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Search className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="ابحث عن موقع أو اكتب العنوان..."
                  className="flex-1 text-right text-sm bg-transparent border-none outline-none"
                />
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              <div ref={mapRef} className="w-full h-full" />
              {!isMapLoaded && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62a0f6] mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">
                      جاري تحميل الخريطة...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Location Info & Actions */}
            <div className="p-6 pt-4 border-t border-gray-200">
              <div className="mb-6">
                <div className="flex items-center gap-2 bg-[#eff6fe] rounded-t-xl px-4 py-3 w-fit">
                  <MapPin className="w-5 h-5 text-[#62a0f6]" />
                  <span className="text-base font-bold text-[#62a0f6]">
                    الموقع المختار
                  </span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  <div className="flex justify-between items-start">
                    <button
                      onClick={handleSaveLocation}
                      className="flex items-center gap-2 bg-[#62a0f6] text-white px-4 py-2 rounded-lg hover:bg-[#5090e6] transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      حفظ واختيار
                    </button>
                    <div className="text-right">
                      <h3 className="text-base font-semibold text-[#1e1e1e] mb-1">
                        {selectedLocation.title}
                      </h3>
                      <p className="text-sm text-[#1e1e1e]">
                        {selectedLocation.address}
                      </p>
                      {selectedLocation.latitude &&
                        selectedLocation.longitude && (
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedLocation.latitude.toFixed(6)},{" "}
                            {selectedLocation.longitude.toFixed(6)}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSavedLocations(true)}
                  className="flex-1 bg-[#e8eaf3] text-[#143087] py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#d5d9e8] transition-colors"
                >
                  عرض المواقع المحفوظة ({savedLocations.length})
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Saved Locations List */}
            <div className="space-y-4">
              {savedLocations.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد مواقع محفوظة</p>
                  <button
                    onClick={() => setShowSavedLocations(false)}
                    className="mt-4 text-[#62a0f6] hover:underline"
                  >
                    إضافة موقع جديد
                  </button>
                </div>
              ) : (
                savedLocations.map((location) => (
                  <div
                    key={location.id}
                    className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:border-[#62a0f6] transition-colors"
                  >
                    <div className="flex-1 text-right">
                      <h3 className="font-semibold text-[#1e1e1e] mb-1">
                        {location.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {location.address}
                      </p>
                      {location.latitude && location.longitude && (
                        <p className="text-xs text-gray-400 mt-1">
                          {location.latitude.toFixed(4)},{" "}
                          {location.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleSelectSavedLocation(location)}
                      className="bg-[#62a0f6] text-white px-4 py-2 rounded-lg hover:bg-[#5090e6] transition-colors"
                    >
                      اختيار
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Back Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowSavedLocations(false)}
                className="w-full bg-[#143087] text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#0f2470] transition-colors"
              >
                العودة للخريطة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
