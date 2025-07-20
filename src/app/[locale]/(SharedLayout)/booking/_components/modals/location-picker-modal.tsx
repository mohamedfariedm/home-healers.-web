"use client";
import { useState, useRef, useEffect } from "react";
import { X, Search, MapPin, Save, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Location } from "@/types/booking";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  savedLocations: Location[];
  updateSavedLocations: (locations: Location[]) => void; // New prop to update savedLocations
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
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [formData, setFormData] = useState({ title: "", address: "", city: "", country: "" });
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

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    const centerCoords = selectedLocation?.latitude && selectedLocation?.longitude
      ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
      : { lat: 24.7136, lng: 46.6753 }; // Default to Riyadh if no selected location

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: centerCoords,
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
      position: centerCoords,
      map: mapInstance.current,
      draggable: true,
      title: "الموقع المحدد",
    });

    // Handle map clicks
    mapInstance.current.addListener("click", (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      markerInstance.current.setPosition({ lat, lng });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: any) => {
          if (status === "OK" && results[0]) {
            const addressComponents = results[0].address_components;
            const city = addressComponents.find((c: any) => c.types.includes("locality"))?.long_name || "غير محدد";
            const country = addressComponents.find((c: any) => c.types.includes("country"))?.long_name || "غير محدد";
            setSelectedLocation({
              id: Date.now(),
              title: results[0].name || "الموقع المحدد",
              address: results[0].formatted_address,
              city,
              country,
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
            const addressComponents = results[0].address_components;
            const city = addressComponents.find((c: any) => c.types.includes("locality"))?.long_name || "غير محدد";
            const country = addressComponents.find((c: any) => c.types.includes("country"))?.long_name || "غير محدد";
            setSelectedLocation({
              id: Date.now(),
              title: results[0].name || "الموقع المحدد",
              address: results[0].formatted_address,
              city,
              country,
              latitude: lat,
              longitude: lng,
            });
          }
        }
      );
    });
  };

  const handleSearch = () => {
    if (!window.google || !searchQuery.trim()) {
      toast.error("يرجى إدخال عنوان للبحث");
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapInstance.current);
    const request = {
      query: searchQuery,
      fields: ["name", "geometry", "formatted_address", "address_components"],
    };

    service.textSearch(request, (results: any, status: any) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
        const place = results[0];
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const addressComponents = place.address_components;
        const city = addressComponents.find((c: any) => c.types.includes("locality"))?.long_name || "غير محدد";
        const country = addressComponents.find((c: any) => c.types.includes("country"))?.long_name || "غير محدد";

        mapInstance.current.setCenter(location);
        markerInstance.current.setPosition(location);

        setSelectedLocation({
          id: Date.now(),
          title: place.name || "الموقع المحدد",
          address: place.formatted_address || "",
          city,
          country,
          latitude: lat,
          longitude: lng,
        });
      } else {
        toast.error("لم يتم العثور على الموقع");
      }
    });
  };

  const handleSaveLocation = () => {
    if (showForm) {
      if (!formData.title.trim() || !formData.address.trim() || !formData.city.trim() || !formData.country.trim()) {
        setFormError("يرجى ملء جميع الحقول المطلوبة");
        return;
      }
      const location: Location = {
        id: isEditing && editingLocationId ? editingLocationId : Date.now(),
        title: formData.title,
        address: formData.address,
        city: formData.city,
        country: formData.country,
      };
      if (isEditing && editingLocationId) {
        const updatedLocations = savedLocations.map((loc) =>
          loc.id === editingLocationId ? location : loc
        );
        updateSavedLocations(updatedLocations);
        setSelectedLocation(location);
        toast.success("تم تعديل الموقع بنجاح");
      } else {
        onSave(location);
        setSelectedLocation(location);
        toast.success("تم حفظ الموقع بنجاح");
      }
      setFormData({ title: "", address: "", city: "", country: "" });
      setFormError("");
      setIsEditing(false);
      setEditingLocationId(null);
    } else if (selectedLocation) {
      onSave(selectedLocation);
      toast.success("تم حفظ الموقع بنجاح");
    } else {
      toast.error("يرجى اختيار موقع أولاً");
      return;
    }
    setShowForm(false);
    onClose();
  };

  const handleEditLocation = (location: Location) => {
    setFormData({
      title: location.title,
      address: location.address,
      city: location.city,
      country: location.country,
    });
    setIsEditing(true);
    setEditingLocationId(location.id);
    setShowSavedLocations(false);
    setShowForm(true);
  };

  const handleDeleteLocation = (id: number) => {
    const updatedLocations = savedLocations.filter((loc) => loc.id !== id);
    updateSavedLocations(updatedLocations);
    if (selectedLocation?.id === id) {
      setSelectedLocation(savedLocations.length > 1 ? savedLocations.find((loc) => loc.id !== id) || null : null);
    }
    toast.success("تم حذف الموقع بنجاح");
  };

  const handleSelectSavedLocation = (location: Location) => {
    setSelectedLocation(location);
    if (mapInstance.current && markerInstance.current && location.latitude && location.longitude) {
      const position = { lat: location.latitude, lng: location.longitude };
      mapInstance.current.setCenter(position);
      markerInstance.current.setPosition(position);
    }
    setShowSavedLocations(false);
    setShowForm(false);
  };

  const handleFormChange = (field: "title" | "address" | "city" | "country", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError("");
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
            {showSavedLocations
              ? "المواقع المحفوظة"
              : showForm
              ? isEditing
                ? "تعديل الموقع"
                : "إدخال موقع يدويًا"
              : "اختيار الموقع"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {showSavedLocations ? (
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="space-y-4">
              {savedLocations.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد مواقع محفوظة</p>
                  <button
                    onClick={() => {
                      setShowSavedLocations(false);
                      setShowForm(false);
                    }}
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
                      <h3 className="font-semibold text-[#1e1e1e] mb-1">{location.title}</h3>
                      <p className="text-sm text-gray-600">{location.address}</p>
                      <p className="text-sm text-gray-600">{location.city}, {location.country}</p>
                      {location.latitude && location.longitude && (
                        <p className="text-xs text-gray-400 mt-1">
                          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditLocation(location)}
                        className="text-[#62a0f6] hover:text-[#5090e6]"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSelectSavedLocation(location)}
                        className="bg-[#62a0f6] text-white px-4 py-2 rounded-lg hover:bg-[#5090e6] transition-colors"
                      >
                        اختيار
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowSavedLocations(false);
                  setShowForm(false);
                }}
                className="w-full bg-[#143087] text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#0f2470] transition-colors"
              >
                العودة للخريطة
              </button>
            </div>
          </div>
        ) : showForm ? (
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#1e1e1e]">عنوان الموقع</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  placeholder="أدخل عنوان الموقع (مثال: الرياض - السعودية)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#1e1e1e]">الدولة</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleFormChange("country", e.target.value)}
                  placeholder="أدخل الدولة (مثال: السعودية)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#1e1e1e]">المدينة</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleFormChange("city", e.target.value)}
                  placeholder="أدخل المدينة (مثال: الرياض)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#1e1e1e]">العنوان الكامل</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleFormChange("address", e.target.value)}
                  placeholder="أدخل العنوان الكامل (مثال: السعودية - الرياض - شارع الأمير محمد بن سلمان)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#62a0f6] h-24"
                />
              </div>
              {formError && (
                <p className="text-sm text-red-500">{formError}</p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
              <button
                onClick={handleSaveLocation}
                className="flex-1 bg-[#62a0f6] text-white py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#5090e6] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isEditing ? "حفظ التعديلات" : "حفظ واختيار"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                  setFormData({ title: "", address: "", city: "", country: "" });
                  setIsEditing(false);
                  setEditingLocationId(null);
                }}
                className="flex-1 bg-[#e8eaf3] text-[#143087] py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#d5d9e8] transition-colors"
              >
                العودة للخريطة
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-[80vh]">
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

            <div className="p-6 pt-4 border-t border-gray-200">
              <div className="mb-6">
                <div className="flex items-center gap-2 bg-[#eff6fe] rounded-t-xl px-4 py-3 w-fit">
                  <MapPin className="w-5 h-5 text-[#62a0f6]" />
                  <span className="text-base font-bold text-[#62a0f6]">الموقع المختار</span>
                </div>
                <div className="bg-[#eff6fe] rounded-xl rounded-tr-none p-4">
                  {selectedLocation ? (
                    <div className="flex justify-between items-start">
                      <button
                        onClick={handleSaveLocation}
                        className="flex items-center gap-2 bg-[#62a0f6] text-white px-4 py-2 rounded-lg hover:bg-[#5090e6] transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        حفظ واختيار
                      </button>
                      <div className="text-right">
                        <h3 className="text-base font-semibold text-[#1e1e1e] mb-1">{selectedLocation.title}</h3>
                        <p className="text-sm text-[#1e1e1e]">{selectedLocation.address}</p>
                        <p className="text-sm text-[#1e1e1e]">{selectedLocation.city}, {selectedLocation.country}</p>
                        {selectedLocation.latitude && selectedLocation.longitude && (
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600">لم يتم اختيار موقع بعد</p>
                      <p className="text-sm text-gray-500">ابحث عن موقع أو أدخل عنوانًا يدويًا</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowSavedLocations(true)}
                  className="flex-1 bg-[#e8eaf3] text-[#143087] py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#d5d9e8] transition-colors"
                >
                  عرض المواقع المحفوظة ({savedLocations.length})
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex-1 bg-[#e8eaf3] text-[#143087] py-3 px-4 rounded-xl text-sm font-semibold hover:bg-[#d5d9e8] transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
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