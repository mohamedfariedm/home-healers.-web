"use client";
import { useState, useRef, useEffect } from "react";
import { X, Search, MapPin, Save, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Location } from "@/types/booking";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location & {
    address_city?: string;
    address_state?: string;
    address_link?: string;
  }) => void;
  savedLocations: Location[];
  updateSavedLocations: (locations: Location[]) => void;
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSave,
  savedLocations,
  updateSavedLocations,
}: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    savedLocations.length > 0 ? savedLocations[0] : null
  );
  const [showSavedLocations, setShowSavedLocations] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<number | null>(
    null
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
  });
  const [formError, setFormError] = useState("");

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && isOpen && !showSavedLocations && !showForm) {
      loadGoogleMapsScript();
    }
  }, [isOpen, showSavedLocations, showForm]);

  useEffect(() => {
    if (!isOpen || !window.google || !mapRef.current || showForm) return;
    initializeMap();
    return () => {
      if (markerInstance.current) {
        window.google.maps.event.clearInstanceListeners(markerInstance.current);
        markerInstance.current.setMap(null);
      }
      if (mapInstance.current) {
        window.google.maps.event.clearInstanceListeners(mapInstance.current);
      }
    };
  }, [isOpen, showForm]);

  const loadGoogleMapsScript = () => {
    if (window.google || document.getElementById("google-maps-script")) {
      initializeMap();
      return;
    }
    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places&language=ar`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsMapLoaded(true);
      initializeMap();
    };
    document.head.appendChild(script);
  };

  const extractAddressParts = (components: any[], lat: number, lng: number) => {
    const city =
      components.find((c) => c.types.includes("locality"))?.long_name ||
      "غير محدد";
    const state =
      components.find((c) =>
        c.types.includes("administrative_area_level_1")
      )?.long_name || "غير محدد";
    const country =
      components.find((c) => c.types.includes("country"))?.long_name ||
      "غير محدد";
    const link = `https://www.google.com/maps?q=${lat},${lng}`;
    return { city, state, country, link };
  };

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;
    const centerCoords =
      selectedLocation?.latitude && selectedLocation?.longitude
        ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
        : { lat: 24.7136, lng: 46.6753 };

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: centerCoords,
      zoom: 12,
    });

    markerInstance.current = new window.google.maps.Marker({
      position: centerCoords,
      map: mapInstance.current,
      draggable: true,
      title: "الموقع المحدد",
    });

    const geocoder = new window.google.maps.Geocoder();

    // Handle map click
    mapInstance.current.addListener("click", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      markerInstance.current.setPosition({ lat, lng });
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === "OK" && results[0]) {
          const { city, state, country, link } = extractAddressParts(
            results[0].address_components,
            lat,
            lng
          );
          setSelectedLocation({
            id: Date.now(),
            title: results[0].name || "الموقع المحدد",
            address: results[0].formatted_address,
            city,
            state,
            country,
            latitude: lat,
            longitude: lng,
            link,
          });
        }
      });
    });

    // Handle marker drag
    markerInstance.current.addListener("dragend", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === "OK" && results[0]) {
          const { city, state, country, link } = extractAddressParts(
            results[0].address_components,
            lat,
            lng
          );
          setSelectedLocation({
            id: Date.now(),
            title: results[0].name || "الموقع المحدد",
            address: results[0].formatted_address,
            city,
            state,
            country,
            latitude: lat,
            longitude: lng,
            link,
          });
        }
      });
    });
  };

  const handleSearch = () => {
    if (!window.google || !searchQuery.trim()) {
      toast.error("يرجى إدخال عنوان للبحث");
      return;
    }
    const service = new window.google.maps.places.PlacesService(
      mapInstance.current
    );
    const request = {
      query: searchQuery,
      fields: ["name", "geometry", "formatted_address", "address_components"],
    };
    service.textSearch(request, (results: any, status: any) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results[0]
      ) {
        const place = results[0];
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const { city, state, country, link } = extractAddressParts(
          place.address_components,
          lat,
          lng
        );
        mapInstance.current.setCenter({ lat, lng });
        markerInstance.current.setPosition({ lat, lng });
        setSelectedLocation({
          id: Date.now(),
          title: place.name || "الموقع المحدد",
          address: place.formatted_address || "",
          city,
          state,
          country,
          latitude: lat,
          longitude: lng,
          link,
        });
      } else toast.error("لم يتم العثور على الموقع");
    });
  };

  const handleSaveLocation = () => {
    if (showForm) {
      if (
        !formData.title.trim() ||
        !formData.address.trim() ||
        !formData.city.trim() ||
        !formData.country.trim()
      ) {
        setFormError("يرجى ملء جميع الحقول المطلوبة");
        return;
      }
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      const link =
        !isNaN(lat) && !isNaN(lng)
          ? `https://www.google.com/maps?q=${lat},${lng}`
          : "";

      const location: Location = {
        id: isEditing && editingLocationId ? editingLocationId : Date.now(),
        title: formData.title,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        latitude: lat || undefined,
        longitude: lng || undefined,
        link,
      };

      if (isEditing && editingLocationId) {
        const updated = savedLocations.map((loc) =>
          loc.id === editingLocationId ? location : loc
        );
        updateSavedLocations(updated);
        setSelectedLocation(location);
        toast.success("تم تعديل الموقع بنجاح");
      } else {
        onSave({
          ...location,
          address_city: location.city,
          address_state: location.state,
          address_link: location.link,
        });
        setSelectedLocation(location);
        toast.success("تم حفظ الموقع بنجاح");
      }
      setFormData({
        title: "",
        address: "",
        city: "",
        state: "",
        country: "",
        latitude: "",
        longitude: "",
      });
      setFormError("");
      setIsEditing(false);
      setEditingLocationId(null);
    } else if (selectedLocation) {
      onSave({
        ...selectedLocation,
        address_city: selectedLocation.city,
        address_state: selectedLocation.state,
        address_link: selectedLocation.link,
      });
      toast.success("تم حفظ الموقع بنجاح");
    } else {
      toast.error("يرجى اختيار موقع أولاً");
      return;
    }
    setShowForm(false);
    onClose();
  };

  // Sync map when lat/lng typed manually
  useEffect(() => {
    if (!mapInstance.current || !markerInstance.current) return;
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      const position = { lat, lng };
      mapInstance.current.setCenter(position);
      markerInstance.current.setPosition(position);
    }
  }, [formData.latitude, formData.longitude]);

  const handleFormChange = (
    field:
      | "title"
      | "address"
      | "city"
      | "state"
      | "country"
      | "latitude"
      | "longitude",
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError("");
  };

  if (!isOpen) return null;

  // --- UI ---
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 overflow-y-auto" dir="rtl">
      <div className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1e1e1e]">
            {showSavedLocations
              ? "المواقع المحفوظة"
              : showForm
              ? isEditing
                ? "تعديل الموقع"
                : "إدخال موقع يدويًا"
              : "اختيار الموقع"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* manual form */}
        {showForm ? (
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-6">
              {["title","country","state","city"].map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#1e1e1e]">
                    {field === "title"
                      ? "عنوان الموقع"
                      : field === "country"
                      ? "الدولة"
                      : field === "state"
                      ? "المنطقة / الولاية"
                      : "المدينة"}
                  </label>
                  <input
                    type="text"
                    value={(formData as any)[field]}
                    onChange={(e) =>
                      handleFormChange(field as any, e.target.value)
                    }
                    placeholder={
                      field === "title"
                        ? "مثال: مكتب الرياض"
                        : field === "country"
                        ? "مثال: السعودية"
                        : field === "state"
                        ? "مثال: الرياض"
                        : "مثال: جدة"
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-[#62a0f6]"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#1e1e1e]">
                  العنوان الكامل
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  placeholder="اكتب العنوان الكامل..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-[#62a0f6] h-24"
                />
              </div>

              {/* Lat / Lng */}
              {["latitude", "longitude"].map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#1e1e1e]">
                    {field === "latitude" ? "خط العرض (Latitude)" : "خط الطول (Longitude)"}
                  </label>
                  <input
                    type="number"
                    value={(formData as any)[field]}
                    onChange={(e) =>
                      handleFormChange(field as any, e.target.value)
                    }
                    placeholder={field === "latitude" ? "24.7136" : "46.6753"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-[#62a0f6]"
                  />
                </div>
              ))}

              {formError && <p className="text-sm text-red-500">{formError}</p>}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={handleSaveLocation}
                className="flex-1 bg-[#62a0f6] text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#5090e6]"
              >
                <Save className="w-4 h-4 inline-block mr-1" />
                {isEditing ? "حفظ التعديلات" : "حفظ واختيار"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                  setFormData({
                    title: "",
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    latitude: "",
                    longitude: "",
                  });
                }}
                className="flex-1 bg-[#e8eaf3] text-[#143087] py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#d5d9e8]"
              >
                العودة للخريطة
              </button>
            </div>
          </div>
        ) : (
          // Map view
          <div className="flex flex-col h-[80vh]">
            <div className="p-6 pb-4">
              <div className="flex items-center gap-4 border border-gray-300 rounded-xl p-4">
                <button onClick={handleSearch} className="text-gray-400 hover:text-gray-600">
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

            <div className="flex-1 relative">
              <div ref={mapRef} className="w-full h-full" />
              {!isMapLoaded && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62a0f6] mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">جاري تحميل الخريطة...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Selected location preview */}
            <div className="p-6 pt-4 border-t border-gray-200">
              {selectedLocation && (
                <div className="bg-[#eff6fe] rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-[#1e1e1e]">
                    {selectedLocation.title}
                  </h3>
                  <p className="text-sm">{selectedLocation.address}</p>
                  <p className="text-sm">
                    {selectedLocation.city}, {selectedLocation.state},{" "}
                    {selectedLocation.country}
                  </p>
                  {selectedLocation.latitude && selectedLocation.longitude && (
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedLocation.latitude.toFixed(6)},{" "}
                      {selectedLocation.longitude.toFixed(6)}
                    </p>
                  )}
                  {selectedLocation.link && (
                    <a
                      href={selectedLocation.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#62a0f6] hover:underline mt-1 block"
                    >
                      عرض على خرائط Google
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleSaveLocation}
                  className="flex-1 bg-[#62a0f6] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#5090e6]"
                >
                  حفظ واختيار
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex-1 bg-[#e8eaf3] text-[#143087] py-3 px-4 rounded-xl font-semibold hover:bg-[#d5d9e8]"
                >
                  إدخال موقع يدويًا
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
